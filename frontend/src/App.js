import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OfertaList from "./components/OfertaList";
import DodajOferte from "./components/DodajOferte";
import DodajPojazd from "./components/DodajPojazd";
import MojePojazdy from "./components/MojePojazdy";
import WszystkiePojazdy from "./components/WszystkiePojazdy";
import AdminPanel from "./components/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));
  const [rola, setRola] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRola(
          payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
          payload["role"] ||
          payload["rola"] ||
          ""
        );
      } catch {}
    } else {
      setRola("");
    }

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [authenticated]);

  return (
    <Router>
      <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} rola={rola} />
      <Routes>
        <Route path="/" element={<OfertaList />} />
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
        <Route
          path="/wszystkie-pojazdy"
          element={authenticated && rola === "ADMIN" ? <WszystkiePojazdy /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={authenticated && rola === "ADMIN" ? <AdminPanel /> : <Navigate to="/" />}
        />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;