import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login({ setAuthenticated }) {    
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5024/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setAuthenticated(true);
      navigate("/"); // <-- teraz to na pewno zadziała
    } catch (err) {
      alert("Błąd logowania: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Logowanie</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Wprowadź email"
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
                placeholder="Wprowadź hasło"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Zaloguj się
            </button>

            <div className="text-center mt-3">
              Nie masz konta?{" "}
              <Link to="/register" className="link-primary">
                Zarejestruj się
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
