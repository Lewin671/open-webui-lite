package service

import "errors"

var (
    ErrUserExists         = errors.New("user already exists")
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrUnauthorized       = errors.New("unauthorized")
    ErrNotFound           = errors.New("not found")
)
