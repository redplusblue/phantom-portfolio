import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Alert,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

export default function Login() {
  document.title = "Login";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // State to handle remember me checkbox
  const [alertMsg, setAlertMsg] = useState([false, "", "error"]); // Display, Message, Severity
  const navigate = useNavigate();

  // Check if user is already logged in
  try {
    if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
      navigate("/");
    }
  } catch (error) {
    console.error("Error checking user login:", error);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // If empty, dont send request
    if (!username || !password) {
      setAlertMsg([true, "Please fill out all fields", "info"]);
      return;
    }
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });
      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        if (remember) {
          localStorage.setItem("token", token); // Store in localStorage if remember is true
        } else {
          sessionStorage.setItem("token", token); // Store in sessionStorage otherwise
        }
        setAlertMsg([true, "Login successful, redirecting...", "success"]);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setAlertMsg([true, "Invalid username or password", "error"]);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setAlertMsg([true, "Error logging in [Server Error]", "error"]);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100%",
        }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            backgroundColor: "var(--bg-color) !important",
            color: "var(--text-color) !important",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h4">
              Welcome to the Trading Simulator
            </Typography>
            <br />
            <Avatar sx={{ m: 1, bgcolor: "var(--primary-color)" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  color: "var(--text-color)",
                  "& .MuiInputBase-input": {
                    color: "var(--text-color)",
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--text-color)",
                  },
                  // Label on focus
                  "& .MuiInputLabel-outlined": {
                    color: "var(--text-color)",
                  },
                  "& .MuiInputLabel-outlined.Mui-focused": {
                    color: "var(--text-color)",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "var(--text-color)",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "var(--text-color)",
                  },
                  // Border
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
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  color: "var(--text-color)",
                  "& .MuiInputBase-input": {
                    color: "var(--text-color)",
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--text-color)",
                  },
                  // Label on focus
                  "& .MuiInputLabel-outlined": {
                    color: "var(--text-color)",
                  },
                  "& .MuiInputLabel-outlined.Mui-focused": {
                    color: "var(--text-color)",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "var(--text-color)",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "var(--text-color)",
                  },
                  // Border
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
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    sx={{
                      color: "var(--text-color)",
                      "&.Mui-checked": {
                        color: "var(--text-color)",
                      },
                    }}
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "var(--primary-color)",
                  color: "var(--text-color)",
                  "&:hover": {
                    backgroundColor: "var(--primary-color)",
                  },
                }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid
                  item
                  xs
                  sx={{
                    color: "var(--text-color)",
                    "& a": {
                      color: "var(--text-color)",
                    },
                  }}
                >
                  <Link to="/login">Forgot password?</Link>
                </Grid>
                <Grid
                  item
                  sx={{
                    color: "var(--text-color)",
                    "& a": {
                      color: "var(--text-color)",
                    },
                  }}
                >
                  <Link to="/register">{"Don't have an account? Sign Up"}</Link>
                </Grid>
              </Grid>
            </Box>
            <br />
            {alertMsg[0] && (
              <Alert
                severity={alertMsg[2]}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--text-color)",
                }}
              >
                {alertMsg[1]}
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
