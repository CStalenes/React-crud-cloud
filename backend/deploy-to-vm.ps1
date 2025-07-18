# Script de déploiement sur VM Azure (PowerShell)
# Utilisation: .\deploy-to-vm.ps1

Write-Host "🚀 Déploiement sur VM Azure (52.169.106.107)" -ForegroundColor Green

# Variables
$VM_IP = "52.169.106.107"
$VM_USER = "azureuser"

# Vérifier la connectivité SSH
Write-Host "🔍 Vérification de la connectivité SSH..." -ForegroundColor Cyan
$sshTest = ssh -o BatchMode=yes -o ConnectTimeout=5 $VM_USER@$VM_IP exit 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Impossible de se connecter à la VM Azure" -ForegroundColor Red
    Write-Host "Vérifiez que vous avez accès SSH à $VM_USER@$VM_IP" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Connexion SSH établie" -ForegroundColor Green

# Copier les fichiers du projet
Write-Host "📂 Copie des fichiers du projet..." -ForegroundColor Cyan
scp -r React-CRUD\backend\* ${VM_USER}@${VM_IP}:~/backend/

# Installer Node.js et configurer l'environnement
Write-Host "📦 Installation de Node.js sur la VM..." -ForegroundColor Cyan
ssh $VM_USER@$VM_IP @"
# Vérifier si Node.js est déjà installé
if command -v node &> /dev/null; then
    echo '✅ Node.js déjà installé: `$(node --version)`'
else
    echo '📦 Installation de Node.js...'
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo '✅ Node.js installé: `$(node --version)`'
fi

# Installer MySQL client
if ! command -v mysql &> /dev/null; then
    echo '📦 Installation du client MySQL...'
    sudo apt-get install -y mysql-client-core-8.0
fi

# Créer le répertoire backend
mkdir -p ~/backend
cd ~/backend

# Créer le fichier .env
cat > .env << 'ENVEOF'
PORT=5170
NODE_ENV=development
DB_HOST=mysql-app-sc.mysql.database.azure.com
DB_PORT=3306
DB_NAME=appdb
DB_USER=mysqladmin
DB_PASSWORD=P@ssw0rd123!
FRONTEND_URL=http://52.169.106.107:5193
DB_SSL=true
WEBSITE_NODE_DEFAULT_VERSION=18-lts
ENVEOF

echo '✅ Fichier .env créé'

# Installer les dépendances
echo '📦 Installation des dépendances...'
npm install

# Créer un script de démarrage
cat > start-backend.sh << 'STARTEOF'
#!/bin/bash
cd ~/backend
echo '🚀 Démarrage du backend sur port 5170...'
npm start
STARTEOF

chmod +x start-backend.sh

echo '✅ Configuration terminée'
echo ''
echo 'Pour démarrer le serveur:'
echo '  cd ~/backend'
echo '  npm start'
echo ''
echo 'Ou utilisez le script:'
echo '  ./start-backend.sh'
"@

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Connectez-vous à la VM :" -ForegroundColor White
Write-Host "   ssh azureuser@52.169.106.107" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Démarrez le backend :" -ForegroundColor White
Write-Host "   cd ~/backend" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Testez l'API :" -ForegroundColor White
Write-Host "   curl http://52.169.106.107:5170/health" -ForegroundColor Yellow
Write-Host "   curl http://52.169.106.107:5170/api/products" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Accédez depuis votre navigateur :" -ForegroundColor White
Write-Host "   http://52.169.106.107:5170/health" -ForegroundColor Yellow 