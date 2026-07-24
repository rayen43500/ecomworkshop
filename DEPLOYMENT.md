# 🚀 Guide de Déploiement — E-commerce MERN

Ce guide explique comment déployer l'application e-commerce avec :
- **Frontend** → Cloudflare Pages (gratuit)
- **Backend** → Render.com (gratuit)

---

## Prérequis

- Un compte [Cloudflare](https://dash.cloudflare.com/sign-up) (gratuit)
- Un compte [Render.com](https://render.com/) (gratuit)
- Le repo GitHub : `https://github.com/rayen43500/ecomworkshop.git`
- Une base de données MongoDB Atlas (ou autre MongoDB hébergé)

---

## 📦 Étape 1 : Préparer le code

Le code a déjà été configuré pour le déploiement :
- ✅ CORS configuré dans le backend pour accepter les requêtes du frontend
- ✅ Axios utilise une `baseURL` dynamique via `REACT_APP_API_URL`
- ✅ Fichier `_redirects` pour le routage SPA sur Cloudflare Pages
- ✅ Le backend ne sert plus le frontend en statique (déploiement séparé)

**Poussez les changements sur GitHub :**
```bash
git add .
git commit -m "feat: configure for Cloudflare Pages + Render.com deployment"
git push origin main
```

---

## 🖥️ Étape 2 : Déployer le Backend sur Render.com

### 2.1 Créer un nouveau Web Service

1. Allez sur [Render Dashboard](https://dashboard.render.com/)
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repo GitHub `rayen43500/ecomworkshop`
4. Configurez :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `ecommerce-backend` |
| **Region** | `Frankfurt (EU Central)` ou le plus proche |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` |

### 2.2 Configurer les Variables d'Environnement

Dans l'onglet **"Environment"** de votre service Render, ajoutez :

| Variable | Valeur |
|----------|--------|
| `MONGO_URI` | `mongodb+srv://...` (votre URI MongoDB Atlas) |
| `JWT_SECRET` | `votre-secret-jwt-super-securise` |
| `JWT_EXPIRE` | `7d` |
| `COOKIE_EXPIRE` | `7` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `FRONTEND_URL` | `https://votre-projet.pages.dev` ⚠️ (à mettre à jour après l'étape 3) |
| `CLOUDINARY_NAME` | Votre nom Cloudinary |
| `API_KEY` | Votre clé API Cloudinary |
| `API_SECRET` | Votre secret API Cloudinary |
| `STRIPE_SECRET_KEY` | `sk_test_...` ou `sk_live_...` |
| `STRIPE_API_KEY` | `pk_test_...` ou `pk_live_...` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SERVICE` | `gmail` |
| `SMTP_MAIL` | Votre email |
| `SMTP_PASSWORD` | Votre mot de passe d'application |

### 2.3 Déployer

Cliquez **"Create Web Service"**. Render va :
1. Cloner le repo
2. Installer les dépendances (`npm install`)
3. Démarrer le serveur (`node server.js`)

**Notez l'URL du backend** (ex: `https://ecommerce-backend-xxxx.onrender.com`)

---

## 🌐 Étape 3 : Déployer le Frontend sur Cloudflare Pages

### 3.1 Créer un projet Cloudflare Pages

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/) → **"Workers & Pages"**
2. Cliquez **"Create"** → **"Pages"** → **"Connect to Git"**
3. Sélectionnez votre repo GitHub `rayen43500/ecomworkshop`
4. Configurez :

| Paramètre | Valeur |
|-----------|--------|
| **Project name** | `ecommerce-frontend` |
| **Production branch** | `main` |
| **Framework preset** | `Create React App` |
| **Root directory** | `frotend` |
| **Build command** | `npm run build` |
| **Build output directory** | `build` |

### 3.2 Configurer les Variables d'Environnement

Dans **"Environment variables"** (section du build), ajoutez :

| Variable | Valeur |
|----------|--------|
| `REACT_APP_API_URL` | `https://ecommerce-backend-xxxx.onrender.com` ← URL Render de l'étape 2 |
| `GENERATE_SOURCEMAP` | `false` |
| `NODE_VERSION` | `18` |

### 3.3 Déployer

Cliquez **"Save and Deploy"**. Cloudflare va :
1. Cloner le repo
2. Builder le frontend React
3. Déployer les fichiers statiques

**Notez l'URL du frontend** (ex: `https://ecommerce-frontend.pages.dev`)

---

## 🔄 Étape 4 : Mettre à jour les URLs croisées

### 4.1 Mettre à jour le backend (Render)

Retournez dans les variables d'environnement de Render et mettez à jour :

```
FRONTEND_URL = https://ecommerce-frontend.pages.dev
```

### 4.2 Mettre à jour le fichier `_redirects`

Dans `frotend/public/_redirects`, remplacez `YOUR-BACKEND-URL` par l'URL réelle :

```
/api/* https://ecommerce-backend-xxxx.onrender.com/api/:splat 200
/* /index.html 200
```

Puis poussez :
```bash
git add frotend/public/_redirects
git commit -m "fix: update backend URL in _redirects"
git push origin main
```

### 4.3 Mettre à jour `.env.production`

Dans `frotend/.env.production`, remplacez `YOUR-BACKEND-URL` :

```
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=https://ecommerce-backend-xxxx.onrender.com
```

> **Note** : La variable `REACT_APP_API_URL` dans le dashboard Cloudflare Pages prend la priorité sur le fichier `.env.production`. Les deux méthodes fonctionnent.

---

## ✅ Étape 5 : Vérification

### Tester le backend
```
https://ecommerce-backend-xxxx.onrender.com/api/v1/health
```

### Tester le frontend
```
https://ecommerce-frontend.pages.dev
```

### Checklist de vérification
- [ ] La page d'accueil se charge correctement
- [ ] Les produits s'affichent (appel API fonctionne)
- [ ] L'inscription/connexion fonctionne
- [ ] Les images Cloudinary se chargent
- [ ] Le paiement Stripe fonctionne
- [ ] Les emails de notification sont envoyés

---

## ⚠️ Notes importantes

### Render.com (plan gratuit)
- Le serveur **s'éteint après 15 minutes d'inactivité** (plan gratuit)
- Le premier appel après inactivité prend ~30 secondes (cold start)
- Pour éviter cela, passez au plan payant ou utilisez un service de ping (ex: UptimeRobot)

### Cloudflare Pages
- Les déploiements sont **automatiques** à chaque `git push` sur la branche `main`
- Chaque pull request crée un **preview deployment** avec une URL unique
- Limite de 500 déploiements/mois sur le plan gratuit

### Cookies et CORS
- Les cookies `httpOnly` (pour l'auth JWT) nécessitent `credentials: true` dans CORS
- Si vous utilisez un domaine personnalisé, assurez-vous que le cookie `SameSite` est configuré correctement
- En production avec des domaines différents (`.pages.dev` et `.onrender.com`), les cookies cross-origin peuvent poser problème. Dans ce cas, envisagez d'utiliser un header `Authorization: Bearer <token>` au lieu des cookies.

### Domaine personnalisé (optionnel)
1. Dans Cloudflare Pages → **"Custom domains"** → ajoutez votre domaine
2. Dans Render → **"Custom Domain"** → ajoutez un sous-domaine `api.votredomaine.com`
3. Mettez à jour `FRONTEND_URL` et `REACT_APP_API_URL` en conséquence
