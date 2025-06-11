// import React, { useState } from 'react';
// import axios from 'axios';

// const DodajOferte = () => {
//   const [formData, setFormData] = useState({
//     pojazdId: '',
//     kupujacyId: '',
//     kwota: '',
//     dataZalozenia: new Date().toISOString().slice(0, 10),
//     status: 'Nowa'
//   });

//   const [status, setStatus] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const dataToSend = {
//         PojazdId: parseInt(formData.pojazdId),
//         KupujacyId: parseInt(formData.kupujacyId),
//         Kwota: parseFloat(formData.kwota.replace(',', '.')), // <- ważne!
//         DataZalozenia: new Date(formData.dataZalozenia).toISOString(), // <- ISO z godziną
//         Status: formData.status
//       };

//       console.log('Wysyłam:', dataToSend);

//       await axios.post('http://localhost:5024/api/oferta', dataToSend);

//       setStatus('✅ Oferta dodana!');
//       setFormData({
//         pojazdId: '',
//         kupujacyId: '',
//         kwota: '',
//         dataZalozenia: new Date().toISOString().slice(0, 10),
//         status: 'Nowa'
//       });
//     } catch (err) {
//       console.error('Błąd:', err.response?.data);
//       const msg =
//         err.response?.data?.title ||
//         JSON.stringify(err.response?.data?.errors) ||
//         '❌ Błąd podczas dodawania oferty';
//       setStatus(msg);
//     }
//   };

//   return (
//     <div>
//       <h2>➕ Dodaj nową ofertę</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="number"
//           name="pojazdId"
//           placeholder="ID pojazdu"
//           value={formData.pojazdId}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="kupujacyId"
//           placeholder="ID kupującego"
//           value={formData.kupujacyId}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="kwota"
//           placeholder="Kwota"
//           value={formData.kwota}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="date"
//           name="dataZalozenia"
//           value={formData.dataZalozenia}
//           onChange={handleChange}
//           required
//         />
//         <select
//           name="status"
//           value={formData.status}
//           onChange={handleChange}
//         >
//           <option value="Nowa">Nowa</option>
//           <option value="Zaakceptowana">Zaakceptowana</option>
//           <option value="Odrzucona">Odrzucona</option>
//         </select>
//         <button type="submit">💾 Dodaj ofertę</button>
//       </form>
//       {status && <p>{status}</p>}
//     </div>
//   );
// };

// export default DodajOferte;




import React, { useState, useEffect } from "react";
import axios from "../axios";

function DodajOferte() {
  const [pojazdy, setPojazdy] = useState([]);
  const [form, setForm] = useState({
    PojazdId: "",
    Kwota: "",
    Status: "aktywny"
  });

  useEffect(() => {
    axios.get("/api/pojazd")
      .then(res => setPojazdy(res.data))
      .catch(() => setPojazdy([]));
  }, []);

  // Wydobądź userId z JWT
  function getUserIdFromJWT() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload["nameid"] || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
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
          {pojazdy.map(p => (
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
      <div className="mb-2">
        <label>Status</label>
        <input
          name="Status"
          className="form-control"
          placeholder="Status"
          value={form.Status}
          onChange={handleChange}
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">Dodaj ofertę</button>
    </form>
  );
}

export default DodajOferte;