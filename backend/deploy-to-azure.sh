#!/bin/bash

# Script de déploiement vers Azure App Service
# Utilisation: ./deploy-to-azure.sh

echo "🚀 Déploiement vers Azure App Service"

# Variables
RESOURCE_GROUP="rg-terraform-app-sc"
BACKEND_APP_NAME="backend-app-sc"
FRONTEND_APP_NAME="frontend-app-sc"

# Vérifier Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI n'est pas installé"
    exit 1
fi

# Vérifier la connexion Azure
echo "🔍 Vérification de la connexion Azure..."
az account show > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Vous n'êtes pas connecté à Azure"
    echo "Exécutez: az login"
    exit 1
fi

# Déployer le backend
echo "📦 Déploiement du backend..."
cd backend

# Créer un package zip
echo "📦 Création du package backend..."
zip -r backend.zip . -x "node_modules/*" ".git/*" "*.log"

# Déployer vers App Service
echo "🚀 Déploiement vers App Service..."
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --src backend.zip

# Configurer les variables d'environnement
echo "⚙️  Configuration des variables d'environnement..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --settings \
    NODE_ENV=production \
    DB_HOST=mysql-app-sc.mysql.database.azure.com \
    DB_PORT=3306 \
    DB_NAME=appdb \
    DB_USER=mysqladmin \
    DB_PASSWORD=P@ssw0rd123! \
    FRONTEND_URL=https://frontend-app-sc.azurewebsites.net \
    DB_SSL=true \
    WEBSITE_NODE_DEFAULT_VERSION=18-lts

# Déployer le frontend
echo "📦 Déploiement du frontend..."
cd ../frontend

# Build du frontend
echo "🔨 Build du frontend..."
npm install
npm run build

# Créer un package zip
echo "📦 Création du package frontend..."
zip -r frontend.zip dist/

# Déployer vers App Service
echo "🚀 Déploiement vers App Service..."
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $FRONTEND_APP_NAME \
    --src frontend.zip

echo "✅ Déploiement terminé !"
echo ""
echo "🔗 URLs disponibles :"
echo "   Backend:  https://backend-app-sc.azurewebsites.net"
echo "   Frontend: https://frontend-app-sc.azurewebsites.net"
echo ""
echo "🧪 Tests :"
echo "   curl https://backend-app-sc.azurewebsites.net/health"
echo "   curl https://backend-app-sc.azurewebsites.net/api/products"

# Nettoyage
rm -f backend.zip frontend.zip 