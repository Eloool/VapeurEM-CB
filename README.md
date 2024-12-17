# VapeurEM-CB

Vapeur est un site web permettant de répertorier les jeux vidéo et leurs éditeurs. Ce site a été développé avec Express.js et Prisma pour le backend, et HandleBars pour les templates.

## 1. Cloner le projet  
Dans Git Bash, dans un dossier vide, entrez la commande suivante :  
```bash
git clone https://github.com/Eloool/VapeurEM-CB.git 
```

## 2. Installer les dépendances  
Ouvrez le projet dans Visual Studio Code.  
Dans le terminal (CMD) de Visual Studio Code, entrez :  
```bash
npm install
```

## 3. Configurer Prisma  
1. Créez un fichier `.env` à la racine du projet.  
2. Ajoutez-y le contenu suivant :  
   ```env
   DATABASE_URL="file:./database.db"
   ```  
3. Dans le terminal, exécutez la commande suivante :  
   ```bash
   npx prisma migrate dev --name serveur
   ```

## 4. Lancer le serveur  
Dans le terminal, entrez :  
```bash
npm run serveur
```

## 5. Accéder au site  
Ouvrez votre navigateur et entrez l'URL suivante :  
```
http://localhost:3008
```

---

Créé par Christophe Bolon et Elyo Maamari  