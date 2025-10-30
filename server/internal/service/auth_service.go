package service

import (
    "errors"
    "golang.org/x/crypto/bcrypt"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
    "open-webui-lite/server/pkg/jwt"
)

// AuthService encapsulates authentication business logic.
type AuthService interface {
    Register(req dto.RegisterRequest) (dto.RegisterResponse, error)
    Login(req dto.LoginRequest) (dto.LoginResponse, error)
    Refresh(req dto.RefreshRequest) (dto.RefreshResponse, error)
    GetUserInfo(userID string) (dto.UserInfo, error)
}

// authService implements AuthService.
type authService struct {
    userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
    return &authService{userRepo: userRepo}
}

func (s *authService) Register(req dto.RegisterRequest) (dto.RegisterResponse, error) {
    // Check if user exists
    if existing, err := s.userRepo.GetByEmail(req.Email); err == nil && existing != nil {
        return dto.RegisterResponse{}, ErrUserExists
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return dto.RegisterResponse{}, ErrInternal
    }

    user := &model.User{Email: req.Email, Password: string(hashedPassword), Name: req.Name}
    if err := s.userRepo.Create(user); err != nil {
        return dto.RegisterResponse{}, ErrInternal
    }

    accessToken, refreshToken, err := jwt.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return dto.RegisterResponse{}, ErrInternal
    }

    return dto.RegisterResponse{
        User: dto.UserInfo{
            ID:        user.ID,
            Email:     user.Email,
            Name:      user.Name,
            Avatar:    user.Avatar,
            CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
        },
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
        ExpiresIn:    3600,
    }, nil
}

func (s *authService) Login(req dto.LoginRequest) (dto.LoginResponse, error) {
    user, err := s.userRepo.GetByEmail(req.Email)
    if err != nil {
        return dto.LoginResponse{}, ErrInvalidCredentials
    }
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        return dto.LoginResponse{}, ErrInvalidCredentials
    }
    accessToken, refreshToken, err := jwt.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return dto.LoginResponse{}, ErrInternal
    }
    return dto.LoginResponse{AccessToken: accessToken, RefreshToken: refreshToken, ExpiresIn: 3600}, nil
}

func (s *authService) Refresh(req dto.RefreshRequest) (dto.RefreshResponse, error) {
    accessToken, _, err := jwt.RefreshToken(req.RefreshToken)
    if err != nil {
        return dto.RefreshResponse{}, ErrUnauthorized
    }
    return dto.RefreshResponse{AccessToken: accessToken, ExpiresIn: 3600}, nil
}

func (s *authService) GetUserInfo(userID string) (dto.UserInfo, error) {
    user, err := s.userRepo.GetByID(userID)
    if err != nil {
        return dto.UserInfo{}, ErrNotFound
    }
    return dto.UserInfo{
        ID:        user.ID,
        Email:     user.Email,
        Name:      user.Name,
        Avatar:    user.Avatar,
        CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
    }, nil
}

var (
    // Domain-level errors for mapping in handlers
    ErrUserExists         = errors.New("USER_EXISTS")
    ErrInvalidCredentials = errors.New("INVALID_CREDENTIALS")
    ErrUnauthorized       = errors.New("UNAUTHORIZED")
    ErrNotFound           = errors.New("NOT_FOUND")
    ErrInternal           = errors.New("INTERNAL_ERROR")
)
