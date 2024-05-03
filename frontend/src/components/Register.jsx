import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Alert } from "@mui/material";
import "../styles/Register.css";
import { Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  // Set Document Title
  document.title = "Register";

  const handleRegister = async () => {
    // Don't send request if any field is empty
    if (!username || !email || !password) {
      setShowMsg(true);
      setErrorMsg("Please fill out all fields");
      return;
    }
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (response.ok) {
      // Registration successful, redirect to home page
      setShowMsg(false);
      setSuccessMsg("Registration successful, redirecting to login page...");
      setTimeout(() => {
        navigate("/");
      }, 3500);
    } else {
      // Registration failed, show error message
      setShowMsg(true);
      setErrorMsg("Registration failed, please try again");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {successMsg ? (
        <Alert severity="success" style={{ marginTop: 10 }}>
          {successMsg}
        </Alert>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
          {showMsg && (
            <Alert severity="error" style={{ marginTop: 10 }}>
              {errorMsg || "An error occurred"}
            </Alert>
          )}
        </Box>
      )}
      <Link to="/">Login instead</Link>
    </div>
  );
}
