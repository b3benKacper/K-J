import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OfertaList = () => {
  const [oferty, setOferty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/oferta')
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
    <div>
      <h2>📋 Lista ofert</h2>
      <ul>
        {oferty.map(oferta => (
          <li key={oferta.ofertaId}>
            🚗 <strong>{oferta.tytul}</strong> - {oferta.cena} zł
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfertaList;
