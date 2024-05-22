import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import "../styles/Home.css";
import { Alert } from "@mui/material";
import Welcome from "./Welcome";

document.title = "Home";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState([false, ""]);

  useEffect(() => {
    // Validate token when the component mounts
    const validateToken = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await fetch("/api/token/validate", {
          method: "POST",
          headers: { Authorization: token },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setError([true, "Session expired, please log in again"]);
          // Remove Token
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setTimeout(() => {
            setError([false, ""]);
          }, 1500);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setError([true, "Error validating token [Server Error]"]);
        setTimeout(() => {
          setError([false, ""]);
        }, 15000);
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
        <>
          {error[0] && (
            <Alert
              severity="error"
              sx={{
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color)",
              }}
            >
              {error[1]}
            </Alert>
          )}
          <Welcome />
        </>
      )}
    </>
  );
}
