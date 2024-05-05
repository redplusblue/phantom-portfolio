import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
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
        if (
          !localStorage.getItem("token") &&
          !sessionStorage.getItem("token")
        ) {
          setError([true, "No token found, please log in"]);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }

        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await fetch("/api/token/validate", {
          method: "POST",
          headers: { Authorization: token },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setError([true, "Session expired, please log in again"]);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setError([true, "Error validating token [Server Error]"]);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    };
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <div className="home-container">
          <h1>Redirecting...</h1>
          {error[0] && <Alert severity="error">{error[1]}</Alert>}
        </div>
      )}
    </>
  );
}
