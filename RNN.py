import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_percentage_error
import csv
import matplotlib.pyplot as plt

# Chargement des données
df = pd.read_csv('donnees_boursieres_AAPL.csv')

# Renommer les colonnes
df = df.rename(columns={'timestamp': 'Timestamp', 'open': 'Open', 'high': 'High', 'low': 'Low', 'close': 'Close', 'volume': 'Volume'})

# Inversion du DataFrame
df = df.iloc[::-1].reset_index(drop=True)

# Mise à l'échelle
features = df[['Open', 'High', 'Low', 'Close', 'Volume']]
scaler = MinMaxScaler()
features_scaled = scaler.fit_transform(features)

# Longueur de la séquence
sequence_length = 3
prediction_days = 3

# Séquences, étiquettes et dates
sequences = []
labels = []
dates = []

for i in range(len(features_scaled) - sequence_length - prediction_days):
    sequence = features_scaled[i: i + sequence_length]
    sequences.append(sequence)

    label_sequence = df['Close'].iloc[i + sequence_length: i + sequence_length + prediction_days].values
    labels.append(label_sequence)

    dates.append(df['date'].iloc[i + sequence_length + prediction_days - 1])

# Conversion en tableaux numpy
sequences = np.array(sequences)
labels = np.array(labels)

# Division des données
X_train, X_test, y_train, y_test, dates_train, dates_test = train_test_split(sequences, labels, dates, test_size=0.2, shuffle=False)

# Extraction des données d'entraînement contenant uniquement la date et la colonne de clôture
training_data = pd.DataFrame({'date': dates_train, 'closingPrice': [label[0] for label in y_train]})

# Sauvegarde au format CSV
chemin_sortie = 'training_data_PLUG.csv'
training_data.to_csv(chemin_sortie, index=False)
print(f"Données d'entraînement avec date et colonne de clôture sauvegardées sous {chemin_sortie}")

