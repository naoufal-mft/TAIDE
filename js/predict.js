window.addEventListener('load', () => {
    // Données d'entraînement initiales
    const trainingData = [];
    fetch('csv_files/training_data.csv')
  .then(response => response.text())
  .then(csvData => {
    // Utiliser papaparse pour parser les données CSV
    Papa.parse(csvData, {
      header: true,
      complete: function(results) {
        // Calculer l'indice à partir duquel récupérer le dernier quart des données
        const startIndex = Math.floor(results.data.length * 0.95);
        
        // Récupérer uniquement le dernier quart des données
        const trainingDataFromCSV = results.data.slice(startIndex);
        
        // Supprimer la dernière ligne
        trainingDataFromCSV.pop();
        
        // Remplacer les données d'entraînement initiales par les données extraites du fichier CSV
        trainingData.length = 0; // Supprimer toutes les données précédentes
        trainingData.push(...trainingDataFromCSV);
        
        // Une fois toutes les données lues, exécuter le reste du code
        console.log('Données d\'entraînement extraites avec succès :', trainingData);
        // Appeler la fonction pour mettre à jour le graphique
        mettreAJourGraphique();
        mettreAJourTableau();
      }
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération du fichier CSV :', error);
  });

    // Stocker les données prédites dans un tableau
    const predictedData = [];
    
    // Utiliser fetch() pour récupérer le fichier CSV
    fetch('csv_files/predicted_prices_with_dates.csv')
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
            mettreAJourTableau();
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
        myChart.data.datasets[1].data = [...Array(trainingPrices.length - 1).fill(null), trainingData[trainingPrices.length - 1].closingPrice, ...predictedPrices];
        myChart.data.datasets[2].data = [...Array(trainingPrices.length - 1).fill(null), trainingData[trainingPrices.length - 1].closingPrice, ...actualPrices];
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
        mettreAJourTableau();
    }
    function mettreAJourTableau() {
        const tableBody = document.querySelector('#myTable tbody');
    
        // Récupérer la dernière prédiction
        const lastPrediction = predictedData[0];
    
        // Si aucune prédiction n'est disponible, sortir de la fonction
        if (!lastPrediction) return;
    
        // Créer une nouvelle ligne pour chaque date de la dernière prédiction
        for (let i = 1; i <= 3; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lastPrediction[`Date_${i}`]}</td>
                <td>${lastPrediction[`Predicted_Close_${i}`]}</td>
                <td>${lastPrediction[`Actual_Close_${i}`]}</td>
                <td>${trainingData[trainingData.length - 1].closingPrice}</td>
            `;
            tableBody.appendChild(row);
        }
    }
    
    
    
    // Écouter les clics sur le bouton pour traiter la prochaine prédiction
    document.getElementById('nextPredictionBtn').addEventListener('click', traiterProchainePrediction);
    });