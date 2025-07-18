# Configuration des Ports pour Azure

## 🔧 Ports en Développement Local

- **Backend**: `http://localhost:5150`
- **Frontend**: `http://localhost:5183`

## 🌐 Ports sur Azure

### Backend (Azure App Service)
- Azure assigne automatiquement un port via la variable `process.env.PORT`
- **Ne pas** hardcoder le port dans le code
- Utiliser: `const PORT = process.env.PORT || 5150`

### Frontend (Azure Static Web Apps)
- Pas de port spécifique (utilise HTTPS sur le domaine Azure)
- URL: `https://frontend-app-sc.azurewebsites.net`

## 📋 Configuration Automatique

### Développement
```bash
node setup-azure.js
```
- FRONTEND_URL: `http://localhost:5183`
- NODE_ENV: `development`

### Production
```bash
node setup-azure.js --prod
```
- FRONTEND_URL: `https://frontend-app-sc.azurewebsites.net`
- NODE_ENV: `production`

### Écraser le fichier .env existant
```bash
node setup-azure.js --force
```
- Force l'écrasement du fichier .env existant

### Combiner les options
```bash
node setup-azure.js --prod --force
```
- Configuration de production ET écrasement forcé

## 🔍 Vérification des Ports

1. **Vite (Frontend)**: Configuré sur port 5183
2. **Express (Backend)**: Configuré sur port 5150
3. **Proxy**: Frontend → Backend (5183 → 5150)

## ⚠️ Important pour Azure

- Azure App Service utilise la variable d'environnement `PORT`
- Ne jamais hardcoder les ports dans le code de production
- Utiliser les variables d'environnement pour toutes les URL

## 🛡️ Protection du fichier .env

- Le script vérifie si `.env` existe déjà
- Utilise `--force` pour écraser sans confirmation
- Affiche le contenu actuel avant d'écraser 