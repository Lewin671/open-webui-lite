#!/bin/bash

# 测试参数校验功能
echo "Testing parameter validation..."

# 测试创建对话 - 正常情况
echo "1. Testing valid conversation creation..."
curl -X POST http://localhost:8080/v1/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Conversation",
    "metadata": {"key": "value"}
  }'

echo -e "\n\n2. Testing invalid conversation creation (empty title)..."
curl -X POST http://localhost:8080/v1/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "",
    "metadata": {"key": "value"}
  }'

echo -e "\n\n3. Testing invalid conversation creation (title too long)..."
curl -X POST http://localhost:8080/v1/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "'$(printf 'a%.0s' {1..201})'",
    "metadata": {"key": "value"}
  }'

echo -e "\n\n4. Testing invalid message creation (invalid role)..."
curl -X POST http://localhost:8080/v1/conversations/CONVERSATION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "role": "invalid_role",
    "content": "Hello",
    "model": "gpt-3.5-turbo"
  }'

echo -e "\n\n5. Testing invalid message creation (content too long)..."
curl -X POST http://localhost:8080/v1/conversations/CONVERSATION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "role": "user",
    "content": "'$(printf 'a%.0s' {1..10001})'",
    "model": "gpt-3.5-turbo"
  }'

echo -e "\n\n6. Testing invalid message creation (temperature out of range)..."
curl -X POST http://localhost:8080/v1/conversations/CONVERSATION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "role": "user",
    "content": "Hello",
    "model": "gpt-3.5-turbo",
    "temperature": 5.0
  }'

echo -e "\n\n7. Testing invalid login (password too short)..."
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123"
  }'

echo -e "\n\n8. Testing invalid login (invalid email)..."
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123"
  }'

echo -e "\n\nValidation tests completed!"
