# Open WebUI Lite API 文档

## 概述

本文档描述了 Open WebUI Lite 的 RESTful API 接口规范。所有接口统一使用 `/v1` 版本前缀。

## 基础信息

- **Base URL**: `https://your-domain.com/v1`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (JWT)

## 认证接口

### 1. 用户登录

**POST** `/v1/auth/login`

用户登录获取访问令牌。

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**错误响应:**
```json
{
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

### 2. 刷新令牌

**POST** `/v1/auth/refresh`

使用刷新令牌获取新的访问令牌。

**请求体:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### 3. 获取用户信息

**GET** `/v1/me`

获取当前用户信息。

**请求头:**
```
Authorization: Bearer <accessToken>
```

**响应:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

> **注意**: 如果暂不开放用户注册，可以跳过 `/signup` 接口。登出功能可由前端直接丢弃 token，后端可选择实现黑名单机制。

## 会话管理

### 4. 创建会话

**POST** `/v1/conversations`

创建新的对话会话。

**请求体:**
```json
{
  "title": "新对话",
  "metadata": {
    "tags": ["工作", "重要"],
    "priority": "high"
  }
}
```

**响应:**
```json
{
  "id": "conv_123",
  "title": "新对话",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "metadata": {
    "tags": ["工作", "重要"],
    "priority": "high"
  }
}
```

### 5. 获取会话详情

**GET** `/v1/conversations/:id`

获取指定会话的详细信息。

**路径参数:**
- `id` (string): 会话ID

**响应:**
```json
{
  "id": "conv_123",
  "title": "新对话",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "messageCount": 5,
  "metadata": {
    "tags": ["工作", "重要"],
    "priority": "high"
  }
}
```

> **说明**: 会话列表、重命名、删除等功能可以后续实现。客户端只需要获取到会话 `id` 即可发送消息。

## 消息处理

### 6. 发送消息

**POST** `/v1/conversations/:id/messages`

向指定会话发送消息并获取AI回复。支持同步和流式两种响应模式。

**路径参数:**
- `id` (string)`: 会话ID

**请求头:**
- 同步模式: `Accept: application/json`
- 流式模式: `Accept: text/event-stream`

**请求体:**
```json
{
  "role": "user",
  "content": "你好，请帮我写一个Python函数来计算斐波那契数列",
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 1000,
  "stream": false
}
```

**字段说明:**
- `role` (string, required): 消息角色，固定为 "user"
- `content` (string, required): 消息内容
- `model` (string, required): 使用的AI模型
- `temperature` (number, optional): 温度参数，范围 0-2，默认 0.7
- `maxTokens` (number, optional): 最大生成token数
- `stream` (boolean, optional): 是否使用流式响应，默认 false

#### 同步响应 (application/json)

**响应:**
```json
{
  "message": {
    "id": "msg_123",
    "role": "assistant",
    "content": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "usage": {
    "promptTokens": 25,
    "completionTokens": 8,
    "totalTokens": 33
  }
}
```

#### 流式响应 (text/event-stream)

**响应格式:**
```
event: message.delta
data: {"delta": "def"}

event: message.delta
data: {"delta": " fibonacci"}

event: message.delta
data: {"delta": "(n):"}

event: message.done
data: {"message":{"id":"msg_123","role":"assistant","content":"def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)","createdAt":"2024-01-01T00:00:00Z"},"usage":{"promptTokens":25,"completionTokens":8,"totalTokens":33}}
```

**事件类型:**
- `message.delta`: 消息增量更新
- `message.done`: 消息完成
- `error`: 错误信息

> **说明**: 该接口会自动将用户消息和AI回复都保存到数据库，客户端无需额外调用保存接口。

## 模型管理

### 7. 获取可用模型

**GET** `/v1/models`

获取系统支持的AI模型列表。

**响应:**
```json
{
  "data": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "context": 128000,
      "maxTokens": 4096,
      "description": "最强大的GPT-4模型",
      "available": true
    },
    {
      "id": "gpt-3.5-turbo",
      "name": "GPT-3.5 Turbo",
      "context": 16384,
      "maxTokens": 4096,
      "description": "快速且经济的模型",
      "available": true
    }
  ]
}
```

> **说明**: 此接口用于前端模型选择下拉框。如果只对接单一模型，可以暂不实现此接口。

## 错误处理

所有接口都遵循统一的错误响应格式：

```json
{
  "error": "错误描述",
  "code": "ERROR_CODE",
  "details": "详细错误信息（可选）"
}
```

**常见错误码:**
- `UNAUTHORIZED`: 未授权访问
- `INVALID_CREDENTIALS`: 认证失败
- `NOT_FOUND`: 资源不存在
- `VALIDATION_ERROR`: 请求参数错误
- `RATE_LIMITED`: 请求频率超限
- `INTERNAL_ERROR`: 服务器内部错误

## 状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权
- `403 Forbidden`: 禁止访问
- `404 Not Found`: 资源不存在
- `429 Too Many Requests`: 请求频率超限
- `500 Internal Server Error`: 服务器内部错误