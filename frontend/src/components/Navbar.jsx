import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ authenticated, setAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    navigate("/"); // <-- przekierowanie na / (lista ofert)
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <span className="navbar-brand">Komis samochodowy</span>
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Lista ofert</Link>
            </li>
            {authenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dodaj-oferte">Dodaj ofertę</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dodaj-pojazd">Dodaj pojazd</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/moje-pojazdy">Moje pojazdy</Link>
                </li>
              </>
            )}
          </ul>
          {authenticated ? (
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Wyloguj
            </button>
          ) : (
            <Link className="btn btn-outline-light" to="/login">
              Zaloguj
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;