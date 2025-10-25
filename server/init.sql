-- 初始化数据库脚本
-- 创建数据库（如果不存在）
SELECT 'CREATE DATABASE open_webui_lite'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'open_webui_lite')\gexec

-- 连接到数据库
\c open_webui_lite;

-- 创建扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 设置时区
SET timezone = 'UTC';
