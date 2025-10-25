# 构建阶段
FROM golang:1.21-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装必要的工具
RUN apk add --no-cache git

# 复制go mod文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/api/main.go

# 运行阶段
FROM alpine:latest

# 安装ca证书
RUN apk --no-cache add ca-certificates

# 创建非root用户
RUN adduser -D -s /bin/sh appuser

# 设置工作目录
WORKDIR /root/

# 复制构建的二进制文件
COPY --from=builder /app/main .

# 创建默认配置文件
RUN echo "SERVER_PORT=8080" > .env && \
    echo "SERVER_HOST=0.0.0.0" >> .env && \
    echo "DB_HOST=postgres" >> .env && \
    echo "DB_PORT=5432" >> .env && \
    echo "DB_USER=postgres" >> .env && \
    echo "DB_PASSWORD=password" >> .env && \
    echo "DB_NAME=open_webui_lite" >> .env && \
    echo "DB_SSL_MODE=disable" >> .env && \
    echo "JWT_SECRET=your-secret-key-here" >> .env && \
    echo "JWT_ACCESS_EXPIRE=3600" >> .env && \
    echo "JWT_REFRESH_EXPIRE=604800" >> .env && \
    echo "LOG_LEVEL=info" >> .env && \
    echo "LOG_FORMAT=json" >> .env && \
    echo "CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000" >> .env && \
    echo "CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS" >> .env && \
    echo "CORS_ALLOWED_HEADERS=Content-Type,Authorization" >> .env

# 更改文件所有者
RUN chown -R appuser:appuser /root/

# 切换到非root用户
USER appuser

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["./main"]
