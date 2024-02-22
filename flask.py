from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/run_Model_RNN', methods=['POST'])
def run_lstm():
    action = request.json['action']

    # Exécuter votre script Python avec l'action
    process = subprocess.Popen(['python', 'Model_RNN.py', action], stdout=subprocess.PIPE)
    output, _ = process.communicate()

    # Analyser les données prédites et d'entraînement à partir de la sortie du script
    predictedData = ...  # Analyser les données prédites à partir de la sortie
    trainingData = ...   # Analyser les données d'entraînement à partir de la sortie

    return jsonify({
        'predictedData': predictedData,
        'trainingData': trainingData
    })

if __name__ == '__main__':
    app.run(debug=True)
