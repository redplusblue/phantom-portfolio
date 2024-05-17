import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import { InsertEmoticonOutlined } from "@mui/icons-material";
import StockSearch from "./StockSearch";
import "../styles/Dashboard.css";
import Portfolio from "./Portfolio";
import Balance from "./Balance";
import Transactions from "./Transactions";
import Copyright from "./Copyright";

export default function Dashboard() {
  document.title = "Dashboard";
  const [user, setUser] = useState({
    balance: 0,
    portfolio: [],
    stocklists: [],
  });
  const [value, setValue] = useState(0);
  const [logout, setLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    async function handleLogout() {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: { Authorization: token },
        });
        if (response.ok) {
          // Remove Token
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          // Redirect to login
          window.location.href = "/login";
        } else {
          console.error("Error logging out");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
    if (logout) {
      handleLogout();
    }
    async function fetchUser() {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: { Authorization: token },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            ...data,
            balance: parseFloat(data.balance),
            portfolio: JSON.parse(data.portfolio),
            stocklists: JSON.parse(data.stocklists),
          });
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, [value, logout]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, margin: "0" }}>
        <AppBar
          position="static"
          color="primary"
          elevation={0}
          sx={{
            backgroundColor: "var(--primary-color)",
            padding: "10px",
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item xs>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "var(--text-color)",
                }}
              >
                Dashboard
              </Typography>
            </Grid>
            <Grid item xs>
              <StockSearch />
            </Grid>
            <Grid item xs style={{ textAlign: "right" }}>
              <IconButton
                onClick={handleIconClick}
                sx={{
                  padding: "10px",
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "transparent" },
                  color: "var(--text-color)",
                }}
              >
                <InsertEmoticonOutlined />
                &nbsp; Hi, {user.username}
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    style: {
                      backgroundColor: "var(--primary-color)",
                      color: "var(--text-color)",
                      width: "fit-content",
                      overflow: "hidden",
                      boxShadow: "none",
                      padding: "0px",
                    },
                  },
                }}
              >
                <MenuItem style={{ cursor: "default" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem
                  onClick={() => {
                    setLogout(true);
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </AppBar>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{
            ".MuiTabs-indicator": {
              backgroundColor: "var(--text-color) !important",
            },
            ".MuiTab-root": {
              color: "var(--text-color) !important",
              fontSize: "1.2rem",
            },
            ".Mui-selected": {
              color: "var(--text-color) !important",
            },
          }}
        >
          <Tab label="Portfolio" />
          <Tab label="Balance" />
          <Tab label="Transactions" />
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {value === 0 && <Portfolio portfolio={user.portfolio} />}
        {value === 1 && <Balance balance={user.balance} />}
        {value === 2 && <Transactions />}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Copyright />
      </Box>
    </>
  );
}
