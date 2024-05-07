import { Card, Typography } from "@mui/material";
import propTypes from "prop-types";

const StockElement = ({ symbol, price }) => {
  return (
    <Card
      sx={{
        backgroundColor: "var(--primary-color)",
        color: "var(--text-color)",
        padding: "10px",
        margin: "10px",
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: "bold",
          color: "var(--text-color)",
        }}
      >
        {symbol}
      </Typography>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: "bold",
          color: "var(--text-color)",
        }}
      >
        {price}
      </Typography>
    </Card>
  );
};
StockElement.propTypes = {
  symbol: propTypes.string.isRequired,
  price: propTypes.number.isRequired,
};

export default StockElement;
