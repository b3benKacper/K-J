import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OfertaList from "./components/OfertaList";
import DodajOferte from "./components/DodajOferte";
import DodajPojazd from "./components/DodajPojazd";
import MojePojazdy from "./components/MojePojazdy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
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
      <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} />
      <Routes>
        {/* ZAWSZE dostępne: */}
        <Route path="/" element={<OfertaList />} />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* DLA ZALOGOWANYCH: */}
        <Route
          path="/dodaj-oferte"
          element={authenticated ? <DodajOferte /> : <Navigate to="/login" />}
        />
        <Route
          path="/dodaj-pojazd"
          element={authenticated ? <DodajPojazd /> : <Navigate to="/login" />}
        />
        <Route
          path="/moje-pojazdy"
          element={authenticated ? <MojePojazdy /> : <Navigate to="/login" />}
        />

        {/* Domyślne przekierowanie */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;