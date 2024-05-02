import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import propTypes from "prop-types";
import "../styles/Stock.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Stock({ symbol }) {
  const [timeFrame, setTimeFrame] = useState("5d");
  const [stockData, setStockData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      const response = await fetch(`/api/stock/${symbol}?period=1d`);
      const data = await response.json();
      setCurrentPrice(data);
    };
    const fetchData = async () => {
      const response = await fetch(`/api/stock/${symbol}?period=${timeFrame}`);
      const data = await response.json();
      setStockData(data);
    };
    fetchData();
    fetchCurrentPrice();
  }, [timeFrame, symbol]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Stock Price History",
        color: "white",
      },
      decimation: {
        enabled: true,
        algorithm: "lttb",
        threshold: 1000,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "white",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (US $)",
          color: "white",
        },
        grid: {
          display: true,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Slightly curvy lines
        borderWidth: 2,
      },
    },
    maintainAspectRatio: false,
  };

  const dateTransformer = (timeFrame) => {
    // Converts "Fri 02 Feb 2024 05:00:00 GMT" to "02 Feb '24"
    return timeFrame
      .split(" ")
      .slice(1, 4)
      .join(" ")
      .replace(/\d{2}(\d{2})/, "'$1");
  };

  // Check if the stock price has increased or decreased
  let isGain =
    stockData.length > 0 &&
    stockData[0].Close <= stockData[stockData.length - 1].Close;

  const data = {
    labels: stockData.map((item) => dateTransformer(item.Date)),
    datasets: [
      {
        pointStyle: "triangle",
        label: `${symbol.toUpperCase()} Price (US $)`,
        data: stockData.map((item) => item.Close),
        borderColor: isGain ? "rgb(75, 192, 75)" : "rgb(255, 99, 132)",
        backgroundColor: isGain
          ? "rgba(75, 192, 75, 0.5)"
          : "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="container">
      <h1>{symbol.toUpperCase()} - Stock Dashboard</h1>
      <div className="price-info">
        <div className="current-info">
          {currentPrice.length > 0 &&
            currentPrice.map((item) => (
              <div key={item.Date} className="info">
                <p>
                  <strong>Date:</strong> {dateTransformer(item.Date)}
                </p>
                <p>
                  <strong>Open:</strong> ${Number(item.Open).toFixed(2)}
                </p>
                <p>
                  <strong>Close:</strong> ${Number(item.Close).toFixed(2)}
                </p>
                <p>
                  <strong>High:</strong> ${Number(item.High).toFixed(2)}
                </p>
                <p>
                  <strong>Low:</strong> ${Number(item.Low).toFixed(2)}
                </p>
                <p>
                  <strong>Volume:</strong>{" "}
                  {item.Volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              </div>
            ))}
        </div>
        <div className="chart-container">
          <Line options={options} data={data} />
          <div className="buttons-container">
            {[
              "5d",
              "1mo",
              "3mo",
              "6mo",
              "ytd",
              "1y",
              "2y",
              "5y",
              "10y",
              "max",
            ].map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period)}
                style={{ outline: timeFrame === period && "1px solid white" }}
                className="button"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Stock.propTypes = {
  symbol: propTypes.string.isRequired,
};
