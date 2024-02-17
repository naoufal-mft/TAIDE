import requests
import pandas as pd
import numpy as np
from math import floor
from termcolor import colored as cl
import matplotlib.pyplot as plt

plt.rcParams['figure.figsize'] = (20, 10)
plt.style.use('fivethirtyeight')


def get_historical_data(symbol, start_date=None):
    api_key = "4FRYV9E3HHKX8SNR"
    api_url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={symbol}&apikey={api_key}&outputsize=full'
    raw_df = requests.get(api_url).json()
    df = pd.DataFrame(raw_df[f'Time Series (Daily)']).T
    df = df.rename(columns={'1. open': 'open', '2. high': 'high', '3. low': 'low', '4. close': 'close',
                            '5. adjusted close': 'adj close', '6. volume': 'volume'})
    for i in df.columns:
        df[i] = df[i].astype(float)
    df.index = pd.to_datetime(df.index)
    df = df.iloc[::-1].drop(['7. dividend amount', '8. split coefficient'], axis=1)
    if start_date:
        df = df[df.index >= start_date]
    return df


googl = pd.read_csv('donnees_boursieres_TSLA.csv')
googl


def get_macd(price, slow, fast, smooth):
    exp1 = price.ewm(span=fast, adjust=False).mean()
    exp2 = price.ewm(span=slow, adjust=False).mean()
    macd = pd.DataFrame(exp1 - exp2).rename(columns={'close': 'macd'})
    signal = pd.DataFrame(macd.ewm(span=smooth, adjust=False).mean()).rename(columns={'macd': 'signal'})
    hist = pd.DataFrame(macd['macd'] - signal['signal']).rename(columns={0: 'hist'})
    frames = [macd, signal, hist]
    df = pd.concat(frames, join='inner', axis=1)
    return df


googl_macd = get_macd(googl['close'], 26, 12, 9)
googl_macd


def plot_macd(prices, macd, signal, hist):
    ax1 = plt.subplot2grid((8, 1), (0, 0), rowspan=5, colspan=1)
    ax2 = plt.subplot2grid((8, 1), (5, 0), rowspan=3, colspan=1)

    ax1.plot(prices)
    ax2.plot(macd, color='grey', linewidth=1.5, label='MACD')
    ax2.plot(signal, color='skyblue', linewidth=1.5, label='SIGNAL')

    for i in range(len(prices)):
        if str(hist[i])[0] == '-':
            ax2.bar(prices.index[i], hist[i], color='#ef5350')
        else:
            ax2.bar(prices.index[i], hist[i], color='#26a69a')

    plt.legend(loc='lower right')


#plot_macd(googl['close'], googl_macd['macd'], googl_macd['signal'], googl_macd['hist'])


def implement_macd_strategy(prices, data):
    buy_price = []
    sell_price = []
    macd_signal = []
    signal = 0

    for i in range(len(data)):
        if data['macd'][i] > data['signal'][i]:
            if signal != 1:
                buy_price.append(prices[i])
                sell_price.append(np.nan)
                signal = 1
                macd_signal.append(signal)
            else:
                buy_price.append(np.nan)
                sell_price.append(np.nan)
                macd_signal.append(0)
        elif data['macd'][i] < data['signal'][i]:
            if signal != -1:
                buy_price.append(np.nan)
                sell_price.append(prices[i])
                signal = -1
                macd_signal.append(signal)
            else:
                buy_price.append(np.nan)
                sell_price.append(np.nan)
                macd_signal.append(0)
        else:
            buy_price.append(np.nan)
            sell_price.append(np.nan)
            macd_signal.append(0)

    return buy_price, sell_price, macd_signal


buy_price, sell_price, macd_signal = implement_macd_strategy(googl['close'], googl_macd)
googl_temp=googl.copy()
googl_temp['macd_signal']=macd_signal[::-1]
googl_temp.to_csv("aapl_macd", index=False)
ax1 = plt.subplot2grid((8, 1), (0, 0), rowspan=5, colspan=1)
ax2 = plt.subplot2grid((8, 1), (5, 0), rowspan=3, colspan=1)

ax1.plot(googl['close'], color='skyblue', linewidth=2, label='GOOGL')
ax1.plot(googl.index, buy_price, marker='^', color='green', markersize=10, label='BUY SIGNAL', linewidth=0)
ax1.plot(googl.index, sell_price, marker='v', color='r', markersize=10, label='SELL SIGNAL', linewidth=0)
ax1.legend()
ax1.set_title('GOOGL MACD SIGNALS')
ax2.plot(googl_macd['macd'], color='grey', linewidth=1.5, label='MACD')
ax2.plot(googl_macd['signal'], color='skyblue', linewidth=1.5, label='SIGNAL')

for i in range(len(googl_macd)):
    if str(googl_macd['hist'][i])[0] == '-':
        ax2.bar(googl_macd.index[i], googl_macd['hist'][i], color='#ef5350')
    else:
        ax2.bar(googl_macd.index[i], googl_macd['hist'][i], color='#26a69a')

plt.legend(loc='lower right')
plt.show()

position = []


googl_macd["buy"]=buy_price
googl_macd["sell"]=sell_price
googl_macd['merged_signal'] = np.where(~googl_macd['sell'].isna(), 'sell', np.where(~googl_macd['buy'].isna(), 'buy', np.nan))

print(googl_macd)
# Drop the original 'buy' and 'sell' columns if needed
df = googl_macd.drop(['buy', 'sell'], axis=1)

df['merged_signal'] = df['merged_signal'].fillna('no_signal')
df.to_csv('result_MACD.csv')





for i in range(len(macd_signal)):
    if macd_signal[i] > 1:
        position.append(0)
    else:
        position.append(1)

for i in range(len(googl['close'])):
    if macd_signal[i] == 1:
        position[i] = 1
    elif macd_signal[i] == -1:
        position[i] = 0
    else:
        position[i] = position[i - 1]

macd = googl_macd['macd']

signal = googl_macd['signal']
close_price = googl['close']
macd_signal = pd.DataFrame(macd_signal).rename(columns={0: 'macd_signal'}).set_index(googl.index)
position = pd.DataFrame(position).rename(columns={0: 'macd_position'}).set_index(googl.index)

frames = [close_price, macd, signal, macd_signal, position]
strategy = pd.concat(frames, join='inner', axis=1)
strategy

googl_ret = pd.DataFrame(np.diff(googl['close'])).rename(columns={0: 'returns'})
macd_strategy_ret = []
