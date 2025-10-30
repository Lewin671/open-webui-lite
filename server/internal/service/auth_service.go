package service

import (
    "golang.org/x/crypto/bcrypt"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
)

// AuthService defines authentication-related business logic.
type AuthService interface {
    RegisterUser(req dto.RegisterRequest) (*model.User, error)
    ValidateCredentials(email, password string) (*model.User, error)
}

type authService struct {
    userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
    return &authService{userRepo: userRepo}
}

func (s *authService) RegisterUser(req dto.RegisterRequest) (*model.User, error) {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }

    user := &model.User{
        Email:    req.Email,
        Password: string(hashedPassword),
        Name:     req.Name,
    }

    if err := s.userRepo.Create(user); err != nil {
        return nil, err
    }
    return user, nil
}

func (s *authService) ValidateCredentials(email, password string) (*model.User, error) {
    user, err := s.userRepo.GetByEmail(email)
    if err != nil {
        return nil, err
    }
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        return nil, err
    }
    return user, nil
}
