import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OfertaList = () => {
  const [oferty, setOferty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5024/api/oferta')
      .then(res => {
        setOferty(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania ofert:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>⏳ Ładowanie ofert...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Lista ofert</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Oferta ID</th>
            <th>Pojazd ID</th>
            <th>Kupujący ID</th>
            <th>Kwota</th>
            <th>Status</th>
            <th>Data założenia</th>
          </tr>
        </thead>
        <tbody>
          {oferty.map(oferta => (
            <tr key={oferta.ofertaId}>
              <td>{oferta.ofertaId}</td>
              <td>{oferta.pojazdId}</td>
              <td>{oferta.kupujacyId}</td>
              <td>{oferta.kwota} zł</td>
              <td>{oferta.status}</td>
              <td>{new Date(oferta.dataZalozenia).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfertaList;
