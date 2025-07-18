#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration pour MySQL Azure
const envContent = `# Configuration du serveur
PORT=5150
NODE_ENV=development

# Configuration de la base de données MySQL Azure
DB_HOST=mysql-app-sc.mysql.database.azure.com
DB_PORT=3306
DB_NAME=appdb
DB_USER=mysqladmin
DB_PASSWORD=P@ssw0rd123!

# Configuration CORS
FRONTEND_URL=http://52.169.106.107:5193

# Configuration Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

// Fonction pour exécuter une commande
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Fonction pour attendre
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour tester la connexion au serveur
async function testServer() {
  try {
    const response = await fetch('http://52.169.106.107:5170/api/products');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage du backend React-CRUD...\n');

  try {
    // 1. Créer le fichier .env
    console.log('📝 Création du fichier .env...');
    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Fichier .env créé\n');

    // 2. Vérifier si node_modules existe
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📦 Installation des dépendances...');
      await runCommand('npm', ['install']);
      console.log('✅ Dépendances installées\n');
    } else {
      console.log('✅ Dépendances déjà installées\n');
    }

    // 3. Démarrer le serveur en arrière-plan
    console.log('🏃 Démarrage du serveur...');
    const serverProcess = spawn('npm', ['start'], {
      stdio: 'inherit',
      shell: true,
      detached: false
    });

    // Attendre que le serveur soit prêt
    console.log('⏳ Attente du serveur...');
    await sleep(3000);

    // 4. Tester la connexion
    console.log('🔍 Test de la connexion...');
    let connected = false;
    for (let i = 0; i < 10; i++) {
      connected = await testServer();
      if (connected) break;
      await sleep(1000);
    }

    if (connected) {
      console.log('✅ Serveur démarré avec succès!\n');
      console.log('🌐 URLs disponibles:');
      console.log('   - API: http://52.169.106.107:5170/api/products');
      console.log('   - Uploads: http://52.169.106.107:5170/uploads/');
      console.log('');
      console.log('📋 Configuration:');
      console.log('   - Host: mysql-app-sc.mysql.database.azure.com');
      console.log('   - Database: appdb');
      console.log('   - User: mysqladmin');
      console.log('   - Port: 5150');
      console.log('');
      console.log('🔧 Commandes utiles:');
      console.log('   - npm run dev    # Mode développement');
      console.log('   - npm run db:seed # Insérer des données de test');
      console.log('   - Ctrl+C pour arrêter le serveur');
    } else {
      console.log('❌ Impossible de se connecter au serveur');
      console.log('💡 Vérifiez que MySQL Azure est accessible');
      serverProcess.kill();
    }

    // Gérer l'arrêt propre
    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt du serveur...');
      serverProcess.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
main(); 