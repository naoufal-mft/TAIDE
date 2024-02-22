# Trading_Robot
Ce dépôt contient des fichiers de stratégies de trading ainsi qu'un modèle de réseau neuronal pour la prédiction des prix des actions. Vous trouverez ci-dessous une brève description de chaque fichier présent dans ce dépôt.

### Fichiers de Stratégies de Trading
- `crossover.py`: Le fichier crossover.py contient une stratégie de trading basée sur le croisement de moyennes mobiles et l'indicateur RSI.

- `MACD.py`: Le fichier MACD.py contient une stratégie de trading basée sur l'indicateur MACD (Moving Average Convergence Divergence).

- `BollingerBands.py`: Le fichier BollingerBands.py contient une stratégie de trading basée sur les bandes de Bollinger.

### Modèles de Prédiction
- `Random_Forest_Model.py`: Ce fichier contient le code pour un modèle de prédiction utilisant l'algorithme Random Forest. Ce modèle a été testé initialement pour les mouvements des actions.

- `RNN_Model.py`: Ce fichier contient le code pour notre modèle principal de prédiction des prix des actions basé sur un Réseau de Neurones Récurrents (RNN). Ce modèle a été entraîné et testé à l'aide des données des fichiers CSV fournis.

### Données
Les données utilisées pour l'entraînement et le test des modèles sont stockées dans trois fichiers CSV, nommément :
- `donnees_boursieres_AAPL.csv`
- `donnees_boursieres_NIO.csv`
- `donnees_boursieres_TSLA.csv`

Ces fichiers contiennent les données historiques des prix des actions pour les sociétés Apple, NIO et Tesla respectivement.
