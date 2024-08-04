import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Link,
} from "@mui/material";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import propTypes from "prop-types";

// Save Stocks to localStorage
function saveStocks(stocks) {
  // See if localStorage is available
  if (typeof Storage === "undefined") {
    return;
  }
  // Save Stocks to localStorage
  localStorage.setItem("stocks", JSON.stringify(stocks));

  // Save the time of the last save
  localStorage.setItem("lastSave", new Date().toLocaleString());
}

// Returns True if the user has stocks in localStorage and False otherwise
function retriveStocks() {
  // See if localStorage is available
  if (typeof Storage === "undefined") {
    return false;
  }
  // See if there are any stocks in localStorage
  const stocks = localStorage.getItem("stocks");
  if (stocks === null || stocks === undefined || stocks === "[]") {
    return false;
  }
  // See if the last update was more than 5 minutes ago (300000 milliseconds)
  const lastSave = localStorage.getItem("lastSave");
  if (new Date() - new Date(lastSave) > 300000) {
    return false;
  }
  return JSON.parse(stocks);
}

function Portfolio({ portfolio }) {
  const [stocks, setStocks] = useState([portfolio]);
  const [totalValue, setTotalValue] = useState(0);
  useEffect(() => {
    const fetchStockPrices = async () => {
      let savedStocks = retriveStocks();
      if (savedStocks) {
        setStocks(savedStocks);
        let total = 0;
        savedStocks.forEach((stock) => {
          total += stock.totalValue;
        });
        setTotalValue(total);
        return;
      }
      // Map over the portfolio object and fetch current prices
      const updatedStocks = await Promise.all(
        portfolio.map(async (stock) => {
          const response = await fetch(`/api/stock/${stock.symbol}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                localStorage.getItem("token") ||
                sessionStorage.getItem("token"),
            },
          });
          const data = await response.json();
          // if any error occurs
          if (!response.ok || data.error || !data.length) {
            return stock;
          }
          // Get the latest price from the data
          else {
            const currentPrice = data[data.length - 1].Close.toFixed(2);
            let totalVal = parseFloat(currentPrice * stock.quantity);
            return {
              ...stock,
              currentPrice,
              totalValue: totalVal,
            };
          }
        })
      );
      // Sort stocks by purchaseDate in descending order
      updatedStocks.sort(
        (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
      );
      setStocks(updatedStocks);
      saveStocks(updatedStocks);
      let total = 0;
      updatedStocks.forEach((stock) => {
        total += stock.totalValue;
      });
      setTotalValue(total);
    };
    fetchStockPrices();
  }, [portfolio]);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "var(--text-color)",
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        <MonetizationOnOutlinedIcon
          sx={{ fontSize: "2.5rem", verticalAlign: "middle" }}
        />
        Your Portfolio
      </Typography>
      <Box sx={{ textAlign: "center", marginBottom: "1rem" }}>
        <Chip
          label={`Total Value: $${totalValue
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
          sx={{
            marginBottom: "1rem",
            color: "var(--text-color)",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
          variant="outlined"
        />
        <TableContainer
          component={Paper}
          sx={{
            width: "90%",
            margin: "auto",
          }}
        >
          <Table
            aria-label="stock portfolio table"
            sx={{
              overflowX: "auto",
              minWidth: "100%",
              "& th, td": {
                padding: "0.5rem",
                fontSize: "1.2rem",
                backgroundColor: "transparent !important",
              },
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "transparent !important",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "var(--primary-color)",
                  "& th": {
                    color: "var(--text-color) !important",
                    fontSize: "1.2rem",
                  },
                }}
              >
                <TableCell>Symbol</TableCell>
                <TableCell align="center">Purchase Price</TableCell>
                <TableCell align="center">Purchase Date</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Current Price</TableCell>
                <TableCell align="center">Total Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow
                  key={`${stock.symbol}@${stock.purchasePrice}@${stock.purchaseDate}@${stock.quantity}`}
                  sx={{
                    backgroundColor:
                      parseFloat(stock.purchasePrice) <=
                      parseFloat(stock.currentPrice)
                        ? "var(--profit-color)"
                        : "var(--loss-color)",
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: "bold" }}
                  >
                    <Link
                      href={`/stock/${stock.symbol}`}
                      sx={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {stock.symbol}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    $
                    {stock.purchasePrice ? stock.purchasePrice.toFixed(2) : 0.0}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(stock.purchaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{stock.quantity}</TableCell>
                  <TableCell align="center">${stock.currentPrice}</TableCell>
                  <TableCell align="center">
                    $
                    {(stock.currentPrice * stock.quantity)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
Portfolio.propTypes = {
  portfolio: propTypes.arrayOf(
    propTypes.shape({
      symbol: propTypes.string.isRequired,
      purchasePrice: propTypes.number.isRequired,
      purchaseDate: propTypes.string.isRequired,
      quantity: propTypes.number.isRequired,
    })
  ).isRequired,
};

export default Portfolio;