# Script de déploiement vers Azure App Service (PowerShell)
# Utilisation: .\deploy-to-azure.ps1

Write-Host "🚀 Déploiement vers Azure App Service" -ForegroundColor Green

# Variables
$RESOURCE_GROUP = "rg-terraform-app-sc"
$BACKEND_APP_NAME = "backend-app-sc"
$FRONTEND_APP_NAME = "frontend-app-sc"

# Vérifier Azure CLI
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI n'est pas installé" -ForegroundColor Red
    Write-Host "Installez Azure CLI depuis: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Vérifier la connexion Azure
Write-Host "🔍 Vérification de la connexion Azure..." -ForegroundColor Cyan
$azAccount = az account show 2>$null
if (-not $azAccount) {
    Write-Host "❌ Vous n'êtes pas connecté à Azure" -ForegroundColor Red
    Write-Host "Exécutez: az login" -ForegroundColor Yellow
    exit 1
}

# Déployer le backend
Write-Host "📦 Déploiement du backend..." -ForegroundColor Green
Set-Location -Path "backend"

# Créer un package zip
Write-Host "📦 Création du package backend..." -ForegroundColor Cyan
if (Test-Path "backend.zip") { Remove-Item "backend.zip" }
$compress = @{
    Path = "config", "controllers", "middleware", "models", "routes", "scripts", "uploads", "server.js", "package.json", "*.md"
    CompressionLevel = "Optimal"
    DestinationPath = "backend.zip"
}
Compress-Archive @compress

# Déployer vers App Service
Write-Host "🚀 Déploiement vers App Service..." -ForegroundColor Green
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --src backend.zip

# Configurer les variables d'environnement
Write-Host "⚙️  Configuration des variables d'environnement..." -ForegroundColor Cyan
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --settings NODE_ENV=production DB_HOST=mysql-app-sc.mysql.database.azure.com DB_PORT=3306 DB_NAME=appdb DB_USER=mysqladmin "DB_PASSWORD=P@ssw0rd123!" FRONTEND_URL=https://frontend-app-sc.azurewebsites.net DB_SSL=true WEBSITE_NODE_DEFAULT_VERSION=18-lts

# Déployer le frontend
Write-Host "📦 Déploiement du frontend..." -ForegroundColor Green
Set-Location -Path "../frontend"

# Build du frontend
Write-Host "🔨 Build du frontend..." -ForegroundColor Cyan
npm install
npm run build

# Créer un package zip
Write-Host "📦 Création du package frontend..." -ForegroundColor Cyan
if (Test-Path "frontend.zip") { Remove-Item "frontend.zip" }
Compress-Archive -Path "dist/*" -DestinationPath "frontend.zip"

# Déployer vers App Service
Write-Host "🚀 Déploiement vers App Service..." -ForegroundColor Green
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME --src frontend.zip

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs disponibles :" -ForegroundColor Cyan
Write-Host "   Backend:  https://backend-app-sc.azurewebsites.net" -ForegroundColor White
Write-Host "   Frontend: https://frontend-app-sc.azurewebsites.net" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Tests :" -ForegroundColor Cyan
Write-Host "   curl https://backend-app-sc.azurewebsites.net/health" -ForegroundColor White
Write-Host "   curl https://backend-app-sc.azurewebsites.net/api/products" -ForegroundColor White

# Nettoyage
Remove-Item "backend.zip" -ErrorAction SilentlyContinue
Remove-Item "frontend.zip" -ErrorAction SilentlyContinue

# Retour au répertoire parent
Set-Location -Path "../" 