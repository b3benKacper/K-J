import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import OfertaList from "./components/OfertaList";
import DodajOferte from "./components/DodajOferte";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={authenticated ? <Home setAuthenticated={setAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}


function Home({ setAuthenticated }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <div className="App">
      <h1>🏁 Oferty z komisu</h1>
      <OfertaList />
      <DodajOferte />
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Wyloguj
      </button>
    </div>
  );
}


export default App;
