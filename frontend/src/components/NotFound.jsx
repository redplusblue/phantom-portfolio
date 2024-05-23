import { Typography, Button, Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import NotFoundIllustration from "../assets/NotFoundIllustration.svg";

const NotFound = () => {
  return (
    <Container>
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        style={{ marginTop: "50px" }}
      >
        <Grid item xs={12} sm={6}>
          <img
            src={NotFoundIllustration}
            alt="404 Illustration"
            style={{ maxWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h1">404</Typography>
          <Typography variant="h5">
            Oops! This page doesn&apos;t exist.
          </Typography>
          <Typography variant="body1">
            The page you are looking for might have been removed or moved to
            another location.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            style={{
              marginTop: "20px",
              backgroundColor: "var(--primary-color)",
              color: "var(--text-color)",
            }}
          >
            Go Home
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;
