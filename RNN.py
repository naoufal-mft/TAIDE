# -*- coding: utf-8 -*-
"""
Created on Wed Oct 11 15:08:06 2023

@author: Kaoutar
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# Load data
df = pd.read_csv('AAPL.csv')

# Rename columns
df = df.rename(columns={'timestamp': 'Timestamp', 'open': 'Open', 'high': 'High', 'low': 'Low', 'close': 'Close', 'volume': 'Volume'})

print(df.columns)

# Reverse the DataFrame

df = df.iloc[::-1].reset_index(drop=True)

# Scaling
features = df[['Open', 'High', 'Low', 'Close', 'Volume']]
scaler = MinMaxScaler()
features_scaled = scaler.fit_transform(features)

# Sequence length
sequence_length = 3
prediction_days = 3

# Sequences, labels, and dates
sequences = []
labels = []
dates = []

for i in range(len(features_scaled) - sequence_length - prediction_days):
    sequence = features_scaled[i : i + sequence_length]
    sequences.append(sequence)

    label_sequence = df['Close'].iloc[i + sequence_length : i + sequence_length + prediction_days].values
    labels.append(label_sequence)

    dates.append(df['date'].iloc[i + sequence_length + prediction_days - 1])

# Convert to numpy arrays
sequences = np.array(sequences)
labels = np.array(labels)

# Split data
X_train, X_test, y_train, y_test, dates_train, dates_test = train_test_split(sequences, labels, dates, test_size=0.2, shuffle=False)

# Extracting training data containing only date and close columns
# Extracting training data containing only date and close columns
training_data = pd.DataFrame({'date': dates_train, 'closingPrice': [label[0] for label in y_train]})

# Save to CSV
output_path = 'training_data.csv'
training_data.to_csv(output_path, index=False)

print(f"Training data with date and close columns saved to {output_path}")
# RNN model
model = Sequential([
    LSTM(units=128, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
    Dropout(0.2),
    LSTM(units=64),
    Dense(units=prediction_days)
])

# Compile
model.compile(loss='mean_squared_error', optimizer='adam')

# Early stopping callback
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# Train
history = model.fit(X_train, y_train, epochs=3000, batch_size=32, validation_split=0.2, callbacks=[early_stopping], verbose=1)

# Evaluate
test_loss = model.evaluate(X_test, y_test)
print(f"Test Loss: {test_loss}")

# Predictions
# Predictions
predictions = []

# Include all previous predictions as training data for each new prediction
for i in range(len(X_test)):
    # Add the latest sequence and its corresponding labels to the training data
    X_train = np.append(X_train, [X_test[i]], axis=0)
    y_train = np.append(y_train, [y_test[i]], axis=0)
    
    # Train the model with the updated training data
    history = model.fit(X_train, y_train, epochs=3000, batch_size=32, validation_split=0.2, callbacks=[early_stopping], verbose=0)
    
    # Make predictions for the current sequence
    current_prediction = model.predict(np.array([X_test[i]]))
    predictions.append(current_prediction)

# Convert predictions to numpy array
predictions = np.array(predictions)

# Create DataFrame to store predictions, actual values, and dates for each day
predicted_df = pd.DataFrame(columns=[f"Predicted_Close_{i+1}" for i in range(prediction_days)])
actual_df = pd.DataFrame(columns=[f"Actual_Close_{i+1}" for i in range(prediction_days)])
date_df = pd.DataFrame(columns=[f"Date_{i+1}" for i in range(prediction_days)])  # Column for each prediction day

# Populate the DataFrames with predictions, actual values, and dates
for i in range(len(predictions)):
    current_dates = dates_test[i : i + prediction_days]  # Fetch dates for each prediction day
    
    # Find the indices of the current dates in the original dataset
    original_indices = [df[df['date'] == date].index.tolist() for date in current_dates]
    
    # Check if any of the current dates are missing in the original dataset
    if any(not indices for indices in original_indices):
        print(f"Missing data for {current_dates}. Skipping prediction for these dates.")
        continue
    
    # Append predictions, actual values, and dates to the corresponding DataFrames
    for j, original_index in enumerate(original_indices):
        original_index = original_index[0]  # Take the first index if there are multiple
        predicted_df.loc[i, f"Predicted_Close_{j+1}"] = predictions[i][0][j]  # Fetch prediction from the predictions array
        actual_df.loc[i, f"Actual_Close_{j+1}"] = y_test[i][j]
        date_df.loc[i, f"Date_{j+1}"] = dates_test[i + j]  # Fetch the corresponding date for each prediction
    
# Concatenate the DataFrames
result_df = pd.concat([date_df, predicted_df, actual_df], axis=1)

# Save to CSV
output_path = 'predicted_prices_with_dates11.csv'
result_df.to_csv(output_path, index=False)

print(f"Predicted prices with dates saved to {output_path}")
