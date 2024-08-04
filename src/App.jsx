import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import StockPage from "./components/StockPage";
import NotFound from "./components/NotFound";
import Test from "./components/Test";
import "./styles/Base.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/phantom-portfolio" element={<Home />} />
        <Route path="/phantom-portfolio/login" element={<Login />} />
        <Route path="/phantom-portfolio/register" element={<Register />} />
        <Route
          path="/phantom-portfolio/stock/:symbol"
          element={<StockPage />}
        />
      </Routes>
    </Router>
  );
}
export default App;
