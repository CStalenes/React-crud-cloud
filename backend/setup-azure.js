#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Déterminer l'environnement
const isProduction = process.argv.includes('--prod');
const forceOverwrite = process.argv.includes('--force');
const showFirewallHelp = process.argv.includes('--help-firewall');

// Afficher l'aide pour les règles de firewall
if (showFirewallHelp) {
  console.log('🔥 Guide de configuration du firewall MySQL Azure');
  console.log('');
  console.log('📍 1. Obtenez votre IP publique :');
  console.log('   PowerShell: (Invoke-WebRequest -Uri "https://ipv4.icanhazip.com").Content.Trim()');
  console.log('   Ou visitez: https://whatismyipaddress.com/');
  console.log('');
  console.log('📍 2. Ajoutez une règle de firewall temporaire :');
  console.log('   az mysql flexible-server firewall-rule create \\');
  console.log('     --resource-group rg-terraform-app-sc \\');
  console.log('     --server-name mysql-app-sc \\');
  console.log('     --rule-name "AllowMyIP" \\');
  console.log('     --start-ip-address VOTRE_IP \\');
  console.log('     --end-ip-address VOTRE_IP');
  console.log('');
  console.log('📍 3. Après les tests, supprimez la règle :');
  console.log('   az mysql flexible-server firewall-rule delete \\');
  console.log('     --resource-group rg-terraform-app-sc \\');
  console.log('     --server-name mysql-app-sc \\');
  console.log('     --rule-name "AllowMyIP"');
  console.log('');
  console.log('🔐 Alternative sécurisée : Utilisez la VM Azure');
  console.log('   ssh azureuser@52.169.106.107');
  console.log('   sudo apt update && sudo apt install mysql-client-core-8.0 -y');
  console.log('   mysql -h mysql-app-sc.mysql.database.azure.com -u mysqladmin -p --ssl-mode=REQUIRED appdb');
  process.exit(0);
}

// Configuration pour MySQL Azure
const envContent = `# Configuration du serveur pour Azure
PORT=${isProduction ? '5193' : '5183'}
NODE_ENV=${isProduction ? 'production' : 'development'}

# Configuration de la base de données MySQL Azure
DB_HOST=mysql-app-sc.mysql.database.azure.com
DB_PORT=3306
DB_NAME=appdb
DB_USER=mysqladmin
DB_PASSWORD=P@ssw0rd123!

# Configuration CORS - URL de votre frontend
FRONTEND_URL=${isProduction ? 'https://frontend-app-sc.azurewebsites.net' : 'http://52.169.106.107:5193'}

# Configuration Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configuration SSL pour MySQL (requis pour Azure)
DB_SSL=true

# Configuration pour Azure App Service
WEBSITE_NODE_DEFAULT_VERSION=18-lts
`;

// Créer le fichier .env
const envPath = path.join(__dirname, '.env');

try {
  // Vérifier si le fichier .env existe déjà
  if (fs.existsSync(envPath) && !forceOverwrite) {
    console.log('⚠️  Le fichier .env existe déjà !');
    console.log('');
    console.log('🔧 Options disponibles :');
    console.log('   - Utilisez --force pour écraser le fichier existant');
    console.log('   - Exemple: node setup-azure.js --force');
    console.log('   - Ou supprimez manuellement le fichier .env existant');
    console.log('');
    console.log('📋 Contenu actuel du .env :');
    console.log('---');
    console.log(fs.readFileSync(envPath, 'utf8'));
    console.log('---');
    process.exit(0);
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env créé avec la configuration MySQL Azure');
  console.log('📋 Configuration:');
  console.log('   - Host: mysql-app-sc.mysql.database.azure.com');
  console.log('   - Database: appdb');
  console.log('   - User: mysqladmin');
  console.log(`   - Frontend URL: ${isProduction ? 'https://frontend-app-sc.azurewebsites.net' : 'http://localhost:5193'}`);
  console.log(`   - NODE_ENV: ${isProduction ? 'production' : 'development'}`);
  console.log('   - SSL: activé');
  console.log('');
  console.log('🔧 Ports configurés:');
  console.log('   - Backend: http://52.169.106.107:5170');
  console.log('   - Frontend: http://52.169.106.107:5193');
  console.log('');
  console.log('⚠️  ATTENTION : Erreur de connexion possible !');
  console.log('   Si vous obtenez une erreur ETIMEDOUT, votre IP n\'est pas autorisée.');
  console.log('');
  console.log('🔥 Pour configurer le firewall MySQL Azure :');
  console.log('   node setup-azure.js --help-firewall');
  console.log('');
  console.log('🚀 Prochaines étapes:');
  console.log('   1. Configurez le firewall (voir --help-firewall)');
  console.log('   2. npm install');
  console.log('   3. npm start');
  console.log('   4. Testez http://52.169.106.107:5193');
  console.log('');
  console.log('🌐 Pour Azure:');
  console.log('   - Azure App Service gère automatiquement les ports');
  console.log('   - Utilisez --prod pour la config de production');
  console.log('   - Exemple: node setup-azure.js --prod');
  
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env:', error.message);
  process.exit(1);
} 