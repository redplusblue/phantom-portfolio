import StockSearch from "./StockSearch";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-search">
        <StockSearch />
      </div>
    </div>
  );
}
