import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import "../styles/Home.css";
import { Alert } from "@mui/material";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState([false, ""]);
  const navigate = useNavigate();

  useEffect(() => {
    // Validate token when the component mounts
    const validateToken = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/token/validate", {
          method: "POST",
          headers: { Authorization: token },
        });
        if (response.ok) {
          setIsLoggedIn(true);
          navigate("/dashboard");
        } else {
          setIsLoggedIn(false);
          sessionStorage.removeItem("token");
          setError([true, "Session expired, please log in again"]);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setError([true, "Error validating token [Server Error]"]);
      }
    };
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to the Trading Simulator</h1>
      {isLoggedIn ? <Link to="/dashboard">Dashboard</Link> : <Login />}
      <Link to="/register">Register</Link>
      {error[0] && <Alert severity="error">{error[1]}</Alert>}
    </div>
  );
}
