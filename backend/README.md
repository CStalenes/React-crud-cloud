# React CRUD Backend API

Backend API pour l'application React CRUD utilisant Node.js, Express.js, et MySQL.

## 🚀 Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de données
- **Sequelize** - ORM pour MySQL
- **Joi** - Validation des données
- **Helmet** - Sécurité HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - Logger HTTP
- **Multer** - Upload de fichiers
- **Sharp** - Traitement d'images

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- MySQL (version 8.0 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
```

4. **Modifier le fichier .env**
```bash
# Server Configuration
PORT=5193
NODE_ENV=production

# Database Configuration
DB_HOST=mysql-app-sc.mysql.database.azure.com
DB_PORT=3306
DB_NAME=appdb
DB_USER=mysqladmin
DB_PASSWORD=P@ssw0rd123!

# CORS Configuration
FRONTEND_URL=http://52.169.106.107:5193
```

5. **Créer la base de données**
```bash
npm run db:create
```

6. **Créer l'image par défaut**
```bash
npm run create-default-image
```

7. **Synchroniser la base de données**
```bash
npm run db:migrate
```

8. **Insérer des données de test (optionnel)**
```bash
npm run db:seed
```

## 🏃‍♂️ Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## 📡 API Endpoints

### Products

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Récupérer tous les produits |
| GET | `/api/products/:id` | Récupérer un produit spécifique |
| POST | `/api/products` | Créer un nouveau produit (avec upload d'image) |
| PUT | `/api/products/:id` | Mettre à jour un produit (avec upload d'image) |
| DELETE | `/api/products/:id` | Supprimer un produit |
| GET | `/api/products/stats` | Statistiques des produits |
| DELETE | `/api/products/bulk-delete` | Supprimer plusieurs produits |

### Upload d'images

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/uploads/:filename` | Servir les images uploadées |

## 🖼️ Gestion des images

### **Upload d'images**
- **Format supportés** : JPG, PNG, GIF, WebP
- **Taille maximum** : 5MB
- **Traitement automatique** : 
  - Redimensionnement max 800x600px
  - Conversion en WebP
  - Compression qualité 80%

### **Stockage**
- Images stockées dans `/backend/uploads/`
- Noms de fichiers uniques générés automatiquement
- Image par défaut si aucune image uploadée

### **Exemples d'utilisation**

#### Créer un produit avec image
```bash
curl -X POST http://52.169.106.107:5170/api/products \
  -F "name=Nouveau Produit" \
  -F "quantity=10" \
  -F "price=99.99" \
  -F "image=@/path/to/image.jpg"
```

#### Mettre à jour un produit avec nouvelle image
```bash
curl -X PUT http://52.169.106.107:5170/api/products/1 \
  -F "name=Produit Modifié" \
  -F "price=149.99" \
  -F "image=@/path/to/new-image.jpg"
```

#### Accéder à une image
```bash
curl http://52.169.106.107:5193/uploads/product-1640995200000-123456789.webp
```

## 📊 Structure des données

### Modèle Product
```json
{
  "_id": 1,
  "name": "Nom du produit",
  "quantity": 10,
  "price": 99.99,
  "image": "/uploads/product-1640995200000-123456789.webp",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Sécurité

- **Helmet** : Protection contre les vulnérabilités web communes
- **CORS** : Configuration des origines autorisées
- **Rate Limiting** : Limitation des requêtes par IP
- **Validation** : Validation des données avec Joi
- **Upload sécurisé** : Validation des types de fichiers et taille

## 📁 Structure des fichiers

```
backend/
├── uploads/                  # Images uploadées
│   └── default-product.png   # Image par défaut
├── middleware/
│   └── uploadMiddleware.js   # Gestion upload Multer
├── models/
│   └── Product.js           # Modèle avec gestion images
└── scripts/
    └── createDefaultImage.js # Script création image par défaut
```

## 🔧 Configuration de la base de données

### Création manuelle de la base de données
```sql
CREATE DATABASE react_crud_db;
USE react_crud_db;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  image TEXT DEFAULT '/uploads/default-product.png',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 📝 Scripts disponibles

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer le serveur en développement
- `npm run db:create` - Créer la base de données
- `npm run db:migrate` - Synchroniser la base de données
- `npm run db:seed` - Insérer des données de test
- `npm run create-default-image` - Créer l'image par défaut

## 🐛 Débogage

### Vérifier la connexion à la base de données
```bash
node -e "
import { sequelize } from './config/database.js';
sequelize.authenticate()
  .then(() => console.log('✅ Connexion OK'))
  .catch(err => console.error('❌ Erreur:', err));
"
```

### Vérifier les uploads
```bash
# Vérifier que le dossier uploads existe
ls -la uploads/

# Tester l'upload
curl -X POST http://52.169.106.107:5170/api/products \
  -F "name=Test" \
  -F "quantity=1" \
  -F "price=10" \
  -F "image=@test-image.jpg"
```

### Logs des requêtes SQL
Pour afficher les requêtes SQL dans la console, définissez `NODE_ENV=development` dans votre fichier `.env`.

## 🤝 Contribution

1. Fork le project
2. Créer une branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branch (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 