# Modèle RNN
model = Sequential([
    LSTM(units=128, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
    Dropout(0.2),
    LSTM(units=64),
    Dense(units=prediction_days)
])

# Compilation
model.compile(loss='mean_squared_error', optimizer='adam')

# Arrêt précoce
arret_precoce = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# Entraînement
historique = model.fit(X_train, y_train, epochs=3000, batch_size=32, validation_split=0.2, callbacks=[arret_precoce], verbose=1)

# Évaluation
perte_test = model.evaluate(X_test, y_test)
print(f"Perte de test : {perte_test}")

# Prédictions
predictions = []

# Inclure toutes les prédictions précédentes comme données d'entraînement pour chaque nouvelle prédiction
for i in range(len(X_test)):
    # Ajouter la dernière séquence et ses étiquettes correspondantes aux données d'entraînement
    X_train = np.append(X_train, [X_test[i]], axis=0)
    y_train = np.append(y_train, [y_test[i]], axis=0)
    
    # Entraîner le modèle avec les données d'entraînement mises à jour
    historique = model.fit(X_train, y_train, epochs=3000, batch_size=32, validation_split=0.2, callbacks=[arret_precoce], verbose=0)
    
    # Faire des prédictions pour la séquence actuelle
    prediction_actuelle = model.predict(np.array([X_test[i]]))
    predictions.append(prediction_actuelle)

# Conversion des prédictions en tableau numpy
predictions = np.array(predictions)

# Créer un DataFrame pour stocker les prédictions, les valeurs réelles et les dates pour chaque jour
predicted_df = pd.DataFrame(columns=[f"Predicted_Close_{i+1}" for i in range(prediction_days)])
actual_df = pd.DataFrame(columns=[f"Actual_Close_{i+1}" for i in range(prediction_days)])
date_df = pd.DataFrame(columns=[f"Date_{i+1}" for i in range(prediction_days)])  # Colonne pour chaque jour de prédiction

# Remplir les DataFrames avec les prédictions, les valeurs réelles et les dates
for i in range(len(predictions)):
    dates_actuelles = dates_test[i: i + prediction_days]  # Récupérer les dates pour chaque jour de prédiction
    
    # Trouver les indices des dates actuelles dans l'ensemble de données d'origine
    indices_originaux = [df[df['date'] == date].index.tolist() for date in dates_actuelles]
    
    # Vérifier si certaines des dates actuelles sont manquantes dans l'ensemble de données d'origine
    if any(not indices for indices in indices_originaux):
        print(f"Données manquantes pour {dates_actuelles}. Prédiction ignorée pour ces dates.")
        continue
    
    # Ajouter les prédictions, les valeurs réelles et les dates aux DataFrames correspondants
    for j, index_original in enumerate(indices_originaux):
        index_original = index_original[0]  # Prendre le premier indice s'il y en a plusieurs
        predicted_df.loc[i, f"Predicted_Close_{j+1}"] = predictions[i][0][j]  # Récupérer la prédiction à partir du tableau de prédictions
        actual_df.loc[i, f"Actual_Close_{j+1}"] = y_test[i][j]
        date_df.loc[i, f"Date_{j+1}"] = dates_test[i + j]  # Récupérer la date correspondante pour chaque prédiction
    
# Concaténer les DataFrames
result_df = pd.concat([date_df, predicted_df, actual_df], axis=1)

# Sauvegarde au format CSV
chemin_sortie = 'predicted_prices_with_dates_PLUG.csv'
result_df.to_csv(chemin_sortie, index=False)
print(f"Prédictions de prix avec dates sauvegardées sous {chemin_sortie}")


# Fichiers CSV
fichiercs = chemin_sortie

def calculate_metrics(fichiercsv):
    Val_Date = {}
    all_predicted_values = []
    all_actual_values = []

    with open(fichiercsv, newline='') as fichier_csv:
        readCSV = csv.reader(fichier_csv, delimiter=',')
        next(readCSV)

        for ligne in readCSV:
            date = ligne[0]

            # Si la date est déjà dans le dictionnaire
            if date not in Val_Date:
                Val_Date[date] = {'predicted': [], 'actual': []}

            Val_Date[date]['predicted'].append(float(ligne[3]))
            Val_Date[date]['actual'].append(float(ligne[6]))

    # Calculer les erreurs pour chaque date
    dates = []
    rmse_val = []
    for date, valeurs in Val_Date.items():
        predicted_values = np.array(valeurs['predicted'])
        actual_values = np.array(valeurs['actual'])
        mse = mean_squared_error(actual_values, predicted_values)
        rmse = np.sqrt(mse)

        dates.append(date)
        rmse_val.append(rmse)

    # Parcourir toutes les dates dans Val_Date et collecter les valeurs prédites et réelles
    for valeurs in Val_Date.values():
        all_predicted_values.extend(valeurs['predicted'])
        all_actual_values.extend(valeurs['actual'])

    # Convertir les listes en tableaux numpy
    all_predicted_values = np.array(all_predicted_values)
    all_actual_values = np.array(all_actual_values)

    # Calculer le RMSE global
    global_mse = mean_squared_error(all_actual_values, all_predicted_values)
    global_rmse = np.sqrt(global_mse)

    print(f"Fichier : {fichiercsv}")
    print("RMSE global:", global_rmse)

    mape = mean_absolute_percentage_error(all_actual_values, all_predicted_values) * 100
    print("MAPE:", mape, "%")

    # Écrire les dates et les valeurs RMSE dans un fichier CSV
    with open(f'{fichiercsv}_dates_rmse.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Date', 'RMSE'])
        for date, rmse in zip(dates, rmse_val):
            writer.writerow([date, rmse])

    # Tracer les valeurs RMSE par date
    plt.figure(figsize=(10, 6))
    plt.plot(dates, rmse_val, marker='o', linestyle='-')
    plt.title('RMSE par date')
    plt.xlabel('Date')
    plt.ylabel('RMSE')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.grid(True)
    plt.show()


calculate_metrics(fichiercs)
