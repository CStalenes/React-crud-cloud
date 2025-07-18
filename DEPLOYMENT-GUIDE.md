# Guide de Déploiement - Pourquoi les URLs ne fonctionnent pas

## 🚨 Problème actuel

Les URLs ne fonctionnent pas car :

1. **Azure App Services sont vides** - Créés par Terraform mais sans code
2. **VM Azure n'a pas d'applications** - Aucun service n'est démarré
3. **Confusion entre deux approches** - App Service vs VM

## 🔗 URLs disponibles mais non fonctionnelles

### **Azure App Services (créés mais vides)**
```
✅ Créés par Terraform
❌ Aucun code déployé
❌ Aucun service actif

Backend:  https://backend-app-sc.azurewebsites.net
Frontend: https://frontend-app-sc.azurewebsites.net
```

### **VM Azure (créée mais vide)**
```
✅ VM créée et accessible
❌ Node.js non installé
❌ Applications non déployées
❌ Services non démarrés

Backend:  http://52.169.106.107:5170/health
Frontend: http://52.169.106.107:5193
API:      http://52.169.106.107:5170/api/products
```

## 🚀 Solutions

### **Option 1 : Déploiement automatique Azure App Service (Recommandé)**

```powershell
# Depuis le répertoire React-CRUD
cd React-CRUD
.\backend\deploy-to-azure.ps1
```

**Avantages :**
- ✅ Déploiement automatique
- ✅ Scaling automatique
- ✅ Haute disponibilité
- ✅ Pas de gestion de serveur

**Résultat :**
```
Backend:  https://backend-app-sc.azurewebsites.net/health
Frontend: https://frontend-app-sc.azurewebsites.net
API:      https://backend-app-sc.azurewebsites.net/api/products
```

### **Option 2 : Déploiement manuel sur VM Azure**

```bash
# 1. Connectez-vous à la VM
ssh azureuser@52.169.106.107

# 2. Installez les prérequis
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# 3. Créez l'environnement backend
mkdir -p ~/backend
cd ~/backend

# 4. Créez le fichier .env
cat > .env << 'EOF'
PORT=5170
NODE_ENV=development
DB_HOST=mysql-app-sc.mysql.database.azure.com
DB_PORT=3306
DB_NAME=appdb
DB_USER=mysqladmin
DB_PASSWORD=P@ssw0rd123!
FRONTEND_URL=http://52.169.106.107:5193
DB_SSL=true
EOF

# 5. Transférez votre code (SCP, Git, ou copiez manuellement)
# 6. Installez les dépendances
npm install

# 7. Démarrez le service
npm start
```

**Avantages :**
- ✅ Contrôle total
- ✅ Coût plus bas
- ✅ Accès SSH direct
- ✅ Flexibilité maximale

**Résultat :**
```
Backend:  http://52.169.106.107:5170/health
Frontend: http://52.169.106.107:5193
API:      http://52.169.106.107:5170/api/products
```

## 🧪 Tests après déploiement

### **Azure App Service**
```bash
# Tests backend
curl https://backend-app-sc.azurewebsites.net/health
curl https://backend-app-sc.azurewebsites.net/api/products

# Tests frontend
curl https://frontend-app-sc.azurewebsites.net
```

### **VM Azure**
```bash
# Tests backend
curl http://52.169.106.107:5170/health
curl http://52.169.106.107:5170/api/products

# Tests frontend
curl http://52.169.106.107:5193
```

## 📋 Comparaison des options

| Critère | Azure App Service | VM Azure |
|---------|-------------------|----------|
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Coût** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Contrôle** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scaling** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Maintenance** | ⭐⭐⭐⭐⭐ | ⭐⭐ |

## 🔧 Dépannage

### **MySQL Connection Issues**
```bash
# Vérifier la connexion depuis Azure
az mysql flexible-server show --resource-group rg-terraform-app-sc --name mysql-app-sc

# Vérifier les règles de firewall
az mysql flexible-server firewall-rule list --resource-group rg-terraform-app-sc --server-name mysql-app-sc
```

### **Port Issues**
```bash
# Vérifier les ports ouverts sur VM
sudo ufw status
sudo netstat -tlnp | grep :5170
```

### **App Service Logs**
```bash
# Voir les logs d'App Service
az webapp log tail --resource-group rg-terraform-app-sc --name backend-app-sc
```

## 🎯 Recommandation

**Pour le développement/tests :** Utilisez la VM Azure (Option 2)
**Pour la production :** Utilisez Azure App Service (Option 1)

## 🚀 Démarrage rapide

```powershell
# Depuis Windows PowerShell
cd React-CRUD
.\backend\deploy-to-azure.ps1
```

Ou

```bash
# Connexion VM
ssh azureuser@52.169.106.107
# Suivez les étapes de l'Option 2
``` 