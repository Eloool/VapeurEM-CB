# VapeurEM-CB

Vapeur est un site web qui permet de répertorier les jeux video et leurs editors. Ce site a été fait avec Expressjs et Prisma pour le backend et HandleBars pour les templates.

# 1. Cloner le projet:
Dans git bash dans un nouveau dossier écrire:
```bash
git clone https://github.com/Eloool/VapeurEM-CB.git 
```
# 2. Installation des dépendences
Ouvrir le projet dans Visual Studio Code.  
Dans le terminal cmd de Visual Studio Code écrire:
```bash
npm install
```
# 3. Configurer prisma
Créer un fichier .env à la racine.  
Mettre dans ce fichier :
```env
DATABASE_URL="file:./database.db"
```
Dans le cmd:
```bash
 npx prisma migrate dev --name serveur
```
# 4. Lancer le serveur
Dans le cmd écrire:
```bash
npm run serveur
```
# 5. Accéder au site
Mettre dans votre navigateur : 
```
http://localhost:3000
```