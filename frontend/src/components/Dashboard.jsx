import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      const response = await fetch("/api/stocks");
      if (response.ok) {
        const data = await response.json();
        setStocks(data);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      {stocks.map((stock, index) => (
        <div key={index}>
          <h3>{stock.symbol}</h3>
          <p>{stock.price}</p>
        </div>
      ))}
    </div>
  );
}
