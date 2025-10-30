package handler

import (
    "context"
    "net/http"
    "time"

    "github.com/cloudwego/hertz/pkg/app"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/middleware"
    "open-webui-lite/server/internal/service"
)

type AuthHandler struct { auth service.AuthService }

func NewAuthHandler(auth service.AuthService) *AuthHandler { return &AuthHandler{auth: auth} }

func (h *AuthHandler) Register(ctx context.Context, c *app.RequestContext) {
	var req dto.RegisterRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Invalid JSON format",
			Code:  "INVALID_JSON",
		})
		return
	}

	// 使用自定义校验获取详细错误信息
	validationErrors := middleware.ValidateStruct(&req)
	if len(validationErrors) > 0 {
		middleware.ValidationErrorResponse(c, validationErrors)
		return
	}

    user, accessToken, refreshToken, err := h.auth.Register(req)
	if err != nil {
        if err == service.ErrUserExists {
            c.JSON(http.StatusConflict, dto.ErrorResponse{Error: "User already exists", Code: "USER_EXISTS"})
            return
        }
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to generate tokens",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	c.JSON(http.StatusCreated, dto.RegisterResponse{
		User: dto.UserInfo{
			ID:        user.ID,
			Email:     user.Email,
			Name:      user.Name,
			Avatar:    user.Avatar,
			CreatedAt: user.CreatedAt.Format(time.RFC3339),
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    3600, // 1 hour
	})
}

func (h *AuthHandler) Login(ctx context.Context, c *app.RequestContext) {
	var req dto.LoginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Invalid JSON format",
			Code:  "INVALID_JSON",
		})
		return
	}

	// 使用自定义校验获取详细错误信息
	validationErrors := middleware.ValidateStruct(&req)
	if len(validationErrors) > 0 {
		middleware.ValidationErrorResponse(c, validationErrors)
		return
	}

    accessToken, refreshToken, err := h.auth.Login(req)
	if err != nil {
        status := http.StatusUnauthorized
        code := "INVALID_CREDENTIALS"
        if err != service.ErrInvalidCredentials {
            status = http.StatusInternalServerError
            code = "INTERNAL_ERROR"
        }
        c.JSON(status, dto.ErrorResponse{
			Error: "Failed to generate tokens",
            Code:  code,
		})
		return
	}

	c.JSON(http.StatusOK, dto.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    3600, // 1 hour
	})
}

func (h *AuthHandler) Refresh(ctx context.Context, c *app.RequestContext) {
	var req dto.RefreshRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Invalid JSON format",
			Code:  "INVALID_JSON",
		})
		return
	}

	// 使用自定义校验获取详细错误信息
	validationErrors := middleware.ValidateStruct(&req)
	if len(validationErrors) > 0 {
		middleware.ValidationErrorResponse(c, validationErrors)
		return
	}

    accessToken, err := h.auth.Refresh(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{
			Error: "Invalid refresh token",
			Code:  "UNAUTHORIZED",
		})
		return
	}

	c.JSON(http.StatusOK, dto.RefreshResponse{
		AccessToken: accessToken,
		ExpiresIn:   3600, // 1 hour
	})
}

func (h *AuthHandler) GetUserInfo(ctx context.Context, c *app.RequestContext) {
    userID := c.GetString("user_id")
    user, err := h.auth.GetUserInfo(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: "User not found",
			Code:  "NOT_FOUND",
		})
		return
	}

	c.JSON(http.StatusOK, dto.UserInfo{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Avatar:    user.Avatar,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
	})
}
