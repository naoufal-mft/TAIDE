# TRAIDE

Notre plateforme repose sur des modèles d'apprentissage automatique de pointe pour analyser les tendances du marché, les données historiques et le sentiment du marché, offrant ainsi des prévisions de prix pertinentes. Notre objectif dépasse la simple amélioration des performances commerciales individuelles ; nous aspirons également à transformer la manière dont les individus interagissent avec les marchés financiers et à contribuer à une prise de décision plus informée dans l'investissement en actions.

## Stockage des Données Utilisateur

Les données utilisateur et leurs informations d'identification sont stockées dans une base de données MySQL.

## Technologies Utilisées

- **Base de Données:** MySQL
- **Backend / Serveur:** Node.js
- **Frontend / Site web:** HTML ,CSS ,JavaScript et Bootstrap
- **Developpement IA et strategies:** Python


## Prérequis

Avant de lancer le serveur, assurez-vous d'avoir Node.js installé sur votre machine. Si ce n'est pas le cas, vous pouvez l'installer en suivant les instructions sur le site officiel [Node.js](https://nodejs.org/).
Assurer d'avoir installer MySQL et avoir executer le schema de creation de la base de données 'databaseCode.sql'.
Dans le code,assurer de rensigner les informations propres à votre base de données
## Installation des Dépendances

Installez les dépendances nécessaires en exécutant les commandes suivantes dans votre terminal (Powershell):
```bash

npm install mysql2

npm install http

npm install express

npm install body-parser

npm install express-session

npm install express-mysql-session

npm install pm2 -g

npm install crypto
```
## Lancement du serveur
Lancer le serveur en exécutant les commandes suivantes dans votre terminal (Powershell):
```bash
pm2 start index.js
pm2 start login.js
pm2 start modd.js
pm2 start register.js
pm2 start table.js
```
Après avoir lancer ces programmes node js, aller dans un navigateur et aller à http://localhost:4500/
## Arrêt du serveur
Areter le serveur en exécutant la commande suivante dans votre terminal (Powershell):
```bash
pm2 stop all
```
PS: Pour des raison de sécurité, windows vous empeche de lancer des scripts avec pm2,pour contourner ça, lancer cette commande:
```bash
powershell -ExecutionPolicy Bypass       
```
