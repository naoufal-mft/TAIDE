function loadCSV(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var lines = xhr.responseText.split('\n');
                var data = lines.slice(1).map(line => line.split(','));
                callback(data);
            } else {
                console.error('Impossible de charger le fichier CSV');
            }
        }
    };
    xhr.open('GET', 'dates_rmse.csv');
    xhr.send();
}

// Fonction pour créer le graphique avec Chart.js
function createChart(data) {
    var dates = data.map(row => row[0]);
    var rmse = data.map(row => parseFloat(row[1]));

    var ctx = document.getElementById('rmseChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'RMSE',
                data: rmse,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'RMSE'
                    }
                }]
            }
        }
    });
}

// Charger le fichier CSV et créer le graphique
loadCSV(createChart);