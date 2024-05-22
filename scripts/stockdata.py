import yfinance as yf # type: ignore

def fetch_stock_data(symbol, interval='1d', period='5d'):
    """
    Fetches stock data using yfinance.

    Args:
        symbol (str): The ticker symbol for the stock.
        interval (str): Data interval (e.g., "1m", "5m", "1h", "1d").
        period (str): Data period (e.g., "1d", "5d", "1mo", "1y", "max").

    Returns:
        dict: A dictionary containing the fetched stock data.
    """
    stock = yf.Ticker(symbol)
    data = stock.history(period=period, interval=interval)

    if data.empty:
        return {'error': 'No data available'}

    # 'data' is the DataFrame
    data_with_date = data.reset_index()

    # Convert DataFrame to dictionary with date included
    data_dict = data_with_date.to_dict(orient='records')
    
    return data_dict

# Check if the purchase is valid
def is_valid_price(symbol, price, quantity):
    # If Symbol is invalid
    try:
        data = yf.Ticker(symbol).info
    except:
        return "Invalid symbol"
    # If price isnt valid
    if price < 0 or quantity < 0:
        return "Price and quantity must be greater than 0"
    current_price = data['currentPrice']
    print(current_price, round(price, 2), current_price != round(price, 2))
    if float(current_price) != float(round(price, 2)):
        return "Price is invalid"
    # If quantity is greater than the available quantity
    if quantity > data['volume']:
        return "Insufficient quantity available"
    
    # All checks passed
    return "OK"