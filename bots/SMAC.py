import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt

def fetch_data(symbol, start_date, end_date):
    """
    Fetch historical stock data from Yahoo Finance.
    """
    data = yf.download(symbol, start=start_date, end=end_date)
    return data['Close']

def calculate_moving_averages(data, short_window=2, long_window=5):
    """
    Calculate short-term and long-term moving averages.
    Shorter windows for intra-week analysis to spot more immediate trends.
    """
    sma_short = data.rolling(window=short_window, min_periods=1).mean()
    sma_long = data.rolling(window=long_window, min_periods=1).mean()
    return sma_short, sma_long

def identify_crossovers(data, sma_short, sma_long):
    """
    Identify crossover points where the short-term SMA crosses the long-term SMA.
    """
    buy_signals = (sma_short > sma_long) & (sma_short.shift(1) <= sma_long.shift(1))
    sell_signals = (sma_short < sma_long) & (sma_short.shift(1) >= sma_long.shift(1))
    return buy_signals, sell_signals

def print_signals(data, buy_signals, sell_signals):
    """
    Print the details of buy and sell signals in a tabular format.
    This provides clear actionable information directly in the console.
    """
    signals = pd.DataFrame(index=data.index)
    signals['Price'] = data
    signals['Buy Signal'] = buy_signals
    signals['Sell Signal'] = sell_signals
    print("\nSignal Details:")
    print(signals[signals['Buy Signal'] | signals['Sell Signal']])

def plot_data(data, sma_short, sma_long, buy_signals, sell_signals):
    """
    Plot stock prices, SMAs, and buy/sell signals for visualization.
    """
    plt.figure(figsize=(10, 5))
    plt.plot(data.index, data, label='Stock Price', alpha=0.5)
    plt.plot(data.index, sma_short, label='2-day SMA')
    plt.plot(data.index, sma_long, label='5-day SMA')
    plt.scatter(data.index[buy_signals], data[buy_signals], label='Buy Signal', marker='^', color='green', s=50)
    plt.scatter(data.index[sell_signals], data[sell_signals], label='Sell Signal', marker='v', color='red', s=50)
    plt.title('Weekly Stock Price and Moving Averages')
    plt.legend()
    plt.show()

def run(symbol, start_date='2023-04-10', end_date='2023-04-17', short_window=2, long_window=5):
    """
    Run the analysis for the specified symbol over a fixed one-week period.
    Modify the dates as needed for different weeks.
    """
    print(f"Analyzing stock: {symbol}")
    data = fetch_data(symbol, start_date, end_date)
    sma_short, sma_long = calculate_moving_averages(data, short_window, long_window)
    buy_signals, sell_signals = identify_crossovers(data, sma_short, sma_long)
    print_signals(data, buy_signals, sell_signals)
    plot_data(data, sma_short, sma_long, buy_signals, sell_signals)
    
def main():
    while True:
        symbol = input("Enter a stock symbol (e.g., AAPL): ")
        start_date = input("Enter the start date (YYYY-MM-DD): ")
        end_date = input("Enter the end date (YYYY-MM-DD): ")
        short_window = int(input("Enter the short-term window (e.g., 2): "))
        long_window = int(input("Enter the long-term window (e.g., 5): "))
        run(symbol, start_date, end_date, short_window, long_window)
        choice = input("Do you want to analyze another stock? (y/n): ")
        if choice.lower() != 'y':
            break

if __name__ == '__main__':
    main()
