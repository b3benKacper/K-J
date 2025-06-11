import React, { useState, useEffect } from "react";
import axios from "../axios";

function DodajOferte() {
  const [pojazdy, setPojazdy] = useState([]);
  const [oferty, setOferty] = useState([]);
  const [form, setForm] = useState({
    PojazdId: "",
    Kwota: "",
    Status: "aktywny"
  });

  useEffect(() => {
    // Pobierz wszystkie pojazdy
    axios.get("/api/pojazd")
      .then(res => setPojazdy(res.data))
      .catch(() => setPojazdy([]));
    // Pobierz wszystkie oferty
    axios.get("/api/oferta")
      .then(res => setOferty(res.data))
      .catch(() => setOferty([]));
  }, []);

  // IDs pojazdów, które już mają ofertę ze statusem "aktywny"
  const zajetePojazdyIds = oferty
    .filter(o => o.status === "aktywny" || o.status === "sprzedany")
    .map(o => o.pojazdId);

  // Pokazuj tylko pojazdy, które nie są już w aktywnej ofercie
  const dostepnePojazdy = pojazdy.filter(
    p => !zajetePojazdyIds.includes(p.pojazdId)
  );

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
    const KupujacyId = getUserIdFromJWT();
    if (!KupujacyId) {
      alert("Brak zalogowanego użytkownika.");
      return;
    }
    const DataZalozenia = new Date().toISOString().slice(0, 10);

    try {
      await axios.post(
        "/api/oferta",
        {
          PojazdId: parseInt(form.PojazdId),
          KupujacyId: KupujacyId,
          Kwota: parseFloat(form.Kwota),
          DataZalozenia: DataZalozenia,
          Status: form.Status
        }
      );
      alert("Oferta dodana pomyślnie!");
      setForm({ PojazdId: "", Kwota: "", Status: "aktywny" });
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
      <h5>Dodaj ofertę</h5>
      <div className="mb-2">
        <label>Pojazd</label>
        <select
          name="PojazdId"
          className="form-control"
          value={form.PojazdId}
          onChange={handleChange}
          required
        >
          <option value="">-- wybierz pojazd --</option>
          {dostepnePojazdy.map(p => (
            <option key={p.pojazdId} value={p.pojazdId}>
              {p.marka} {p.model} ({p.rokProdukcji})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label>Kwota</label>
        <input
          name="Kwota"
          type="number"
          className="form-control"
          placeholder="Podaj kwotę"
          value={form.Kwota}
          onChange={handleChange}
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">Dodaj ofertę</button>
    </form>
  );
}

export default DodajOferte;