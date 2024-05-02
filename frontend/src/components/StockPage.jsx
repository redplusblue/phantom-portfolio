import { useParams } from "react-router-dom";
import Stock from "./Stock";

function StockPage() {
  const { symbol } = useParams();

  return <Stock symbol={symbol} />;
}

export default StockPage;
