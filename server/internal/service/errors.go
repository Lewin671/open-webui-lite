package service

import "errors"

var (
    ErrUserExists         = errors.New("user already exists")
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrForbidden          = errors.New("forbidden")
    ErrNotFound           = errors.New("not found")
)
