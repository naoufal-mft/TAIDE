# Nom du Projet

Description brève du projet.

## Stockage des Données Utilisateur

Les données utilisateur et leurs informations d'identification sont stockées dans une base de données MySQL.

## Technologies Utilisées

- **Base de Données:** MySQL
- **Backend / Serveur:** Node.js

## Prérequis

Avant de lancer le serveur, assurez-vous d'avoir Node.js installé sur votre machine. Si ce n'est pas le cas, vous pouvez l'installer en suivant les instructions sur le site officiel [Node.js](https://nodejs.org/).
Assurer d'avoir installer MySQL et avoir executer le schema de creation de la base de données
## Installation des Dépendances

Installez les dépendances nécessaires en exécutant les commandes suivantes dans votre terminal (Powershell):

npm install mysql2
npm install http
npm install express
npm install body-parser
npm install express-session
npm install express-mysql-session
npm install pm2 -g
npm install crypto
## Lancement du serveur
Lancer le serveur en exécutant les commandes suivantes dans votre terminal (Powershell):
pm2 start index.js
pm2 start login.js
pm2 start modd.js
pm2 start register.js
pm2 start table.js


