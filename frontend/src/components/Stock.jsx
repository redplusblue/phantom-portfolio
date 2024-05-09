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
import { getCSSVariable } from "../utils/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Stock({ symbol, currentPrice, setError }) {
  const [timeFrame, setTimeFrame] = useState("5d");
  const [stockData, setStockData] = useState([]);

  function errorFromCode(code) {
    let message = "";
    switch (code) {
      case 404:
        message = "Stock symbol not found";
        break;
      case 401:
        message = "Unauthorized access";
        break;
      case 500:
        message = "Internal server error";
        break;
      case 400:
        message = "Bad request";
        break;
      default:
        message = "Unknown error";
        break;
    }
    return message;
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/stock/${symbol}?period=${timeFrame}`, {
        headers: {
          Authorization:
            localStorage.getItem("token") || sessionStorage.getItem("token"),
        },
      });
      if (response.status !== 200) {
        setError([true, errorFromCode(response.status), "error"]);
        return;
      }
      const data = await response.json();
      setStockData(data);
    };
    fetchData();
    // fetchCurrentPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: getCSSVariable("--text-color"),
        },
        grid: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (US $)",
          color: getCSSVariable("--text-color"),
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
    <>
      <div className="container">
        <h1>{symbol.toUpperCase()} - Stock Dashboard</h1>
        <div className="price-info">
          <div className="current-info">
            {currentPrice && (
              <div key={currentPrice.Date} className="info">
                <p>
                  <strong>Date:</strong> {dateTransformer(currentPrice.Date)}
                </p>
                <p>
                  <strong>Open:</strong> ${Number(currentPrice.Open).toFixed(2)}
                </p>
                <p>
                  <strong>Close:</strong> $
                  {Number(currentPrice.Close).toFixed(2)}
                </p>
                <p>
                  <strong>High:</strong> ${Number(currentPrice.High).toFixed(2)}
                </p>
                <p>
                  <strong>Low:</strong> ${Number(currentPrice.Low).toFixed(2)}
                </p>
                <p>
                  <strong>Volume:</strong> {currentPrice.Volume}
                </p>
              </div>
            )}
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
                  style={{
                    outline: timeFrame === period && "1px solid white",
                  }}
                  className="button"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Stock.propTypes = {
  symbol: propTypes.string.isRequired,
  currentPrice: propTypes.object.isRequired,
  setError: propTypes.func.isRequired,
};
