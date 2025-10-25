#!/bin/bash

# Open WebUI Lite Backend - Docker启动脚本

echo "🚀 启动 Open WebUI Lite Backend..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 检查docker-compose是否可用
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose未安装，请先安装docker-compose"
    exit 1
fi

echo "📦 构建Docker镜像..."
docker-compose build

echo "🗄️  启动PostgreSQL数据库..."
docker-compose up -d postgres

echo "⏳ 等待数据库启动..."
sleep 10

echo "🔄 运行数据库迁移..."
docker-compose run --rm migrate

echo "🌱 添加种子数据..."
docker-compose run --rm seed

echo "🚀 启动API服务..."
docker-compose up -d api

echo "✅ 服务启动完成！"
echo ""
echo "📋 服务信息："
echo "  🌐 API服务: http://localhost:8080"
echo "  🗄️  数据库: localhost:5432"
echo "  📊 健康检查: http://localhost:8080/health"
echo ""
echo "🔧 管理命令："
echo "  查看日志: docker-compose logs -f api"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo ""
echo "🧪 测试API："
echo "  curl http://localhost:8080/health"
echo "  curl http://localhost:8080/v1/models"
