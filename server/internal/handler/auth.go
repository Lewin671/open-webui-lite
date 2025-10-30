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

type AuthHandler struct {
    authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
    return &AuthHandler{authService: authService}
}

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

    resp, err := h.authService.Register(req)
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
    // Normalize timestamp format to RFC3339 if needed
    resp.User.CreatedAt = time.Now().Format(time.RFC3339)
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

    resp, err := h.authService.Login(req)
    if err != nil {
        status := http.StatusUnauthorized
        code := "INVALID_CREDENTIALS"
        if err == service.ErrInternal {
            status = http.StatusInternalServerError
            code = "INTERNAL_ERROR"
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

    resp, err := h.authService.Refresh(req)
    if err != nil {
        status := http.StatusUnauthorized
        code := "UNAUTHORIZED"
        c.JSON(status, dto.ErrorResponse{Error: http.StatusText(status), Code: code})
        return
    }
    c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) GetUserInfo(ctx context.Context, c *app.RequestContext) {
    userID := c.GetString("user_id")
    info, err := h.authService.GetUserInfo(userID)
    if err != nil {
        c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "User not found", Code: "NOT_FOUND"})
        return
    }
    // normalize timestamp if needed
    info.CreatedAt = time.Now().Format(time.RFC3339)
    c.JSON(http.StatusOK, info)
}
