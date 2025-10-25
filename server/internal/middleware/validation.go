package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/go-playground/validator/v10"
	"open-webui-lite/server/internal/dto"
)

// ValidationMiddleware 提供统一的参数校验中间件
func ValidationMiddleware() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		c.Next(ctx)
	}
}

// ValidateStruct 校验结构体并返回详细的错误信息
func ValidateStruct(s interface{}) []string {
	validate := validator.New()
	var errors []string

	err := validate.Struct(s)
	if err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			for _, err := range validationErrors {
				field := strings.ToLower(err.Field())
				tag := err.Tag()
				param := err.Param()

				var message string
				switch tag {
				case "required":
					message = fmt.Sprintf("%s is required", field)
				case "min":
					message = fmt.Sprintf("%s must be at least %s characters long", field, param)
				case "max":
					message = fmt.Sprintf("%s must be no more than %s characters long", field, param)
				case "email":
					message = fmt.Sprintf("%s must be a valid email address", field)
				case "oneof":
					message = fmt.Sprintf("%s must be one of: %s", field, param)
				default:
					message = fmt.Sprintf("%s is invalid", field)
				}
				errors = append(errors, message)
			}
		}
	}

	return errors
}

// ValidationErrorResponse 返回校验错误响应
func ValidationErrorResponse(c *app.RequestContext, errors []string) {
	c.JSON(http.StatusBadRequest, dto.ErrorResponse{
		Error: "Validation failed",
		Code:  "VALIDATION_ERROR",
		Details: map[string]interface{}{
			"errors": errors,
		},
	})
}
