.PHONY: build run test clean deps migrate seed

# Build the application
build:
	go build -o bin/api cmd/api/main.go

# Run the application
run:
	go run cmd/api/main.go

# Install dependencies
deps:
	go mod tidy
	go mod download

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Database migration
migrate:
	go run cmd/migrate/main.go

# Seed database with initial data
seed:
	go run cmd/seed/main.go

# Generate Kitex code
kitex:
	kitex -module open-webui-lite/server -service auth idl/auth.thrift
	kitex -module open-webui-lite/server -service conversation idl/conversation.thrift
	kitex -module open-webui-lite/server -service message idl/message.thrift
	kitex -module open-webui-lite/server -service model idl/model.thrift

# Development setup
dev-setup: deps kitex migrate seed

# Production build
prod-build:
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/api cmd/api/main.go
