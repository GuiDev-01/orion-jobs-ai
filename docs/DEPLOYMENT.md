# Azure Deployment Guide

This document describes a secure Azure deployment workflow without exposing secrets in the repository.

## Prerequisites

- Azure CLI installed and authenticated (`az login`)
- Docker installed
- GitHub Actions configured in the repository

## Recommended local shell variables

```bash
export RESOURCE_GROUP="<resource-group>"
export LOCATION="<location>"
export ACR_NAME="<acr-name>"
export APP_PLAN="<app-plan-name>"
export WEBAPP_NAME="<webapp-name>"
export IMAGE_NAME="<image-name>"
```

## 1) Create base resources

```bash
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true

az appservice plan create \
  --name "$APP_PLAN" \
  --resource-group "$RESOURCE_GROUP" \
  --sku B1 \
  --is-linux

az webapp create \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$APP_PLAN" \
  --name "$WEBAPP_NAME" \
  --deployment-container-image-name "$ACR_NAME.azurecr.io/$IMAGE_NAME:latest"
```

## 2) Build and push the image

```bash
cd backend
docker build -t "$ACR_NAME.azurecr.io/$IMAGE_NAME:latest" .
az acr login --name "$ACR_NAME"
docker push "$ACR_NAME.azurecr.io/$IMAGE_NAME:latest"
```

## 3) Configure App Settings

```bash
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --settings \
  DATABASE_URL="<database-url>" \
  ENVIRONMENT="production" \
  WEBSITES_PORT="8000" \
  ALLOWED_ORIGINS="<frontend-domain>" \
  ADZUNA_APP_ID="<adzuna-app-id>" \
  ADZUNA_APP_KEY="<adzuna-app-key>"
```

## 4) Configure GitHub secrets

In the repository, configure:

- `ACR_NAME`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `WEBAPP_NAME`
- `AZURE_CREDENTIALS`

## 5) Deploy and validation

```bash
az webapp restart --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP"
az webapp log tail --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP"
curl "https://<webapp-domain>/health"
```

## Quick troubleshooting

- API unavailable: check App Service logs and Web App status.
- DB error: review `DATABASE_URL`, firewall, and connectivity.
- CORS error: validate `ALLOWED_ORIGINS` with the real frontend domain.