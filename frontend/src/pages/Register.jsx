import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    imie: "",
    nazwisko: "",
    telefon: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5024/api/auth/register", form);
      alert("Rejestracja zakończona sukcesem!");
      navigate("/login");
    } catch (err) {
      alert("Błąd: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h2 className="text-center mb-4">Rejestracja</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Podaj email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Hasło</label>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Podaj hasło"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Imię</label>
              <input
                name="imie"
                className="form-control"
                placeholder="Wprowadź imię"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Nazwisko</label>
              <input
                name="nazwisko"
                className="form-control"
                placeholder="Wprowadź nazwisko"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
  <label>Telefon</label>
  <input
    name="telefon"
    className="form-control"
    placeholder="Wprowadź numer telefonu"
    onChange={handleChange}
    required
  />
</div>


            <button type="submit" className="btn btn-success w-100">
              Zarejestruj się
            </button>

            <div className="text-center mt-3">
              Masz już konto?{" "}
              <Link to="/login" className="link-primary">
                Zaloguj się
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
