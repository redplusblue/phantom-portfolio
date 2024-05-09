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
  IconButton,
  Chip,
  Box,
  Collapse,
  Button,
  Link,
} from "@mui/material";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import propTypes from "prop-types";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("/api/transactions/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            localStorage.getItem("token") || sessionStorage.getItem("token"),
        },
      });
      const data = await response.json();
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(data);
      calculateTotal(data);
    };

    fetchTransactions();
  }, []);

  const calculateTotal = (transactions) => {
    const total = transactions.reduce((acc, transaction) => {
      if (!transaction.reversed) {
        return acc + transaction.price * transaction.quantity;
      }
      return acc;
    }, 0);
    setTotalSpent(total);
  };

  const handleReverse = async (id) => {
    if (window.confirm("Are you sure you want to reverse this transaction?")) {
      const response = await fetch(`/api/transactions/reverse/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            localStorage.getItem("token") || sessionStorage.getItem("token"),
        },
      });
      if (response.ok) {
        setTransactions(
          transactions.map((t) => (t.id === id ? { ...t, reversed: true } : t))
        );
        calculateTotal(
          transactions.map((t) => (t.id === id ? { ...t, reversed: true } : t))
        );
      }
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        color="text.secondary"
        sx={{ textAlign: "center", marginTop: "1rem" }}
      >
        <LibraryBooksOutlinedIcon
          sx={{ fontSize: "2.5rem", verticalAlign: "middle" }}
        />
        Your Transactions
      </Typography>
      <Box sx={{ textAlign: "center", marginBottom: "1rem" }}>
        <Chip
          label={`Total Spent: $${totalSpent
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
          sx={{
            marginBottom: "1rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "var(--text-color)",
          }}
          variant="outlined"
        />
      </Box>
      <TableContainer component={Paper} sx={{ width: "70%", margin: "auto" }}>
        <Table aria-label="transactions table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color)",
              }}
            >
              <TableCell>Date</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .filter((t) => !t.reversed)
              .map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell component="th" scope="row">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <Link
                      href={`/stock/${transaction.symbol}`}
                      sx={{
                        color: "var(--primary-color)",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {transaction.symbol}
                    </Link>
                  </TableCell>
                  <TableCell align="center">{transaction.quantity}</TableCell>
                  <TableCell align="center">
                    ${transaction.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    ${(transaction.quantity * transaction.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleReverse(transaction.id)}
                      color="error"
                    >
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ textAlign: "center", margin: "1rem" }}>
        <Button
          onClick={() => setOpen(!open)}
          sx={{
            margin: "auto",
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
          }}
        >
          <ExpandMoreIcon /> Show Reversed Transactions
        </Button>
      </Box>
      <Collapse in={open}>
        <TableContainer component={Paper} sx={{ width: "70%", margin: "auto" }}>
          <Table aria-label="reversed transactions table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--text-color)",
                }}
              >
                <TableCell>Date</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .filter((t) => t.reversed)
                .map((transaction) => (
                  <TableRow key={transaction.id} sx={{ opacity: 0.4 }}>
                    <TableCell component="th" scope="row">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.symbol}</TableCell>
                    <TableCell align="center">{transaction.quantity}</TableCell>
                    <TableCell align="center">
                      ${transaction.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      ${(transaction.quantity * transaction.price).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">Reversed</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </>
  );
}

Transactions.propTypes = {
  transactions: propTypes.array,
};

export default Transactions;
