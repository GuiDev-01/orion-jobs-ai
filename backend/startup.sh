#!/bin/bash

# Script de inicialização para Azure App Service
echo "🚀 Starting OrionJobs API on Azure..."

# Verificar a porta configurada pelo Azure
PORT=${PORT:-8000}
echo "📡 Using port: $PORT"

# Executar migrações do banco de dados
echo "🔄 Running database migrations..."
alembic upgrade head

# Iniciar o servidor
echo "✅ Starting Uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
