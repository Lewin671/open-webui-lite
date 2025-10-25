#!/bin/bash

# Open WebUI Lite Backend - Docker停止脚本

echo "🛑 停止 Open WebUI Lite Backend..."

# 停止所有服务
docker-compose down

echo "✅ 服务已停止"
echo ""
echo "💡 提示："
echo "  - 数据已保存到Docker卷中"
echo "  - 重新启动请运行: ./start.sh"
echo "  - 完全清理请运行: docker-compose down -v"
