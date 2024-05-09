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

function Portfolio({ portfolio }) {
  const [stocks, setStocks] = useState([portfolio]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchStockPrices = async () => {
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
          // Get the latest price from the data
          if (data) {
            const currentPrice = data[data.length - 1].Close.toFixed(2);
            let totalVal = parseFloat(currentPrice * stock.quantity);
            return {
              ...stock,
              currentPrice,
              totalValue: totalVal,
            };
          } else {
            return stock;
          }
        })
      );
      setStocks(updatedStocks);
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
        color="text.secondary"
        sx={{ textAlign: "center", marginTop: "1rem" }}
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
            // backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
          variant="outlined"
        />
        <TableContainer
          component={Paper}
          sx={{
            width: "70%",
            margin: "auto",
          }}
        >
          <Table aria-label="stock portfolio table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--text-color)",
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
                  key={stock.symbol}
                  sx={{
                    backgroundColor:
                      parseFloat(stock.purchasePrice) <=
                      parseFloat(stock.currentPrice)
                        ? "rgba(75, 192, 75, 0.5)"
                        : "rgba(255, 99, 132, 0.5)",
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
                  <TableCell align="center">${stock.purchasePrice}</TableCell>
                  <TableCell align="center">
                    {new Date(stock.purchaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{stock.quantity}</TableCell>
                  <TableCell align="center">${stock.currentPrice}</TableCell>
                  <TableCell align="center">
                    ${(stock.currentPrice * stock.quantity).toFixed(2)}
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
