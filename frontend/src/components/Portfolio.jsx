import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import propTypes from "prop-types";

function Portfolio({ portfolio }) {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      // Map over the portfolio object and fetch current prices
      const updatedStocks = await Promise.all(
        portfolio.map(async (stock) => {
          const response = await fetch(
            `https://api.stockprice.com/current?symbol=${stock.symbol}`
          );
          const data = await response.json();
          const currentPrice = data.price; // Assuming API returns { price: number }
          return {
            ...stock,
            currentPrice,
            totalValue: currentPrice * stock.quantity,
          };
        })
      );
      setStocks(updatedStocks);
    };

    fetchStockPrices();
  }, [portfolio]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "var(--primary-color)",
        color: "var(--text-color)",
      }}
    >
      <Table aria-label="stock portfolio table">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Purchase Price</TableCell>
            <TableCell align="right">Purchase Date</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Total Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell component="th" scope="row">
                {stock.symbol}
              </TableCell>
              <TableCell align="right">
                {stock.purchasePrice.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {new Date(stock.purchaseDate).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">{stock.quantity}</TableCell>
              <TableCell align="right">
                {stock.currentPrice.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {(stock.currentPrice * stock.quantity).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
