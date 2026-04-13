# Quick Azure Deploy (No Secrets)

This guide was simplified for public usage on GitHub.
Use placeholders and local environment variables to avoid exposing credentials.

## 1) Build and push the image

```bash
cd backend
docker build -t <acr-name>.azurecr.io/<image-name>:latest .
az acr login --name <acr-name>
docker push <acr-name>.azurecr.io/<image-name>:latest
```

## 2) Configure App Service

```bash
az webapp config appsettings set \
  --resource-group <resource-group> \
  --name <webapp-name> \
  --settings \
  WEBSITES_PORT="8000" \
  ENVIRONMENT="production" \
  DATABASE_URL="<database-url>" \
  ALLOWED_ORIGINS="<frontend-domain>"
```

## 3) Restart and validate

```bash
az webapp restart --name <webapp-name> --resource-group <resource-group>
az webapp log tail --name <webapp-name> --resource-group <resource-group>
```

## 4) Smoke tests

```bash
curl https://<webapp-domain>/health
curl https://<webapp-domain>/docs
```

## Required variables

- `DATABASE_URL`
- `ENVIRONMENT`
- `WEBSITES_PORT`
- `ALLOWED_ORIGINS`

## Checklist

- [ ] New image pushed to ACR
- [ ] App Settings updated in Azure
- [ ] App restarted
- [ ] Health check returning OK
- [ ] Logs without critical errors
