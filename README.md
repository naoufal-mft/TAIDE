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
## Site Web
Utilisation du site Web :

 - Inscription
   
<img src="/page_inscription.gif" width="1500">


 - Login
   
<img src="/login.gif" width="1500">


 - Visualisation des prédictions d'un Stock sélectionné
   
<img src="/stock.gif" width="1500">


 - Accés aux résultats des stratégies MACD et Bollinger Bands ainsi aux sentiments des utilisateurs de Reddit sur une Action
    
<img src="/strategie.gif" width="1500">



## Branches du Site Web

Le site web est implementé sur deux branches. La branche actuelle, "main", utilise des fichiers CSV obtenus à partir du réseau de neurones, (vous pouvez trouvez les scripts python du rnn et stratégies sur la branche ([lien vers la branche Trad_algo](https://github.com/naoufal-mft/TRAIDE/tree/Trad_algo))), pour afficher les prédictions. La deuxième branche,([lien vers la branche website+AI](https://github.com/naoufal-mft/TRAIDE/tree/website%2BAI)), représente une première base de liaison complète entre le RNN et le site web, qui aura besoin d'utiliser des données provenant d'une API en temps réel et le serveur Flask afin d'établir la communication entre le site web et le RNN.

Cette approche à deux branches permet d'explorer différentes approches pour intégrer les prédictions du réseau de neurones dans le site web, en utilisant soit des données statiques précalculées soit des données actuelles provenant d'une API de données boursières payante. Cela offre une flexibilité pour le développement futur et l'amélioration de la plateforme TRAIDE, en permettant d'expérimenter de nouvelles fonctionnalités et d'optimiser les performances des prédictions.


