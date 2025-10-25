# Open WebUI Lite Backend - Docker部署指南

## 🐳 Docker环境概览

本项目使用Docker Compose提供完整的开发和生产环境，包括：

- **PostgreSQL 15**: 生产级数据库
- **Go API服务**: 高性能后端服务
- **自动迁移**: 数据库结构自动创建
- **种子数据**: 测试用户和初始数据

## 🚀 快速开始

### 1. 启动服务

```bash
# 一键启动所有服务
./start.sh
```

### 2. 测试API

```bash
# 运行完整测试套件
./test_docker.sh
```

### 3. 停止服务

```bash
# 停止所有服务
./stop.sh
```

## 📋 服务架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   API Service   │    │   Migration    │
│   Port: 5432    │◄───┤   Port: 8080    │◄───┤   & Seed       │
│   Database      │    │   REST API      │    │   Data         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 详细配置

### 环境变量

```yaml
# 服务器配置
SERVER_PORT: 8080
SERVER_HOST: 0.0.0.0

# 数据库配置
DB_HOST: postgres
DB_PORT: 5432
DB_USER: postgres
DB_PASSWORD: password
DB_NAME: open_webui_lite
DB_SSL_MODE: disable

# JWT配置
JWT_SECRET: your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRE: 3600
JWT_REFRESH_EXPIRE: 604800

# CORS配置
CORS_ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5173,http://localhost:8080
```

### 数据库连接

- **主机**: `postgres` (Docker内部网络)
- **端口**: `5432`
- **数据库**: `open_webui_lite`
- **用户**: `postgres`
- **密码**: `password`

## 📊 API端点

### 认证端点
- `POST /v1/auth/login` - 用户登录
- `POST /v1/auth/refresh` - 刷新令牌
- `GET /v1/me` - 获取用户信息

### 对话端点
- `POST /v1/conversations` - 创建对话
- `GET /v1/conversations/:id` - 获取对话详情

### 消息端点
- `POST /v1/conversations/:id/messages` - 发送消息
  - 同步模式: `Accept: application/json`
  - 流式模式: `Accept: text/event-stream`

### 模型端点
- `GET /v1/models` - 获取可用模型

### 健康检查
- `GET /health` - 服务健康状态

## 🧪 测试示例

### 1. 健康检查
```bash
curl http://localhost:8080/health
```

### 2. 用户登录
```bash
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. 创建对话
```bash
curl -X POST http://localhost:8080/v1/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "我的对话",
    "metadata": {
      "tags": ["工作", "重要"]
    }
  }'
```

### 4. 发送消息
```bash
curl -X POST http://localhost:8080/v1/conversations/CONV_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "role": "user",
    "content": "你好，请介绍一下你自己",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 1000,
    "stream": false
  }'
```

### 5. 流式消息
```bash
curl -X POST http://localhost:8080/v1/conversations/CONV_ID/messages \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "role": "user",
    "content": "请写一个Python函数",
    "model": "gpt-4",
    "stream": true
  }'
```

## 🔍 监控和调试

### 查看日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f api
docker-compose logs -f postgres
```

### 进入容器
```bash
# 进入API容器
docker-compose exec api sh

# 进入数据库容器
docker-compose exec postgres psql -U postgres -d open_webui_lite
```

### 数据库管理
```bash
# 连接数据库
docker-compose exec postgres psql -U postgres -d open_webui_lite

# 查看表结构
\dt

# 查看用户数据
SELECT * FROM users;

# 查看对话数据
SELECT * FROM conversations;
```

## 🛠️ 开发模式

### 本地开发
```bash
# 只启动数据库
docker-compose up -d postgres

# 本地运行API服务
go run cmd/api/main.go
```

### 热重载开发
```bash
# 使用air进行热重载
go install github.com/cosmtrek/air@latest
air
```

## 🚀 生产部署

### 环境变量配置
```bash
# 生产环境变量
export JWT_SECRET="your-production-secret-key"
export DB_PASSWORD="your-production-password"
export CORS_ALLOWED_ORIGINS="https://yourdomain.com"
```

### 构建生产镜像
```bash
# 构建生产镜像
docker-compose -f docker-compose.prod.yml build

# 启动生产环境
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 文件结构

```
server/
├── Dockerfile              # API服务镜像
├── Dockerfile.migrate      # 数据库迁移镜像
├── docker-compose.yml      # Docker Compose配置
├── init.sql               # 数据库初始化脚本
├── start.sh               # 启动脚本
├── stop.sh                # 停止脚本
├── test_docker.sh         # 测试脚本
└── DOCKER_GUIDE.md        # 本文档
```

## 🔧 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :8080
   lsof -i :5432
   ```

2. **数据库连接失败**
   ```bash
   # 检查数据库状态
   docker-compose ps postgres
   docker-compose logs postgres
   ```

3. **API服务启动失败**
   ```bash
   # 检查API日志
   docker-compose logs api
   ```

4. **权限问题**
   ```bash
   # 修复脚本权限
   chmod +x *.sh
   ```

### 清理环境
```bash
# 停止并删除所有容器和卷
docker-compose down -v

# 清理未使用的镜像
docker system prune -a
```

## 📈 性能优化

### 数据库优化
- 使用连接池
- 添加数据库索引
- 定期清理日志

### API优化
- 启用Gzip压缩
- 使用Redis缓存
- 负载均衡

## 🔒 安全配置

### 生产环境安全
1. 更改默认密码
2. 使用强JWT密钥
3. 配置HTTPS
4. 限制CORS域名
5. 启用数据库SSL

### 网络安全
```yaml
# 限制数据库访问
postgres:
  ports:
    - "127.0.0.1:5432:5432"  # 只允许本地访问
```

## 📚 相关文档

- [Docker Compose文档](https://docs.docker.com/compose/)
- [PostgreSQL文档](https://www.postgresql.org/docs/)
- [Hertz框架文档](https://github.com/cloudwego/hertz)
- [API文档](./README.md)
