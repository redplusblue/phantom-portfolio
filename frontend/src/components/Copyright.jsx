import { Typography, Link } from "@mui/material";

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="var(--text-color)"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Trading Simulator
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
