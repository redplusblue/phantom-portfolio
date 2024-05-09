import { useState, useEffect } from "react";
import {
  Button,
  Card,
  TextField,
  Typography,
  Modal,
  Box,
  Alert,
} from "@mui/material";
import propTypes from "prop-types";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
function Balance({ balance }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [curBalance, setCurBalance] = useState(balance);
  const [customInputOpen, setCustomInputOpen] = useState(false);
  const [error, setError] = useState([false, "", "info"]);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCustomInputOpen(false);
  };

  useEffect(() => {
    if (shouldSubmit) {
      submitDeposit();
      setShouldSubmit(false);
    }
    // Can't put submitDeposit function inside useEffect because it is being called outside of the useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, shouldSubmit]);

  const submitDeposit = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token, // Ensure the token is included
    };

    const response = await fetch("/api/deposit", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ amount: parseFloat(amount) }), // Convert amount to float
    });

    const responseData = await response.json();
    if (response.ok) {
      setError([true, responseData.message, "success"]);
      setCurBalance(responseData.balance);
    } else {
      // Handle errors, such as unauthorized access or user not found
      setError([true, responseData.message, "error"]);
      alert(responseData.message);
    }
    handleClose();
  };

  const handlePresetAmount = (presetAmount) => {
    if (presetAmount === "custom") {
      setCustomInputOpen(true);
    } else {
      setAmount(presetAmount);
      setShouldSubmit(true);
    }
  };

  const getBackgroundColor = (balance) => {
    if (balance < 1000) return "#9E0031";
    if (balance >= 1000 && balance < 5000) return "#5FB49C";
    return "#98DFAF";
  };

  return (
    <>
      <Typography
        variant="h4"
        color="text.secondary"
        sx={{ marginBottom: 1, marginTop: 2, textAlign: "center" }}
      >
        <AccountBalanceWalletOutlinedIcon
          sx={{ verticalAlign: "middle", fontSize: "2.5rem" }}
        />
        &nbsp;Your Balance
      </Typography>
      <Card
        sx={{
          maxWidth: 300,
          minHeight: 200,
          margin: "auto",
          alignContent: "center",
          padding: 2,
          textAlign: "center",
          backgroundColor: getBackgroundColor(parseFloat(curBalance)),
          color: "var(--text-color)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: "bold",
            minHeight: "fit-content",
          }}
        >
          {"$ "}
          {parseFloat(curBalance).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            marginTop: 2,
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
          }}
        >
          Add Money
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 300,
              backgroundColor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add to Balance
            </Typography>
            {customInputOpen ? (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="amount"
                  label="Amount"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  onClick={submitDeposit}
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--primary-color)",
                    color: "var(--text-color)",
                  }}
                >
                  Submit
                </Button>
              </>
            ) : (
              <>
                {["500", "1000", "5000", "10000", "25000"].map((value) => (
                  <Button
                    key={value}
                    onClick={() => handlePresetAmount(value)}
                    variant="outlined"
                    sx={{ margin: 1 }}
                  >
                    ${parseFloat(value).toLocaleString()}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePresetAmount("custom")}
                  variant="outlined"
                  sx={{ margin: 1 }}
                >
                  Custom
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </Card>
      {error[0] && (
        <Alert
          severity={error[2]}
          sx={{
            width: "max-content",
            textAlign: "center",
            margin: "auto",
            marginTop: 2,
          }}
        >
          <Typography variant="body2">{error[1]}</Typography>
        </Alert>
      )}
    </>
  );
}
Balance.propTypes = {
  balance: propTypes.string.isRequired,
};

export default Balance;
