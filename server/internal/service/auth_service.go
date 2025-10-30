package service

import (
    "time"

    "golang.org/x/crypto/bcrypt"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
    "open-webui-lite/server/pkg/jwt"
)

// AuthService defines authentication related business logic
type AuthService interface {
    Register(req dto.RegisterRequest) (*dto.RegisterResponse, error)
    Login(req dto.LoginRequest) (*dto.LoginResponse, error)
    Refresh(refreshToken string) (*dto.RefreshResponse, error)
    GetUserInfo(userID string) (*dto.UserInfo, error)
}

type authService struct {
    userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
    return &authService{userRepo: userRepo}
}

func (s *authService) Register(req dto.RegisterRequest) (*dto.RegisterResponse, error) {
    if existing, err := s.userRepo.GetByEmail(req.Email); err == nil && existing != nil {
        return nil, ErrUserExists
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }

    user := &model.User{Email: req.Email, Password: string(hashedPassword), Name: req.Name}
    if err := s.userRepo.Create(user); err != nil {
        return nil, err
    }

    accessToken, refreshToken, err := jwt.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return nil, err
    }

    resp := &dto.RegisterResponse{
        User: dto.UserInfo{
            ID:        user.ID,
            Email:     user.Email,
            Name:      user.Name,
            Avatar:    user.Avatar,
            CreatedAt: user.CreatedAt.Format(time.RFC3339),
        },
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
        ExpiresIn:    3600,
    }
    return resp, nil
}

func (s *authService) Login(req dto.LoginRequest) (*dto.LoginResponse, error) {
    user, err := s.userRepo.GetByEmail(req.Email)
    if err != nil {
        return nil, ErrInvalidCredentials
    }
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        return nil, ErrInvalidCredentials
    }
    accessToken, refreshToken, err := jwt.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return nil, err
    }
    return &dto.LoginResponse{AccessToken: accessToken, RefreshToken: refreshToken, ExpiresIn: 3600}, nil
}

func (s *authService) Refresh(refreshToken string) (*dto.RefreshResponse, error) {
    accessToken, _, err := jwt.RefreshToken(refreshToken)
    if err != nil {
        return nil, ErrUnauthorized
    }
    return &dto.RefreshResponse{AccessToken: accessToken, ExpiresIn: 3600}, nil
}

func (s *authService) GetUserInfo(userID string) (*dto.UserInfo, error) {
    user, err := s.userRepo.GetByID(userID)
    if err != nil {
        return nil, ErrNotFound
    }
    return &dto.UserInfo{
        ID:        user.ID,
        Email:     user.Email,
        Name:      user.Name,
        Avatar:    user.Avatar,
        CreatedAt: user.CreatedAt.Format(time.RFC3339),
    }, nil
}
