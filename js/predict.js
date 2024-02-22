//@author: MEFTAHI Naoufal

document.addEventListener("DOMContentLoaded", function () {
     // la fonction fetch() est utilisée pour récupérer les données du serveur
     fetch('/buttons') // Mettez à jour l'URL pour correspondre à votre point de terminaison serveur
     .then(response => {
         if (!response.ok) {
             throw new Error('Network response was not ok');
         }
         return response.text();
     })
     .then(data => {
         //parse est utilisé pour convertir les données en HTML
         document.getElementById('buttonContainer').innerHTML = data;
         console.log("success")
         console.log(data);

         // Sélectionnez tous les boutons avec la classe ".btn.btn-primary.me-2"
         const buttons = document.querySelectorAll('.btn.btn-primary.me-2');

         // Ajoutez des gestionnaires d'événements clic à chaque bouton
         buttons.forEach(button => {
             button.addEventListener('click', function() {
                 buttons.forEach(btn => {
                     btn.classList.remove('active-button');
                 });
     
                 // Ajoutez la classe active au bouton cliqué
                 button.classList.add('active-button');
                 // Récupérez l'ID du bouton sur lequel l'utilisateur a cliqué
                 const action = button.id;

                 // la fonction fetch() est utilisée pour récupérer les données du serveur
                 fetch('/run_Model_RNN', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: action })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const predictedData = data.predictedData;
                const trainingData = data.trainingData;

                // Utilisez les données prédites et d'entraînement comme nécessaire
                console.log('Données prédites:', predictedData);
                console.log('Données d\'entraînement:', trainingData);
                chargerDonnees(predictedData, trainingData);
            })
            
                 contentContainer.classList.remove('hidden-content');
             });
         });
     })
     .catch(error => {
         console.error('Error fetching data:', error);
     });

 });

    // Données d'entraînement initiales
    const trainingData = [];
    
    // Stocker les données prédites dans un tableau
    const predictedData = [];

    // Ajoutez cette fonction pour réinitialiser le tableau
    function reinitialiserTableau() {
        // Effacer toutes les données de la table
        dataTable.clear().draw();
    }
    // Ajoutez ces fonctions pour réinitialiser les graphiques d'erreur et de prédiction
    function reinitialiserGraphiqueErreur() {
        // Effacer les données du graphique d'erreur
        errorChart.data.labels = [];
        errorChart.data.datasets[0].data = [];
        errorChart.update();
    }

    function reinitialiserGraphiquePrediction() {
        // Effacer les données du graphique de prédiction
        myNewChart.data.labels = [];
        myNewChart.data.datasets[0].data = [];
        myNewChart.data.datasets[1].data = [];
        myNewChart.update();
    }

    // Définir la fonction pour charger les données à partir des données d'entraînement et prédites
    function chargerDonnees(trainingData, predictedData) {
        reinitialiserTableau();
        reinitialiserGraphiqueErreur();
        reinitialiserGraphiquePrediction();
        // Réinitialiser les tableaux de données
        trainingData.length = 0;
        predictedData.length = 0;

        // Charger les données d'entraînement et prédites depuis l'objet JSON
        const { trainingData: trainingDataJson, predictedData: predictedDataJson } = data;

        // Mettre à jour les tableaux de données avec les données reçues
        trainingData.push(...trainingDataJson);
        predictedData.push(...predictedDataJson);

        console.log("Données d'entraînement chargées avec succès :", trainingData);
        console.log("Données prédites chargées avec succès :", predictedData);

        mettreAJourGraphique();
        mettreAJourGraphiqueErreur();
        mettreAJourPredictionGraphique();
        mettreAJourTableau();
    }

   
    
    // Créer le graphique initial
    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Prix de clôture',
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
                x: {
                    
                    
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: false,
                    
                    
                    title: {
                        display: true,
                        text: 'Prix en $'
                    }
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
            },
            pan: {
                enabled: true,
                mode: 'x',
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
        mettreAJourGraphiqueErreur();
        mettreAJourPredictionGraphique();
        mettreAJourTableau();
    }
    
    
    // Initialiser la table DataTable une seule fois lors du chargement initial de la page
    const dataTable = $('#myTable').DataTable({
        language: {
            url: "assets/Datatables/French.json"
        },
        
        
        
        
    });

    // Fonction pour mettre à jour le tableau avec les données actuelles
    function mettreAJourTableau() {
        const lastPrediction = predictedData[0];

        if (!lastPrediction) return;

        const nouvellesLignes = [];
        for (let i = 1; i <= 3; i++) {
            const newRow = [
                lastPrediction[`Date_${i}`],
                lastPrediction[`Predicted_Close_${i}`]+"$",
                lastPrediction[`Actual_Close_${i}`]+"$",
                trainingData[trainingData.length - 1].closingPrice+ "$ à "+trainingData[trainingData.length - 1].date
            ];
            nouvellesLignes.push(newRow);
        }

        const totalPages = dataTable.page.info().pages;

        // Utiliser la méthode rows.add() pour ajouter de nouvelles lignes
        dataTable.rows.add(nouvellesLignes).draw();

        const newTotalPages = dataTable.page.info().pages;
        if (newTotalPages > totalPages) {
            dataTable.page('first').draw('page');
        }
    }
    // Créer le graphique d'erreur initial
    const errorChartCtx = document.getElementById('errorChart').getContext('2d');
    const errorChart = new Chart(errorChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'RMSE',
                    data: [],
                    borderColor: 'orange',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                }
            }
        }
    });
    
    // Initialiser le tableau pour stocker les erreurs précédentes
    let previousErrors = [];

    // Fonction pour mettre à jour le graphique d'erreur avec les données actuelles
    function mettreAJourGraphiqueErreur() {
        const dates = predictedData[0] ? [predictedData[0].Date_1, predictedData[0].Date_2, predictedData[0].Date_3] : [];
        const predictedPrices = predictedData[0] ? [predictedData[0].Predicted_Close_1, predictedData[0].Predicted_Close_2, predictedData[0].Predicted_Close_3] : [];
        const actualPrices = predictedData[0] ? [predictedData[0].Actual_Close_1, predictedData[0].Actual_Close_2, predictedData[0].Actual_Close_3] : [];

        // Calculer les erreurs pour les prix prédits et réels
        const errors = predictedPrices.map((predictedPrice, index) => Math.abs(predictedPrice - actualPrices[index]));

        // Ajouter les nouvelles erreurs aux erreurs précédentes
        previousErrors = previousErrors.concat(errors);

        // Calculer la racine carrée moyenne des erreurs précédentes
        const rmse = Math.sqrt(previousErrors.reduce((sum, error) => sum + Math.pow(error, 2), 0) / previousErrors.length);

        // Mettre à jour le graphique d'erreur avec la nouvelle RMSE
        dates.forEach((date, index) => {
            const existingIndex = errorChart.data.labels.indexOf(date);
            if (existingIndex !== -1) {
                // Remplacer les erreurs existantes par les nouvelles erreurs si la date existe déjà
                errorChart.data.datasets[0].data[existingIndex] = rmse;
            } else {
                // Ajouter la nouvelle date et les erreurs si la date n'existe pas déjà
                errorChart.data.labels.push(date);
                errorChart.data.datasets[0].data.push(rmse);
            }
        });

        errorChart.update();
    }

    // Crée le graphique pour afficher les prix prédits et réels
    const ctx2 = document.getElementById('PredictionChart').getContext('2d');
    const myNewChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
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
                x: {
                    
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    
                    ticks: {
                        display: true,
                        stepSize: 5, 
                        
                    },
                    title: {
                        display: true,
                        text: 'Prix  en $'
                    }
                }
            }
        }
    });

    // Fonction pour mettre à jour le nouveau graphique avec les données actuelles

    function mettreAJourPredictionGraphique() {
        // Extraire les dates, prix prédits et prix réels de predictionData[0]
        const dates = predictedData[0] ? [predictedData[0].Date_1, predictedData[0].Date_2, predictedData[0].Date_3] : [];
        const predictedPrices = predictedData[0] ? [predictedData[0].Predicted_Close_1, predictedData[0].Predicted_Close_2, predictedData[0].Predicted_Close_3] : [];
        const actualPrices = predictedData[0] ? [predictedData[0].Actual_Close_1, predictedData[0].Actual_Close_2, predictedData[0].Actual_Close_3] : [];
    
        // Mettre à jour le graphique d'erreur avec les nouvelles données de prix prédits et réels
        dates.forEach((date, index) => {
            const existingIndex = myNewChart.data.labels.indexOf(date);
            if (existingIndex !== -1) {
                // Remplacer les prix existants par les nouveaux prix si la date existe déjà
                myNewChart.data.datasets[0].data[existingIndex] = predictedPrices[index];
                myNewChart.data.datasets[1].data[existingIndex] = actualPrices[index];
            } else {
                // Ajouter la nouvelle date et les prix si la date n'existe pas déjà
                myNewChart.data.labels.push(date);
                myNewChart.data.datasets[0].data.push(predictedPrices[index]);
                myNewChart.data.datasets[1].data.push(actualPrices[index]);
            }
        });
    
        myNewChart.update();
    }
    
    

    // Écouter les clics sur le bouton pour traiter la prochaine prédiction
    document.getElementById('nextPredictionBtn').addEventListener('click', traiterProchainePrediction);
