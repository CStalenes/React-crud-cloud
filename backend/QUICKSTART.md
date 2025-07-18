# 🚀 Démarrage Rapide - Backend React-CRUD

Guide pour démarrer le backend avec MySQL Azure en 2 minutes.

## ⚡ Démarrage Ultra-Rapide

### 1. Démarrage automatisé (recommandé)

```bash
# Naviguez vers le dossier backend
cd React-CRUD/backend

# Script de démarrage automatique
node start-backend.js
```

**Ce script va automatiquement :**
- ✅ Créer le fichier `.env` avec la configuration MySQL Azure
- ✅ Installer les dépendances si nécessaire
- ✅ Démarrer le serveur sur le port 5000
- ✅ Tester la connexion

### 2. Démarrage manuel

```bash
# Naviguez vers le dossier backend
cd React-CRUD/backend

# Créer la configuration pour MySQL Azure
node setup-azure.js

# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

## 🧪 Tests Rapides

### Tester le backend
```bash
# Lancer les tests automatisés
node test-backend.js

# Ou tester manuellement
curl http://localhost:5000/api/products
```

### Vérifier les endpoints
```bash
# Récupérer tous les produits
curl http://localhost:5000/api/products

# Créer un produit
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "quantity": 10,
    "price": 99.99
  }'
```

## 🔗 URLs Importantes

- **API Products** : http://localhost:5000/api/products
- **Static Files** : http://localhost:5000/uploads/
- **Frontend URL** : http://localhost:5173 (configuré dans CORS)

## 📋 Configuration

### Variables d'environnement automatiques
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration MySQL Azure
DB_HOST=mysql-app-sc.mysql.database.azure.com
DB_NAME=appdb
DB_USER=mysqladmin
DB_PASSWORD=P@ssw0rd123!

# Configuration CORS
FRONTEND_URL=http://localhost:5173
```

## 🛠️ Commandes Utiles

```bash
# Mode développement avec rechargement automatique
npm run dev

# Créer des données de test
npm run db:seed

# Créer l'image par défaut
npm run create-default-image

# Démarrer en mode production
npm start
```

## 🗄️ Structure de la Base de Données

### Table Products (créée automatiquement)
```javascript
{
  id: INTEGER (AUTO_INCREMENT),
  name: STRING(255), // Requis
  quantity: INTEGER, // Défaut: 0
  price: DECIMAL(10,2), // Requis
  image: STRING(500), // Optionnel
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

## 📊 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Récupérer tous les produits |
| GET | `/api/products/:id` | Récupérer un produit |
| POST | `/api/products` | Créer un produit |
| PUT | `/api/products/:id` | Modifier un produit |
| DELETE | `/api/products/:id` | Supprimer un produit |

## 🔒 Sécurité

### Fonctionnalités intégrées
- **Helmet** : Protection contre les attaques web
- **CORS** : Configuré pour localhost:5173
- **Rate Limiting** : 100 requêtes/15 minutes
- **Validation** : Joi pour valider les données
- **SSL** : Connexion sécurisée à MySQL Azure

## 🚨 Résolution des Problèmes

### Erreur de connexion MySQL
```bash
# Vérifier la connectivité
telnet mysql-app-sc.mysql.database.azure.com 3306

# Vérifier les logs
npm start # Les logs apparaîtront dans la console
```

### Port déjà utilisé
```bash
# Changer le port dans .env
PORT=5001

# Ou tuer le processus
lsof -ti:5000 | xargs kill -9
```

### Problème de CORS
```bash
# Modifier FRONTEND_URL dans .env
FRONTEND_URL=http://localhost:3000
```

## 🎯 Exemple de Données

### Créer un produit
```json
{
  "name": "Ordinateur Portable",
  "quantity": 5,
  "price": 999.99,
  "image": "laptop.jpg"
}
```

### Réponse typique
```json
{
  "id": 1,
  "name": "Ordinateur Portable",
  "quantity": 5,
  "price": 999.99,
  "image": "laptop.jpg",
  "createdAt": "2024-12-15T14:30:00.000Z",
  "updatedAt": "2024-12-15T14:30:00.000Z"
}
```

## 📈 Monitoring

### Vérifier l'état du serveur
```bash
# Processus Node.js
ps aux | grep node

# Connexions réseau
netstat -an | grep :5000

# Logs en temps réel
tail -f console.log # Si configuré
```

## 🔄 Redémarrage Rapide

```bash
# Arrêter le serveur
pkill -f "node server.js"

# Ou Ctrl+C si en premier plan

# Redémarrer
npm start
```

## 🎉 Prêt à Utiliser !

Une fois le serveur démarré :
- ✅ API disponible sur http://localhost:5000
- ✅ Connexion sécurisée à MySQL Azure
- ✅ CORS configuré pour le frontend
- ✅ Validation des données activée
- ✅ Upload d'images fonctionnel

**Temps de démarrage : 1-2 minutes** ⏱️

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans la console
2. Testez `curl http://localhost:5000/api/products`
3. Vérifiez le fichier `.env`
4. Consultez les règles de pare-feu Azure MySQL 