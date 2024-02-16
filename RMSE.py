import csv
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error

fichiercsv = "predicted_prices_with_dates.csv"

# dictionnaire pour stocker les valeurs prédites et réelles par date
Val_Date = {}

with open(fichiercsv, newline='') as fichier_csv:
    readCSV = csv.reader(fichier_csv, delimiter=',')
    next(readCSV)

    for ligne in readCSV:
        date = ligne[0]

        # si la date est déjà dans le dictionnaire
        if date not in Val_Date:
            Val_Date[date] = {'predicted': [], 'actual': []}

        Val_Date[date]['predicted'].append(float(ligne[3]))
        Val_Date[date]['actual'].append(float(ligne[6]))

# Calculer les error pour chaque date
error = []
rmse_global = 0.0

for date, valeurs in Val_Date.items():
    predicted_values = np.array(valeurs['predicted'])
    actual_values = np.array(valeurs['actual'])

    mse = mean_squared_error(actual_values, predicted_values)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(actual_values, predicted_values)

    error.append({'date': date, 'predicted': predicted_values, 'actual': actual_values, 'rmse': rmse, 'mae': mae})
    rmse_global += rmse


for erreur in error:
    print(f"Date: {erreur['date']}")
    print(f"Predicted: {erreur['predicted']}")
    print(f"Actual: {erreur['actual']}")
    print(f"RMSE: {erreur['rmse']}")
    print(f"MAE: {erreur['mae']}")
    print()

# Calculer le RMSE global
rmse_global /= len(error)
print(f"RMSE global (moyenne): {rmse_global}")