package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/cloudwego/hertz/pkg/app"
	"golang.org/x/crypto/bcrypt"
	"open-webui-lite/server/internal/dto"
	"open-webui-lite/server/internal/middleware"
	"open-webui-lite/server/internal/repository"
	"open-webui-lite/server/pkg/jwt"
)

type AuthHandler struct {
	userRepo repository.UserRepository
}

func NewAuthHandler(userRepo repository.UserRepository) *AuthHandler {
	return &AuthHandler{
		userRepo: userRepo,
	}
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

	// Get user by email
	user, err := h.userRepo.GetByEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{
			Error: "Invalid credentials",
			Code:  "INVALID_CREDENTIALS",
		})
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{
			Error: "Invalid credentials",
			Code:  "INVALID_CREDENTIALS",
		})
		return
	}

	// Generate tokens
	accessToken, refreshToken, err := jwt.GenerateTokenPair(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to generate tokens",
			Code:  "INTERNAL_ERROR",
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

	// Validate refresh token and generate new access token
	accessToken, _, err := jwt.RefreshToken(req.RefreshToken)
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
	
	user, err := h.userRepo.GetByID(userID)
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
