# Guide Azure CLI sur VM Azure

## ✅ Installation terminée

Azure CLI version 2.72.0 est installé sur la VM Azure (52.169.106.107)

## 🔑 Authentification

### **Méthode 1 : Service Principal (Recommandé pour la VM)**

```bash
# Sur la VM
ssh azureuser@52.169.106.107

# Créer un Service Principal depuis votre machine locale
az ad sp create-for-rbac --name "vm-azure-sp" --role contributor --scopes /subscriptions/d18efcbe-caa9-4004-ac2c-7312261e11de

# Utiliser les informations retournées pour se connecter sur la VM
az login --service-principal -u <appId> -p <password> --tenant <tenant>
```

### **Méthode 2 : Connexion interactive**

```bash
# Sur la VM
ssh azureuser@52.169.106.107

# Connexion interactive (ouvrira un lien avec un code)
az login

# Suivre les instructions affichées
```

### **Méthode 3 : Utiliser l'identité managée de la VM**

```bash
# Activer l'identité managée (depuis votre machine locale)
az vm identity assign --resource-group rg-terraform-app-sc --name vm-app-sc

# Sur la VM, se connecter avec l'identité managée
az login --identity
```

## 🛠️ Commandes utiles sur la VM

### **Vérifier la connexion**
```bash
# Vérifier le compte connecté
az account show

# Lister les abonnements
az account list

# Définir l'abonnement actuel
az account set --subscription "d18efcbe-caa9-4004-ac2c-7312261e11de"
```

### **Gestion des ressources**
```bash
# Lister les ressources du groupe
az resource list --resource-group rg-terraform-app-sc

# Vérifier l'état du serveur MySQL
az mysql flexible-server show --resource-group rg-terraform-app-sc --name mysql-app-sc

# Voir les règles de firewall MySQL
az mysql flexible-server firewall-rule list --resource-group rg-terraform-app-sc --server-name mysql-app-sc
```

### **Gestion des App Services**
```bash
# Lister les App Services
az webapp list --resource-group rg-terraform-app-sc

# Voir les logs d'une App Service
az webapp log tail --resource-group rg-terraform-app-sc --name backend-app-sc

# Redémarrer une App Service
az webapp restart --resource-group rg-terraform-app-sc --name backend-app-sc
```

## 🚀 Déploiement depuis la VM

### **Déployer vers Azure App Service**

```bash
# Sur la VM
cd ~/backend

# Créer un package zip
zip -r backend.zip . -x "node_modules/*" ".git/*" "*.log"

# Déployer vers App Service
az webapp deployment source config-zip \
    --resource-group rg-terraform-app-sc \
    --name backend-app-sc \
    --src backend.zip

# Configurer les variables d'environnement
az webapp config appsettings set \
    --resource-group rg-terraform-app-sc \
    --name backend-app-sc \
    --settings \
    NODE_ENV=production \
    DB_HOST=mysql-app-sc.mysql.database.azure.com \
    DB_PORT=3306 \
    DB_NAME=appdb \
    DB_USER=mysqladmin \
    DB_PASSWORD=P@ssw0rd123! \
    FRONTEND_URL=https://frontend-app-sc.azurewebsites.net \
    DB_SSL=true
```

## 🔧 Scripts automatisés

### **Script de déploiement App Service**

```bash
# Sur la VM
cat > deploy-to-appservice.sh << 'EOF'
#!/bin/bash
cd ~/backend
zip -r backend.zip . -x "node_modules/*" ".git/*" "*.log"
az webapp deployment source config-zip \
    --resource-group rg-terraform-app-sc \
    --name backend-app-sc \
    --src backend.zip
rm backend.zip
echo "✅ Déploiement terminé!"
echo "🔗 URL: https://backend-app-sc.azurewebsites.net"
EOF

chmod +x deploy-to-appservice.sh
```

### **Script de gestion MySQL**

```bash
# Sur la VM
cat > manage-mysql.sh << 'EOF'
#!/bin/bash
echo "🔍 État du serveur MySQL:"
az mysql flexible-server show --resource-group rg-terraform-app-sc --name mysql-app-sc --query "{name:name, state:state, version:version}" -o table

echo "🔥 Règles de firewall:"
az mysql flexible-server firewall-rule list --resource-group rg-terraform-app-sc --server-name mysql-app-sc -o table

echo "📊 Connexions actives:"
az mysql flexible-server show --resource-group rg-terraform-app-sc --name mysql-app-sc --query "replica.capacity"
EOF

chmod +x manage-mysql.sh
```

## 🔒 Sécurité

### **Bonnes pratiques**

1. **Utilisez Service Principal** plutôt que votre compte personnel
2. **Limitez les permissions** au minimum nécessaire
3. **Rotez les credentials** régulièrement
4. **Utilisez l'identité managée** quand possible

### **Créer un Service Principal avec permissions limitées**

```bash
# Depuis votre machine locale
az ad sp create-for-rbac \
    --name "vm-backend-sp" \
    --role contributor \
    --scopes /subscriptions/d18efcbe-caa9-4004-ac2c-7312261e11de/resourceGroups/rg-terraform-app-sc
```

## 📋 Commandes de maintenance

### **Mise à jour Azure CLI**
```bash
# Sur la VM
az upgrade
```

### **Nettoyage des caches**
```bash
# Sur la VM
az cache purge
```

### **Configuration**
```bash
# Voir la configuration actuelle
az configure --list-defaults

# Définir des valeurs par défaut
az configure --defaults group=rg-terraform-app-sc location=northeurope
```

## 🧪 Tests

### **Tester la connexion Azure**
```bash
# Sur la VM
az account show
az resource list --resource-group rg-terraform-app-sc
```

### **Tester MySQL**
```bash
# Sur la VM
az mysql flexible-server show --resource-group rg-terraform-app-sc --name mysql-app-sc
```

## 🔗 Ressources utiles

- **Documentation Azure CLI** : https://docs.microsoft.com/en-us/cli/azure/
- **Référence des commandes** : https://docs.microsoft.com/en-us/cli/azure/reference-index
- **Service Principal** : https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli 