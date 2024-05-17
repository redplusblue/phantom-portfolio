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
      <Link
        color="inherit"
        href="#"
        sx={{
          color: "var(--text-color)",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        Trading Simulator
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
