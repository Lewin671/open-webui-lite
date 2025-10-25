#!/bin/bash

# Test script for Open WebUI Lite API
# Make sure the server is running on localhost:8080

BASE_URL="http://localhost:8080/v1"

echo "Testing Open WebUI Lite API..."
echo "================================"

# Test 1: Health check
echo "1. Testing health check..."
curl -s "$BASE_URL/../health" | jq .
echo ""

# Test 2: Login
echo "2. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .

# Extract access token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "Login failed! Make sure to run 'make seed' first to create test user."
  exit 1
fi

echo "Access token: $ACCESS_TOKEN"
echo ""

# Test 3: Get user info
echo "3. Testing get user info..."
curl -s -X GET "$BASE_URL/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

# Test 4: Get models
echo "4. Testing get models..."
curl -s -X GET "$BASE_URL/models" | jq .
echo ""

# Test 5: Create conversation
echo "5. Testing create conversation..."
CONV_RESPONSE=$(curl -s -X POST "$BASE_URL/conversations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Test Conversation",
    "metadata": {
      "tags": ["test", "api"],
      "priority": "high"
    }
  }')

echo "$CONV_RESPONSE" | jq .

# Extract conversation ID
CONV_ID=$(echo "$CONV_RESPONSE" | jq -r '.id')
if [ "$CONV_ID" = "null" ] || [ -z "$CONV_ID" ]; then
  echo "Failed to create conversation!"
  exit 1
fi

echo "Conversation ID: $CONV_ID"
echo ""

# Test 6: Get conversation
echo "6. Testing get conversation..."
curl -s -X GET "$BASE_URL/conversations/$CONV_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

# Test 7: Send message (sync)
echo "7. Testing send message (sync)..."
curl -s -X POST "$BASE_URL/conversations/$CONV_ID/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "role": "user",
    "content": "你好，请介绍一下你自己",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 1000,
    "stream": false
  }' | jq .
echo ""

# Test 8: Send message (streaming)
echo "8. Testing send message (streaming)..."
echo "Streaming response:"
curl -s -X POST "$BASE_URL/conversations/$CONV_ID/messages" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "role": "user",
    "content": "请写一个Python函数来计算斐波那契数列",
    "model": "gpt-4",
    "stream": true
  }'
echo ""
echo ""

echo "All tests completed!"
echo "================================"
