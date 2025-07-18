#!/bin/bash

# Script de déploiement sur VM Azure
# Utilisation: ./deploy-to-vm.sh

echo "🚀 Déploiement sur VM Azure (52.169.106.107)"

# Variables
VM_IP="52.169.106.107"
VM_USER="azureuser"

# Vérifier la connectivité SSH
echo "🔍 Vérification de la connectivité SSH..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 $VM_USER@$VM_IP exit 2>/dev/null; then
    echo "❌ Impossible de se connecter à la VM Azure"
    echo "Vérifiez que vous avez accès SSH à $VM_USER@$VM_IP"
    exit 1
fi

echo "✅ Connexion SSH établie"

# Installer Node.js sur la VM
echo "📦 Installation de Node.js sur la VM..."
ssh $VM_USER@$VM_IP << 'EOF'
# Vérifier si Node.js est déjà installé
if command -v node &> /dev/null; then
    echo "✅ Node.js déjà installé: $(node --version)"
else
    echo "📦 Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installé: $(node --version)"
fi

# Installer MySQL client
if ! command -v mysql &> /dev/null; then
    echo "📦 Installation du client MySQL..."
    sudo apt-get install -y mysql-client-core-8.0
fi
EOF

# Créer le répertoire backend et le fichier .env
echo "⚙️  Configuration de l'environnement backend..."
ssh $VM_USER@$VM_IP << 'EOF'
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

echo "✅ Fichier .env créé"

# Créer un package.json minimal
cat > package.json << 'PKGEOF'
{
  "name": "backend-azure",
  "version": "1.0.0",
  "description": "Backend pour VM Azure",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^6.0.1",
    "express-rate-limit": "^6.7.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.3",
    "sequelize": "^6.29.0",
    "mysql2": "^3.2.0",
    "multer": "^1.4.5-lts.1"
  }
}
PKGEOF

echo "✅ Package.json créé"
EOF

# Copier les fichiers du projet
echo "📂 Copie des fichiers du projet..."
scp -r React-CRUD/backend/* $VM_USER@$VM_IP:~/backend/

# Installer les dépendances et démarrer le serveur
echo "📦 Installation des dépendances..."
ssh $VM_USER@$VM_IP << 'EOF'
cd ~/backend
npm install

echo "🚀 Démarrage du serveur backend..."
echo "Pour démarrer le serveur, exécutez:"
echo "  ssh azureuser@52.169.106.107"
echo "  cd ~/backend"
echo "  npm start"
echo ""
echo "🧪 Tests disponibles:"
echo "  curl http://52.169.106.107:5170/health"
echo "  curl http://52.169.106.107:5170/api/products"
EOF

# Créer un script de démarrage permanent
echo "⚙️  Création du script de démarrage..."
ssh $VM_USER@$VM_IP << 'EOF'
cd ~/backend

# Créer un script de démarrage
cat > start-backend.sh << 'STARTEOF'
#!/bin/bash
cd ~/backend
echo "🚀 Démarrage du backend sur port 5170..."
npm start
STARTEOF

chmod +x start-backend.sh

echo "✅ Script de démarrage créé: ~/backend/start-backend.sh"
EOF

echo "✅ Déploiement terminé !"
echo ""
echo "🔗 Prochaines étapes:"
echo "1. Connectez-vous à la VM:"
echo "   ssh azureuser@52.169.106.107"
echo ""
echo "2. Démarrez le backend:"
echo "   cd ~/backend"
echo "   npm start"
echo ""
echo "3. Testez l'API:"
echo "   curl http://52.169.106.107:5170/health"
echo "   curl http://52.169.106.107:5170/api/products"
echo ""
echo "4. Accédez depuis votre navigateur:"
echo "   http://52.169.106.107:5170/health" 