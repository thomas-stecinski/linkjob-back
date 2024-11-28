# Api projet Linkjob

L'API Linkjob est une solution complète pour gérer des CVs et des recommandations. Elle permet de :
- Créer, modifier, supprimer et lire des CVs.
- Gérer des recommandations associées à un CV.
- Authentifier les utilisateurs et gérer leurs sessions.
---

Le projet est développer avec react et express 

---

## Initialisation

1. Assurez-vous d'avoir les dernières versions de **Node.js**, **npm**, **React**, et **Express**.
2. Installez les dépendances nécessaires au projet avec :
   ```bash
   npm install

Voici un exemple de configuration pour le fichier .env:
```bash
DB_URL="your MongoDB URL"
ROLE_ADMIN_ID=<id admin role>
ROLE_RECRUITER_ID=<id recruiter role>
ROLE_USER_ID=<id user role>
STATUS_PUBLIC_ID=<id status public>
STATUS_PRIVATE_ID=<id status private>
STATUS_DRAFT_ID=<id status draft>
STATUS_DELETED_ID=<id status deleted>
STATUS_PENDING_ID=<id status pending>

PORT=<your backend port>
JWT_SECRET=<your JWT secret>

```

##Routes api

###Documentation api
Pour consulter la documentation api du projet:
```bash
<your address>/api/api-docs
```
###Routes Authentification:

Inscription:
```bash
/api/auth/register
```
Connexion:
```bash
/api/auth/login
```
Déconnexion:
```bash
/api/auth/logout
```
Information user:
```bash
/api/auth/me
```

###Routes CVs: 

Création cv:
```bash
/api/cv/create-cv
```
Modification cv:
```bash
/api/cv/update-cv
```
Suppression cv:
```bash
/api/cv/delete-cv
```
Récupération cv:
```bash
/api/cv/get-cv
```
Récupération cv par user:
```bash
/api/cv/get-cv/:userid
```

###Routes Recommendations: 

Récupération recommendations par cv:
```bash
/api/recommendation/:cvid/recommendations
```
Ajout d'une recommendation:
```bash
/api/recommendation/add-recommendation
```
Suppression recommendation:
```bash
/api/recommendation/delete/:id
```
Edition recommendation:
```bash
api/recommendation/edit/:id
```

##By linkjob


