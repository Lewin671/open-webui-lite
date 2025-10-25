# Open WebUI Lite - Backend API

A production-ready Go backend service using CloudWeGo's Hertz (HTTP) and Kitex (RPC) frameworks with PostgreSQL database, implementing all 7 API endpoints specified in the README.

## Features

- **High Performance**: Built with CloudWeGo's Hertz HTTP framework and Kitex RPC framework
- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **PostgreSQL Database**: Robust data persistence with GORM ORM
- **Streaming Support**: Server-Sent Events (SSE) for real-time message streaming
- **Mock AI Integration**: Realistic mock AI responses for development and testing
- **Structured Logging**: JSON-formatted logs with zerolog
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Unified error response format with proper HTTP status codes

## Technology Stack

- **Web Framework**: [Hertz](https://github.com/cloudwego/hertz) - ByteDance's high-performance HTTP framework
- **RPC Framework**: [Kitex](https://github.com/cloudwego/kitex) - ByteDance's high-performance RPC framework
- **Language**: Go 1.21+
- **Database**: PostgreSQL with GORM ORM
- **Authentication**: JWT with bcrypt password hashing
- **Logging**: Structured JSON logging with zerolog
- **Configuration**: Environment variables with viper

## Quick Start

### Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher
- Make (optional, for using Makefile commands)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd open-webui-lite/server
   ```

2. **Install dependencies**:
   ```bash
   make deps
   # or
   go mod tidy
   ```

3. **Setup environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and JWT configuration
   ```

4. **Setup database**:
   ```bash
   # Create PostgreSQL database
   createdb open_webui_lite
   
   # Run migrations
   make migrate
   # or
   go run cmd/migrate/main.go
   
   # Seed with test data
   make seed
   # or
   go run cmd/seed/main.go
   ```

5. **Start the server**:
   ```bash
   make run
   # or
   go run cmd/api/main.go
   ```

The server will start on `http://localhost:8080` by default.

## API Endpoints

### Authentication

- `POST /v1/auth/login` - User login
- `POST /v1/auth/refresh` - Refresh access token
- `GET /v1/me` - Get current user info

### Conversations

- `POST /v1/conversations` - Create new conversation
- `GET /v1/conversations/:id` - Get conversation details

### Messages

- `POST /v1/conversations/:id/messages` - Send message (sync or streaming)

### Models

- `GET /v1/models` - Get available AI models

## Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and modify as needed:

```env
# Server Configuration
SERVER_PORT=8080
SERVER_HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=open_webui_lite
DB_SSL_MODE=disable

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production
JWT_ACCESS_EXPIRE=3600
JWT_REFRESH_EXPIRE=604800

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
```

## Development

### Available Commands

```bash
# Install dependencies
make deps

# Run the application
make run

# Build for production
make build

# Run tests
make test

# Clean build artifacts
make clean

# Database migration
make migrate

# Seed database
make seed

# Generate Kitex code (if using RPC)
make kitex

# Development setup (all-in-one)
make dev-setup
```

### Project Structure

```
server/
├── cmd/
│   ├── api/                    # HTTP server entry point
│   ├── migrate/                # Database migration
│   └── seed/                   # Database seeding
├── internal/
│   ├── handler/               # HTTP handlers
│   ├── service/              # Business logic services
│   ├── model/                # Database models
│   ├── middleware/            # HTTP middleware
│   ├── repository/            # Database operations
│   └── dto/                   # Request/response DTOs
├── idl/                      # Thrift IDL definitions
├── kitex_gen/                # Generated Kitex code
├── pkg/
│   ├── config/               # Configuration management
│   ├── database/             # Database connection
│   ├── jwt/                  # JWT utilities
│   └── logger/               # Structured logging
├── go.mod
├── go.sum
├── Makefile
└── .env.example
```

## Testing the API

### 1. Login

```bash
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Create Conversation

```bash
curl -X POST http://localhost:8080/v1/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My First Conversation",
    "metadata": {
      "tags": ["work", "important"],
      "priority": "high"
    }
  }'
```

### 3. Send Message (Sync)

```bash
curl -X POST http://localhost:8080/v1/conversations/CONVERSATION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "role": "user",
    "content": "Hello, how are you?",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 1000,
    "stream": false
  }'
```

### 4. Send Message (Streaming)

```bash
curl -X POST http://localhost:8080/v1/conversations/CONVERSATION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "role": "user",
    "content": "Tell me a story",
    "model": "gpt-4",
    "stream": true
  }'
```

### 5. Get Models

```bash
curl -X GET http://localhost:8080/v1/models
```

## Production Deployment

### Build for Production

```bash
make prod-build
```

### Docker Support

Create a `Dockerfile`:

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/api/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
CMD ["./main"]
```

### Environment Variables for Production

Make sure to set secure values for production:

- `JWT_SECRET`: Use a strong, random secret key
- `DB_PASSWORD`: Use a strong database password
- `DB_SSL_MODE`: Set to `require` for production
- `LOG_LEVEL`: Set to `info` or `warn` for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.