import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to the Trading Simulator</h1>
      <Link to="/login">Login</Link> | <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}
