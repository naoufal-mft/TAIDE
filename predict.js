// Données d'entraînement initiales
const trainingData = [
    { date: '2023-09-14', closingPrice: 175.01 },
    { date: '2023-09-15', closingPrice: 177.97 },
    { date: '2023-09-16', closingPrice: 179.07 },
    { date: '2023-09-17', closingPrice: 175.49 },
    { date: '2023-09-18', closingPrice: 173.93 }
];
// Stocker les données prédites dans un tableau
const predictedData = [];

// Utiliser fetch() pour récupérer le fichier CSV
fetch('predicted_prices_with_dates.csv')
  .then(response => response.text())
  .then(csvData => {
    // Utiliser papaparse pour parser les données CSV
    Papa.parse(csvData, {
      header: true,
      complete: function(results) {
        // Ajouter les données analysées au tableau predictedData
        predictedData.push(...results.data);
        
        // Une fois toutes les données lues, exécuter le reste du code
        console.log('Données prédites extraites avec succès :', predictedData);
        // Appeler la fonction pour mettre à jour le graphique
        mettreAJourGraphique();
      }
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération du fichier CSV :', error);
  });
// Créer le graphique initial
// Créer le graphique initial avec l'option de zoom et de déplacement
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Prix de clôture (entraînement)',
                data: [],
                borderColor: 'blue',
                fill: false
            },
            {
                label: 'Prix prédits',
                data: [],
                borderColor: 'red',
                fill: false
            },
            {
                label: 'Prix réels',
                data: [],
                borderColor: 'green',
                fill: false
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                }
            }
        }
    }
});

// Fonction pour mettre à jour le graphique avec les données actuelles
function mettreAJourGraphique() {
    const allDates = [...trainingData.map(data => data.date), ...predictedData.slice(0, 1).map(prediction => [prediction.Date_1, prediction.Date_2, prediction.Date_3]).flat()];
    const trainingPrices = trainingData.map(data => data.closingPrice);
    const predictedPrices = predictedData[0] ? [predictedData[0].Predicted_Close_1, predictedData[0].Predicted_Close_2, predictedData[0].Predicted_Close_3] : [];
    const actualPrices = predictedData[0] ? [predictedData[0].Actual_Close_1, predictedData[0].Actual_Close_2, predictedData[0].Actual_Close_3] : [];

    myChart.data.labels = allDates;
    myChart.data.datasets[0].data = [...trainingPrices];
    myChart.data.datasets[1].data = [...Array(trainingData.length - 1).fill(null), trainingData[trainingData.length - 1].closingPrice, ...predictedPrices];
    myChart.data.datasets[2].data = [...Array(trainingData.length - 1).fill(null), trainingData[trainingData.length - 1].closingPrice, ...actualPrices];
    myChart.update();
}

// Fonction pour traiter la prochaine prédiction
function traiterProchainePrediction() {
    // Si aucune prédiction n'est disponible, sortir de la fonction
    if (predictedData.length === 0) return;

    // Ajouter la date et le prix actuel à trainingData
    trainingData.push({ date: predictedData[0].Date_1, closingPrice: predictedData[0].Actual_Close_1 });

    // Supprimer la première ligne de predictedData
    predictedData.shift();

    // Mettre à jour le graphique avec les nouvelles données
    mettreAJourGraphique();
}

// Mettre à jour le graphique initial
mettreAJourGraphique();

// Écouter les clics sur le bouton pour traiter la prochaine prédiction
document.getElementById('nextPredictionBtn').addEventListener('click', traiterProchainePrediction);
