import React, { useState } from "react";
import axios from "../axios";

function DodajPojazd() {
  const [form, setForm] = useState({
    Marka: "",
    Model: "",
    RokProdukcji: "",
    Cena: "",
    Przebieg: "",
    RodzajPaliwa: "",
    SkrzyniaBiegow: "",
    Opis: ""
  });

  function getUserIdFromJWT() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(
        payload["nameid"] ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      );
    } catch {
      return null;
    }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const sprzedajacyId = getUserIdFromJWT();
    if (!sprzedajacyId) {
      alert("Brak zalogowanego użytkownika.");
      return;
    }
    const DataDodania = new Date().toISOString().slice(0, 10);

    try {
      await axios.post("/api/pojazd", {
        SprzedajacyId: sprzedajacyId,
        Marka: form.Marka,
        Model: form.Model,
        RokProdukcji: parseInt(form.RokProdukcji),
        Cena: parseFloat(form.Cena),
        Przebieg: parseInt(form.Przebieg),
        RodzajPaliwa: form.RodzajPaliwa,
        SkrzyniaBiegow: form.SkrzyniaBiegow,
        Opis: form.Opis,
        DataDodania: DataDodania
      });

      alert("Pojazd dodany pomyślnie!");
      setForm({
        Marka: "",
        Model: "",
        RokProdukcji: "",
        Cena: "",
        Przebieg: "",
        RodzajPaliwa: "",
        SkrzyniaBiegow: "",
        Opis: ""
      });
    } catch (err) {
      alert(
        "Błąd:\n" +
          (err.response?.data?.title || "") +
          "\n" +
          JSON.stringify(err.response?.data?.errors || {}, null, 2)
      );
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <h5>Dodaj pojazd</h5>
      <div className="mb-2">
        <label>Marka</label>
        <input
          name="Marka"
          className="form-control"
          value={form.Marka}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Model</label>
        <input
          name="Model"
          className="form-control"
          value={form.Model}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Rok produkcji</label>
        <input
          name="RokProdukcji"
          type="number"
          className="form-control"
          value={form.RokProdukcji}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Cena</label>
        <input
          name="Cena"
          type="number"
          className="form-control"
          value={form.Cena}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Przebieg</label>
        <input
          name="Przebieg"
          type="number"
          className="form-control"
          value={form.Przebieg}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Rodzaj paliwa</label>
        <input
          name="RodzajPaliwa"
          className="form-control"
          value={form.RodzajPaliwa}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Skrzynia biegów</label>
        <input
          name="SkrzyniaBiegow"
          className="form-control"
          value={form.SkrzyniaBiegow}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Opis</label>
        <textarea
          name="Opis"
          className="form-control"
          value={form.Opis}
          onChange={handleChange}
          required
        />
      </div>
      <button className="btn btn-success" type="submit">Dodaj pojazd</button>
    </form>
  );
}

export default DodajPojazd;