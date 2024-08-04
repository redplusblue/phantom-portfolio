# Phantom Portfolio: Stock Market Sandbox Platform

![Preview Video](preview/phantom-portfolio.gif)
![Phantom Portfolio](preview/stockpage.png)

Phantom Portfolio is a comprehensive stock trading simulation platform designed to provide users with a realistic and engaging experience in stock market trading without the risks associated with real money.

## 🌟 Features

- **Multi-tabbed Dashboard**: A user-friendly interface built with React.js and MaterialUI, offering an intuitive navigation experience.
- **Live Stock Search**: Real-time stock search functionality with autocomplete feature.
- **Interactive Charts**: Visualize stock performance with interactive charts powered by Chart.js.
- **Portfolio Management**: Track your simulated investments, including current value and performance metrics.
- **Transaction History**: View and manage your trading history, with the ability to reverse transactions.
- **Balance Management**: Add virtual funds to your account to expand your trading capabilities.
- **Dual-level JWT Authentication**: Ensures secure access to user accounts and data.
- **Real-time NYSE Data**: Access to up-to-date stock information for informed decision-making.

## 🛠️ Tech Stack

### Frontend

- HTML5, CSS3, JavaScript (ES6+)
- React.js
- MaterialUI (MUI)
- Chart.js
- React Router

### Backend

- Python
- Flask (with CORS and Caching)
- SQLAlchemy
- Redis
- YFinance API (with BeautifulSoup4)

### Development Environment

- Ubuntu 20.04 LTS (WSL)
- Vite (Frontend build tool)
- Flask (Backend server)

## 🏗️ Architecture

Phantom Portfolio follows a decoupled architecture:

1. **Frontend**: A single-page application (SPA) built with React.js, offering a responsive and interactive user interface.
2. **Backend**: A RESTful API developed with Flask, handling data processing, authentication, and external API interactions.
3. **Database**: SQLAlchemy ORM for structured data storage, with models for Users and Transactions.
4. **Caching**: Redis for efficient token management and improved performance.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Redis server

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/redplusblue/phantom-portfolio.git
   cd phantom-portfolio
   ```

2. Set up the frontend:

   ```
   cd frontend
   npm install
   ```

3. Set up the backend:

   ```
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

4. Start Redis server:

   ```
   redis-server backend/redis.conf
   ```

5. Run the application:
   - Compile Frontend: `npm run build`
   - Backend: `flask run`

Visit `http://localhost:5000` to access the application (5000 is the default port, but it can vary based on your configuration, so check the Flask console output).

## 📊 Performance

- Supports over 10,000 active users concurrently (tested with Locust.io)
- 40% improvement in data retrieval times (compared to direct API calls)
- 20% reduction in login and transaction-related issues (with Redis caching)

## 🛣️ Roadmap

- [ ] Implement REST API for external integrations
- [ ] Develop a simulated timeframe trading environment
- [ ] Create a trading bot utilizing the REST API
- [ ] Introduce portfolio analytics API for tracking progress over time

## 📜 License

This project is licensed under the GNU GPL v3.0 License - see the [LICENSE](LICENSE) file for details.

**Important**: This project uses the [YFinance API](https://pypi.org/project/yfinance/), which employs web scraping to obtain data from Yahoo Finance. This method is not officially endorsed by Yahoo and may have limitations:

- Data may not always be 100% reliable or up-to-date.
- Usage may conflict with Yahoo Finance's terms of service.
- There may be ethical and legal considerations regarding web scraping.

**Disclaimer**: The creator of Phantom Portfolio is not affiliated with, endorsed by, or in any way officially connected to YFinance API or Yahoo Finance. The creator does not take responsibility for any potential wrongdoing or liabilities that YFinance API may be subject to.

This project is for educational and personal use only. Users should review Yahoo Finance's terms of service and consider official data sources for commercial applications. By using Phantom Portfolio, you accept these limitations and potential risks.

## 📞 Contact

For any queries or suggestions, please reach out at contact@samirkabra.com.

---

Phantom Portfolio - Empowering traders with risk-free learning and strategy testing.
