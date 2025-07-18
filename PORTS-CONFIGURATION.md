# Configuration des Ports - Guide Complet

## 🔧 Configuration actuelle

### **Backend (Node.js/Express)**
- **Port** : `5170`
- **URL** : `http://52.169.106.107:5170`
- **Health check** : `http://52.169.106.107:5170/health`
- **API** : `http://52.169.106.107:5170/api/products`

### **Frontend (React/Vite)**
- **Port** : `5193`
- **URL** : `http://52.169.106.107:5193`
- **Proxy** : Redirige `/api` vers `http://52.169.106.107:5170`

## 🔥 Règles de Firewall Terraform

```hcl
# SSH - Accès à la VM
security_rule {
  name     = "SSH"
  priority = 100
  port     = 22
}

# HTTP - Accès web standard
security_rule {
  name     = "HTTP"
  priority = 110
  port     = 80
}

# HTTPS - Accès web sécurisé
security_rule {
  name     = "HTTPS"
  priority = 200
  port     = 443
}

# Ports personnalisés - Plage flexible
security_rule {
  name     = "AllowAnyCustom5100-5300Inbound"
  priority = 400
  ports    = "5100-5300"
}

# Backend Node.js - Port spécifique
security_rule {
  name     = "Backend-Node"
  priority = 500
  port     = 5170
}

# Frontend React - Port spécifique
security_rule {
  name     = "Front-React"
  priority = 600
  port     = 5193
}
```

## 🚀 Déploiement

### **1. Appliquer les règles Terraform**
```bash
cd TerraformUse
terraform plan
terraform apply
```

### **2. Connecter à la VM Azure**
```bash
ssh azureuser@52.169.106.107
```

### **3. Configurer le backend sur la VM**
```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Transférer ou cloner le projet
# Configurer le .env avec setup-azure.js

# Démarrer le backend
cd backend
npm install
npm start
```

### **4. Configurer le frontend**
```bash
# Sur votre machine locale ou sur la VM
cd frontend
npm install
npm run dev
```

## 🔍 Tests

### **Backend**
```bash
# Health check
curl http://52.169.106.107:5170/health

# API Products
curl http://52.169.106.107:5170/api/products
```

### **Frontend**
```bash
# Accès direct
http://52.169.106.107:5193

# Test proxy API
http://52.169.106.107:5193/api/products
```

## 📋 Variables d'environnement

### **Backend (.env)**
```bash
PORT=5170
NODE_ENV=development
DB_HOST=mysql-app-sc.mysql.database.azure.com
DB_PORT=3306
DB_NAME=appdb
DB_USER=mysqladmin
DB_PASSWORD=P@ssw0rd123!
FRONTEND_URL=http://52.169.106.107:5193
DB_SSL=true
```

### **Frontend (vite.config.js)**
```javascript
export default defineConfig({
  server: {
    port: 5193,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://52.169.106.107:5170',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

## 🛡️ Sécurité

- **MySQL Azure** : Accessible uniquement depuis la VM Azure
- **Firewall** : Ports spécifiques ouverts uniquement
- **SSL** : Connexion sécurisée à MySQL
- **CORS** : Configuré pour le frontend spécifique

## 🔄 Workflow

1. **Développement local** : Utiliser base de données locale
2. **Tests Azure** : Utiliser VM Azure + MySQL Azure
3. **Production** : Déployer sur Azure App Service

## 🚨 Dépannage

### **Erreur de connexion MySQL**
- Vérifier que vous êtes connecté à la VM Azure
- La VM est la seule autorisée à se connecter à MySQL

### **Erreur de port**
- Vérifier que les règles Terraform sont appliquées
- Vérifier que les ports correspondent dans tous les fichiers

### **Erreur CORS**
- Vérifier que FRONTEND_URL correspond à l'URL du frontend
- Vérifier la configuration CORS dans server.js 