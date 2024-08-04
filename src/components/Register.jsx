import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import {
  Avatar,
  Alert,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "./Copyright";

const defaultTheme = createTheme();

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState([false, "", "error"]);
  const navigate = useNavigate();

  const handleRegister = async () => {
    document.title = "Register";
    // Disable default form submission
    event.preventDefault();
    // Don't send request if any field is empty
    if (!username || !email || !password) {
      setMsg([true, "Please fill out all fields", "info"]);
      return;
    }
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (response.ok) {
      // Registration successful, redirect to login page
      setMsg([true, "Registration successful, redirecting...", "success"]);
      setTimeout(() => {
        navigate("/phantom-portfolio/");
      }, 3500);
    } else {
      // Registration failed, show error message
      setMsg([true, "Registration failed, please try again", "error"]);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://picsum.photos/1280/720?grayscale)",
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
              Welcome to the PhantomPortfolio
            </Typography>
            <br />
            <Typography component="p">
              Where Your Ghostly Investments Materialize
            </Typography>
            <br />
            <Avatar sx={{ m: 1, bgcolor: "var(--primary-color)" }}>
              <PersonAddAltOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleRegister}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Choose Your Ghostly Username"
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
                id="email"
                label="Enter Your Haunting Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                label="Create Your Secret Ghostly Password"
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
                Summon Your Account
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
                  <Link to="/login">Already Haunting? Sign In Here</Link>
                </Grid>
              </Grid>
            </Box>
            {msg[0] && (
              <Alert
                severity={msg[2]}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--text-color)",
                }}
              >
                {msg[1]}
              </Alert>
            )}
          </Box>
          <Copyright />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
