// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const OfertaList = () => {
//   const [oferty, setOferty] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://localhost:5024/api/oferta')
//       .then(res => {
//         setOferty(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Błąd podczas pobierania ofert:', err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>⏳ Ładowanie ofert...</p>;

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>📋 Lista ofert</h2>
//       <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th>Oferta ID</th>
//             <th>Pojazd ID</th>
//             <th>Kupujący ID</th>
//             <th>Kwota</th>
//             <th>Status</th>
//             <th>Data założenia</th>
//           </tr>
//         </thead>
//         <tbody>
//           {oferty.map(oferta => (
//             <tr key={oferta.ofertaId}>
//               <td>{oferta.ofertaId}</td>
//               <td>{oferta.pojazdId}</td>
//               <td>{oferta.kupujacyId}</td>
//               <td>{oferta.kwota} zł</td>
//               <td>{oferta.status}</td>
//               <td>{new Date(oferta.dataZalozenia).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OfertaList;



import React, { useEffect, useState } from "react";
import axios from "../axios";

function OfertaList() {
  const [oferty, setOferty] = useState([]);
  const [pojazdy, setPojazdy] = useState([]);

  useEffect(() => {
    axios.get("/api/oferta")
      .then(res => setOferty(res.data))
      .catch(() => setOferty([]));
    axios.get("/api/pojazd")
      .then(res => setPojazdy(res.data))
      .catch(() => setPojazdy([]));
  }, []);

  const getPojazd = (id) => pojazdy.find(p => p.pojazdId === id);

  return (
    <div className="mt-4">
      <h5>Lista ofert</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>OfertaId</th>
            <th>Pojazd</th>
            <th>KupującyId</th>
            <th>Kwota</th>
            <th>Data Założenia</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {oferty.map(oferta => {
            const pojazd = getPojazd(oferta.pojazdId);
            return (
              <tr key={oferta.ofertaId}>
                <td>{oferta.ofertaId}</td>
                <td>
                  {pojazd
                    ? `${pojazd.marka} ${pojazd.model} (${pojazd.rokProdukcji})`
                    : `ID: ${oferta.pojazdId}`}
                </td>
                <td>{oferta.kupujacyId}</td>
                <td>{oferta.kwota}</td>
                <td>{oferta.dataZalozenia || ""}</td>
                <td>{oferta.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OfertaList;