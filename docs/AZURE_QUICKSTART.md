# 🚀 Deploy Rápido Azure - OrionJobs API

## Problema Identificado ✅

A API não funcionava no Azure porque:
- O Azure App Service define a porta dinamicamente via variável `PORT`
- O Dockerfile estava fixado na porta 8000
- **Solução**: Criado script `startup.sh` que lê a variável `PORT` do Azure

## Deploy Rápido

### 1. Rebuild e Push da Imagem

```bash
cd backend
docker build -t orionjobsacr.azurecr.io/orionjobs:latest .
az acr login --name orionjobsacr
docker push orionjobsacr.azurecr.io/orionjobs:latest
```

### 2. Configurar WEBSITES_PORT no Azure

```bash
az webapp config appsettings set \
  --resource-group orionjobs-rg \
  --name orionjobs-api \
  --settings WEBSITES_PORT="8000"
```

### 3. Reiniciar o App

```bash
az webapp restart --name orionjobs-api --resource-group orionjobs-rg
```

### 4. Verificar Logs

```bash
# Logs em tempo real
az webapp log tail --name orionjobs-api --resource-group orionjobs-rg

# Ou via portal Azure:
# https://portal.azure.com -> App Service -> Log Stream
```

## Testes

```bash
# Health check
curl https://orionjobs-api.azurewebsites.net/health

# Root endpoint
curl https://orionjobs-api.azurewebsites.net/

# API docs
# https://orionjobs-api.azurewebsites.net/docs
```

## Variáveis de Ambiente Necessárias

- `DATABASE_URL` - String de conexão PostgreSQL
- `ENVIRONMENT` - "production"
- `WEBSITES_PORT` - "8000" (OBRIGATÓRIO para Azure)
- `ALLOWED_ORIGINS` - URLs do frontend separadas por vírgula
- `ADZUNA_APP_ID` e `ADZUNA_APP_KEY` - Credenciais API

## Comandos Úteis

```bash
# Ver configurações do app
az webapp config appsettings list \
  --name orionjobs-api \
  --resource-group orionjobs-rg

# Ver status do app
az webapp show \
  --name orionjobs-api \
  --resource-group orionjobs-rg \
  --query state

# SSH no container (se necessário)
az webapp ssh --name orionjobs-api --resource-group orionjobs-rg
```

## Checklist Pós-Deploy ✓

- [ ] Build e push da nova imagem
- [ ] WEBSITES_PORT configurado
- [ ] App reiniciado
- [ ] Logs verificados (sem erros)
- [ ] Health check retorna status "healthy"
- [ ] CORS configurado com domínio do frontend
- [ ] Variáveis de ambiente configuradas
