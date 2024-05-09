import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Grid, Alert } from "@mui/material";
import Stock from "./Stock";

function StockPage() {
  const { symbol } = useParams();
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

    fetchCurrentPrice();
  }, [navigate, symbol]); // Removed quantity from dependencies to avoid unnecessary re-fetches

  const handleBuy = async () => {
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
      alert("Transaction successful");
    } else {
      const data = await response.json();
      setError([true, data.error, "error"]);
    }
  };

  const handlePresetQuantity = (presetQuantity) => {
    setQuantity(presetQuantity);
    setTotalPrice(currentPrice.Close * presetQuantity);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          margin: "auto",
          height: "100%",
        }}
      >
        <Grid item xs={12} md={6}>
          {error[0] && <Alert severity={error[2]}>{error[1]}</Alert>}
          <Stock
            symbol={symbol}
            currentPrice={currentPrice}
            setError={setError}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Buy {symbol}
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
            variant="outlined"
          />
          <Typography sx={{ mt: 2, mb: 2 }}>
            Total Price: ${isNaN(totalPrice) ? "0.00" : totalPrice.toFixed(2)}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["1", "5", "10", "20", "25", "50", "100", "500"].map((qty) => (
              <Button
                key={qty}
                variant="outlined"
                onClick={() => handlePresetQuantity(qty)}
                sx={{
                  color: "var(--text-color)",
                  borderColor: "var(--text-color)",
                  "&:hover": {
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                  },
                }}
              >
                {qty} Shares
              </Button>
            ))}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleBuy}>
              Buy
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default StockPage;
