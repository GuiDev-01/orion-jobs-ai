# OrionJobs AI - Guia de Deploy Azure

## Pré-requisitos
- Conta Azure com $100 em créditos
- Azure CLI instalado
- Docker Desktop

## Custos Estimados (mensal)
- Azure Container Registry (Basic): ~$5
- Azure Database for PostgreSQL (Basic): ~$15-20  
- Azure App Service (B1): ~$15
- **Total: ~$35-40/mês**

## Passo 1: Criar recursos na Azure

```bash
# Login na Azure
az login

# Criar grupo de recursos
az group create --name orionjobs-rg --location eastus

# Criar Azure Container Registry
az acr create \
  --resource-group orionjobs-rg \
  --name orionjobsacr \
  --sku Basic \
  --admin-enabled true

# Obter credenciais do ACR
az acr credential show --name orionjobsacr --resource-group orionjobs-rg
```

## Passo 2: Banco PostgreSQL

```bash
# Criar servidor PostgreSQL
az postgres server create \
  --resource-group orionjobs-rg \
  --name orionjobs-db-server \
  --location eastus \
  --admin-user orionadmin \
  --admin-password "OrionJobs2024!" \
  --sku-name B_Gen5_1 \
  --version 13

# Configurar firewall para Azure services
az postgres server firewall-rule create \
  --resource-group orionjobs-rg \
  --server orionjobs-db-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Criar database
az postgres db create \
  --resource-group orionjobs-rg \
  --server-name orionjobs-db-server \
  --name orionjobs
```

## Passo 3: App Service

```bash
# Criar App Service Plan
az appservice plan create \
  --name orionjobs-plan \
  --resource-group orionjobs-rg \
  --sku B1 \
  --is-linux

# Criar Web App
az webapp create \
  --resource-group orionjobs-rg \
  --plan orionjobs-plan \
  --name orionjobs-api \
  --deployment-container-image-name orionjobsacr.azurecr.io/orionjobs:latest
```

## Passo 4: Configurar secrets no GitHub

No seu repositório GitHub, adicione estes secrets:
- `ACR_NAME`: orionjobsacr
- `ACR_USERNAME`: (obtido do comando acr credential show)
- `ACR_PASSWORD`: (obtido do comando acr credential show)
- `WEBAPP_NAME`: orionjobs-api
- `AZURE_CREDENTIALS`: (JSON das credenciais de service principal)

## Passo 5: Deploy inicial

```bash
# Build e push da imagem
docker build -t orionjobsacr.azurecr.io/orionjobs:latest .
az acr login --name orionjobsacr
docker push orionjobsacr.azurecr.io/orionjobs:latest

# Configurar variáveis de ambiente do App Service
az webapp config appsettings set \
  --resource-group orionjobs-rg \
  --name orionjobs-api \
  --settings \
  DATABASE_URL="postgresql://orionadmin:OrionJobs2024!@orionjobs-db-server.postgres.database.azure.com:5432/orionjobs" \
  ENVIRONMENT="production" \
  COLLECT_MAX_PAGES="2" \
  ADZUNA_APP_ID="your_adzuna_id" \
  ADZUNA_APP_KEY="your_adzuna_key"
```

## Monitoramento

Acesse: `https://orionjobs-api.azurewebsites.net/health`