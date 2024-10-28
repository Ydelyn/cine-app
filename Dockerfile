# Utiliser l'image officielle Node.js comme image de base
FROM node:22.2.0

# Définir le répertoire de travail
WORKDIR /src

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers de l'application dans le conteneur
COPY . .

# Construire l'application pour la production
RUN npm run build

# Exposer le port sur lequel l'application sera accessible
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["npx", "serve", "-s", "build"]
