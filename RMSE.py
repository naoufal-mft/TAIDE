import csv
import numpy as np
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

fichiercsv = "predicted_prices_with_dates.csv"

# Dictionnaire pour stocker les valeurs prédites et réelles par date
Val_Date = {}

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

# Écrire les dates et les valeurs RMSE dans un fichier CSV
with open('dates_rmse.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Date', 'RMSE'])
    for date, rmse in zip(dates, rmse_val):
        writer.writerow([date, rmse])


