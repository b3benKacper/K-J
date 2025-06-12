import React, { useState, useEffect } from "react";
import axios from "../axios";

function DodajOferte() {
  const [pojazdy, setPojazdy] = useState([]);
  const [oferty, setOferty] = useState([]);
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    PojazdId: "",
    Kwota: "",
    Status: "aktywny"
  });

  useEffect(() => {
    // Pobierz userId z JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(
          parseInt(
            payload["nameid"] ||
              payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
          )
        );
      } catch (e) {}
    }
    axios.get("/api/pojazd")
      .then(res => setPojazdy(res.data))
      .catch(() => setPojazdy([]));
    axios.get("/api/oferta")
      .then(res => setOferty(res.data))
      .catch(() => setOferty([]));
  }, []);

  // IDs pojazdów z aktywną ofertą lub już "sprzedany"
  const zajetePojazdyIds = oferty
    .filter(o => o.status === "aktywny" || o.status === "sprzedany")
    .map(o => o.pojazdId);

  // Tylko moje pojazdy, do których nie mam już aktywnej/sprzedanej oferty
  const mojeDostepnePojazdy = pojazdy
    .filter(
      p => userId && p.sprzedajacyId === userId && !zajetePojazdyIds.includes(p.pojazdId)
    );

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!userId) {
      alert("Brak zalogowanego użytkownika.");
      return;
    }
    const DataZalozenia = new Date().toISOString().slice(0, 10);

    try {
      await axios.post(
        "/api/oferta",
        {
          PojazdId: parseInt(form.PojazdId),
          KupujacyId: userId,
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
          {mojeDostepnePojazdy.map(p => (
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