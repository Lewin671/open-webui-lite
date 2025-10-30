package handler

import (
    "context"
    "net/http"

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

    resp, err := h.auth.Register(req)
    if err != nil {
        status := http.StatusInternalServerError
        code := "INTERNAL_ERROR"
        if err == service.ErrUserExists {
            status = http.StatusConflict
            code = "USER_EXISTS"
        }
        c.JSON(status, dto.ErrorResponse{Error: http.StatusText(status), Code: code})
        return
    }
    c.JSON(http.StatusCreated, resp)
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

    resp, err := h.auth.Login(req)
    if err != nil {
        status := http.StatusInternalServerError
        code := "INTERNAL_ERROR"
        if err == service.ErrInvalidCredentials {
            status = http.StatusUnauthorized
            code = "INVALID_CREDENTIALS"
        }
        c.JSON(status, dto.ErrorResponse{Error: http.StatusText(status), Code: code})
        return
    }
    c.JSON(http.StatusOK, resp)
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

    resp, err := h.auth.Refresh(req.RefreshToken)
    if err != nil {
        c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "Invalid refresh token", Code: "UNAUTHORIZED"})
        return
    }
    c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) GetUserInfo(ctx context.Context, c *app.RequestContext) {
    userID := c.GetString("user_id")
    info, err := h.auth.GetUserInfo(userID)
    if err != nil {
        c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "User not found", Code: "NOT_FOUND"})
        return
    }
    c.JSON(http.StatusOK, info)
}
