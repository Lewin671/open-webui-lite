package service

import (
    "golang.org/x/crypto/bcrypt"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
    "open-webui-lite/server/pkg/jwt"
)

// AuthService handles user authentication workflows.
type AuthService interface {
    Register(req dto.RegisterRequest) (*model.User, string, string, error)
    Login(req dto.LoginRequest) (string, string, error)
    Refresh(refreshToken string) (string, error)
    GetUserInfo(userID string) (*model.User, error)
}

type authService struct {
    users repository.UserRepository
}

func NewAuthService(users repository.UserRepository) AuthService {
    return &authService{users: users}
}

func (s *authService) Register(req dto.RegisterRequest) (*model.User, string, string, error) {
    if existing, err := s.users.GetByEmail(req.Email); err == nil && existing != nil {
        return nil, "", "", ErrUserExists
    }

    hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, "", "", err
    }

    user := &model.User{Email: req.Email, Password: string(hashed), Name: req.Name}
    if err := s.users.Create(user); err != nil {
        return nil, "", "", err
    }

    access, refresh, err := jwt.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return nil, "", "", err
    }
    return user, access, refresh, nil
}

func (s *authService) Login(req dto.LoginRequest) (string, string, error) {
    user, err := s.users.GetByEmail(req.Email)
    if err != nil {
        return "", "", ErrInvalidCredentials
    }
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        return "", "", ErrInvalidCredentials
    }
    access, refresh, err := jwt.GenerateTokenPair(user.ID, user.Email)
    if err != nil {
        return "", "", err
    }
    return access, refresh, nil
}

func (s *authService) Refresh(refreshToken string) (string, error) {
    access, _, err := jwt.RefreshToken(refreshToken)
    if err != nil {
        return "", err
    }
    return access, nil
}

func (s *authService) GetUserInfo(userID string) (*model.User, error) {
    return s.users.GetByID(userID)
}
