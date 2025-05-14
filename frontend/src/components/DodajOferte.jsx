import React, { useState } from 'react';
import axios from 'axios';

const DodajOferte = () => {
  const [formData, setFormData] = useState({
    pojazdId: '',
    kupujacyId: '',
    kwota: '',
    dataZalozenia: new Date().toISOString().slice(0, 10), // tylko data yyyy-mm-dd
    status: 'Nowa'
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/oferta', {
        ...formData,
        kwota: parseFloat(formData.kwota), // konwersja na decimal
      });
      setStatus('✅ Oferta dodana!');
      setFormData({
        pojazdId: '',
        kupujacyId: '',
        kwota: '',
        dataZalozenia: new Date().toISOString().slice(0, 10),
        status: 'Nowa'
      });
    } catch (err) {
      console.error(err);
      setStatus('❌ Błąd podczas dodawania oferty');
    }
  };

  return (
    <div>
      <h2>➕ Dodaj nową ofertę</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="pojazdId" placeholder="ID pojazdu" value={formData.pojazdId} onChange={handleChange} required />
        <input type="number" name="kupujacyId" placeholder="ID kupującego" value={formData.kupujacyId} onChange={handleChange} required />
        <input type="number" name="kwota" placeholder="Kwota" value={formData.kwota} onChange={handleChange} required />
        <input type="date" name="dataZalozenia" value={formData.dataZalozenia} onChange={handleChange} required />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Nowa">Nowa</option>
          <option value="Zaakceptowana">Zaakceptowana</option>
          <option value="Odrzucona">Odrzucona</option>
        </select>
        <button type="submit">💾 Dodaj ofertę</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default DodajOferte;
