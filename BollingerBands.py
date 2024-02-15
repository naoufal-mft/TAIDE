import pandas as pd
import matplotlib.pyplot as plt
import requests
import math
from termcolor import colored as cl
import numpy as np
from alpha_vantage.timeseries import TimeSeries
plt.style.use('fivethirtyeight')
plt.rcParams['figure.figsize'] = (20, 10)


def get_historic_data(symbol):
    ticker = symbol
    key = "4FRYV9E3HHKX8SNR"
    ts = TimeSeries(key, output_format='pandas',)
    #data, meta = ts.get_intraday(symbol,interval='60min',outputsize='full')
    data, meta = ts.get_daily(symbol,outputsize='full')
    columns = ['Open', 'High', 'Low', 'close', 'Volume']
    data.columns = columns
    df = data.reset_index()
    return df

def sma(data, window):
    sma = data.rolling(window = window,min_periods=1).mean()
    return sma



#tsla = get_historic_data('SPY')
#tsla = tsla.set_index('date')
#tsla = tsla[tsla.index >= '2022-01-01']
#tsla.to_csv('spy.csv')

tsla = pd.read_csv('donnees_boursieres_TSLA.csv').set_index('date')
tsla.index = pd.to_datetime(tsla.index)

#tsla.tail()

tsla['sma_20'] = sma(tsla['close'], 20)

tsla.to_csv('spyy.csv')
print(tsla)
def bb(data, sma, window):
    std = data.rolling(window = window,min_periods=1).std()
    upper_bb = sma + std * 2
    lower_bb = sma - std * 2
    return upper_bb, lower_bb

tsla['upper_bb'], tsla['lower_bb'] = bb(tsla['close'], tsla['sma_20'], 20)



def implement_bb_strategy(data, lower_bb, upper_bb):
    buy_price = []
    sell_price = []
    bb_signal = []
    signal = 0

    for i in range(len(data)):
        if data[i - 1] > lower_bb[i - 1] and data[i] < lower_bb[i]:
            if signal != 1:
                buy_price.append(data[i])
                sell_price.append(np.nan)
                signal = 1
                bb_signal.append(signal)
            else:
                buy_price.append(np.nan)
                sell_price.append(np.nan)
                bb_signal.append(0)
        elif data[i - 1] < upper_bb[i - 1] and data[i] > upper_bb[i]:
            if signal != -1:
                buy_price.append(np.nan)
                sell_price.append(data[i])
                signal = -1
                bb_signal.append(signal)
            else:
                buy_price.append(np.nan)
                sell_price.append(np.nan)
                bb_signal.append(0)
        else:
            buy_price.append(np.nan)
            sell_price.append(np.nan)
            bb_signal.append(0)

    return buy_price, sell_price, bb_signal
buy_price, sell_price, bb_signal = implement_bb_strategy(tsla['close'], tsla['lower_bb'], tsla['upper_bb'])


tsla['close'].plot(label = 'CLOSE PRICES', alpha = 0.3)
tsla['upper_bb'].plot(label = 'UPPER BB', linestyle = '--', linewidth = 1, color = 'black')
tsla['sma_20'].plot(label = 'MIDDLE BB', linestyle = '--', linewidth = 1.2, color = 'grey')
tsla['lower_bb'].plot(label = 'LOWER BB', linestyle = '--', linewidth = 1, color = 'black')
plt.scatter(tsla.index, buy_price, marker = '^', color = 'green', label = 'BUY', s = 200)
plt.scatter(tsla.index, sell_price, marker = 'v', color = 'red', label = 'SELL', s = 200)
plt.title('TSLA BB STRATEGY TRADING SIGNALS')
plt.legend(loc = 'upper left')
plt.show()

position = []
for i in range(len(bb_signal)):
    if bb_signal[i] > 1:
        position.append(0)
    else:
        position.append(1)

for i in range(len(tsla['close'])):
    if bb_signal[i] == 1:
        position[i] = 1
    elif bb_signal[i] == -1:
        position[i] = 0
    else:
        position[i] = position[i - 1]

upper_bb = tsla['upper_bb']
lower_bb = tsla['lower_bb']
close_price = tsla['close']
bb_signal = pd.DataFrame(bb_signal).rename(columns={0: 'bb_signal'}).set_index(tsla.index)
position = pd.DataFrame(position).rename(columns={0: 'bb_position'}).set_index(tsla.index)

frames = [close_price, upper_bb, lower_bb, bb_signal, position]
strategy = pd.concat(frames, join='inner', axis=1)
strategy = strategy.reset_index().drop('date', axis=1)
strategy

