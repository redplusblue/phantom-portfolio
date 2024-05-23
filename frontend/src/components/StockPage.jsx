import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Alert, Chip } from "@mui/material";
import Stock from "./Stock";
import Copyright from "./Copyright";
import { ArrowBackIosOutlined } from "@mui/icons-material";

function StockPage() {
  const { symbol } = useParams();
  document.title = `$${symbol.toUpperCase()} - Stock Page`;
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState({
    Date: "",
    Open: 0.0,
    High: 0.0,
    Low: 0.0,
    Close: 0.0,
  });
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [balance, setBalance] = useState(0.0);
  const [error, setError] = useState([false, "", "error"]);

  useEffect(() => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      console.error("User not logged in");
      navigate("/login");
    }
    const fetchCurrentPrice = async () => {
      const response = await fetch(`/api/stock/${symbol}?period=1d`, {
        headers: {
          Authorization:
            localStorage.getItem("token") || sessionStorage.getItem("token"),
        },
      });
      if (response.status !== 200) {
        setError([true, "Error fetching stock data", "error"]);
        return;
      }
      const data = await response.json();
      setCurrentPrice(data[0]); // Assuming the API returns an array with at least one object
    };

    const fetchUserBalance = async () => {
      const response = await fetch("/api/balance", {
        headers: {
          Authorization:
            localStorage.getItem("token") || sessionStorage.getItem("token"),
        },
      });
      if (response.status !== 200) {
        setError([true, "Error fetching user balance", "error"]);
        return;
      }
      const data = await response.json();
      setBalance(data.balance);
    };

    fetchCurrentPrice();
    fetchUserBalance();
  }, [navigate, symbol, balance]); // Removed quantity from dependencies to avoid unnecessary re-fetches

  const handleBuy = async () => {
    try {
      const response = await fetch("/api/transactions/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            localStorage.getItem("token") || sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          symbol: symbol,
          price: currentPrice.Close,
          quantity: parseInt(quantity, 10),
        }),
      });
      if (response.ok) {
        setError([true, "Transaction successful", "success"]);
        setQuantity(0);
        setTotalPrice(0.0);
        setBalance(0.0);
      } else {
        const data = await response.json();
        setError([true, data.error, "error"]);
      }
    } catch (error) {
      setError([true, "Error buying stock [SERVER ERROR]", "error"]);
    }
  };

  const handlePresetQuantity = (presetQuantity) => {
    setQuantity(presetQuantity);
    setTotalPrice(currentPrice.Close * presetQuantity);
  };

  const dateTransformer = (timeFrame) => {
    // Converts "Fri 02 Feb 2024 05:00:00 GMT" to "02 Feb '24"
    return timeFrame
      .split(" ")
      .slice(1, 4)
      .join(" ")
      .replace(/\d{2}(\d{2})/, "'$1");
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: "var(--primary-color)",
          border: "none",
          color: "var(--text-color)",
          fontSize: "1.2rem",
          position: "absolute",
          top: "10px",
          left: "10px",
          "&:hover": {
            backgroundColor: "var(--primary-color)",
            border: "none",
            transform: "rotate(-3deg)",
          },
          transition: "transform 0.5s",
        }}
      >
        <ArrowBackIosOutlined sx={{ fontSize: "1.1rem", marginRight: "5px" }} />
        Back to Dashboard
      </Button>
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          fontFamily: "Jaini Purwa",
          margin: "0px",
          padding: "0px",
        }}
      >
        {symbol.toUpperCase()} - Stock Page
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "max-content",
          width: "100%",
          // Align to top
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1, alignSelf: "flex-start" }}>
          <Stock symbol={symbol} setError={setError} />
        </Box>
        <Box
          sx={{
            flex: 1,
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "30px",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          {error[0] && (
            <Alert
              severity={error[2]}
              sx={{
                width: "max-content",
                textAlign: "center",
                margin: "auto",
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color)",
              }}
            >
              {error[1]}
            </Alert>
          )}
          <Box className="current-info">
            {currentPrice && (
              <Box key={currentPrice.Date} className="info">
                <Typography component="p">
                  <strong>Date:</strong> {dateTransformer(currentPrice.Date)}
                </Typography>
                <Typography component="p">
                  <strong>Open:</strong> ${Number(currentPrice.Open).toFixed(2)}
                </Typography>
                <Typography component="p">
                  <strong>Close:</strong> $
                  {Number(currentPrice.Close).toFixed(2)}
                </Typography>
                <Typography component="p">
                  <strong>High:</strong> ${Number(currentPrice.High).toFixed(2)}
                </Typography>
                <Typography component="p">
                  <strong>Low:</strong> ${Number(currentPrice.Low).toFixed(2)}
                </Typography>
                <Typography component="p">
                  <strong>Volume:</strong>{" "}
                  {String(currentPrice.Volume)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    .replace(".00", "")}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Buy ${symbol}
            </Typography>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                // Ensure currentPrice.Close is a number before calculating
                if (!isNaN(currentPrice.Close)) {
                  setTotalPrice(currentPrice.Close * e.target.value);
                }
              }}
              sx={{
                color: "var(--text-color)",
                backgroundColor: "var(--bg-color)",
                width: "200px",
                // Border Color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--text-color)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--text-color)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--text-color)",
                  },
                },
                "& input": {
                  textAlign: "center",
                  color: "var(--text-color)",
                  fontSize: "1.2rem",
                  padding: "10px",
                },
                "& label": {
                  color: "var(--text-color)",
                  // Change color of label when focused
                  "&.Mui-focused": {
                    color: "var(--text-color)",
                  },
                },
              }}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chip
              sx={{
                color:
                  totalPrice > balance
                    ? "var(--loss-color)"
                    : "var(--text-color)",
                backgroundColor: "var(--primary-color)",
                fontSize: "1.5rem",
              }}
              label={`Total Price: $${
                isNaN(totalPrice)
                  ? "0.00"
                  : totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }`}
            />
            <Chip
              sx={{
                color: "var(--profit-color)",
                backgroundColor: "var(--primary-color)",
                fontSize: "1.5rem",
              }}
              label={`Your Balance: $${
                isNaN(balance)
                  ? "0.00"
                  : balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }`}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {["1", "5", "10", "20", "25", "50", "100", "500", "1000"].map(
              (qty) => (
                <Button
                  key={qty}
                  variant="outlined"
                  onClick={() => handlePresetQuantity(qty)}
                  sx={{
                    color: "var(--text-color)",
                    borderColor: "var(--text-color)",
                    fontSize: "1.2rem",
                    "&:hover": {
                      backgroundColor: "var(--primary-color)",
                      color: "var(--text-color)",
                      borderColor: "var(--text-color)",
                    },
                  }}
                >
                  {qty} Shares
                </Button>
              )
            )}
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={handleBuy}
              sx={{
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color)",
                fontSize: "1.5rem",
                "&:hover": {
                  backgroundColor: "var(--primary-color)",
                },
              }}
            >
              Buy
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginTop: "50px" }}>
        <Copyright />
      </Box>
    </>
  );
}

export default StockPage;
