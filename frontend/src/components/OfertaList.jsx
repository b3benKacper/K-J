import React, { useEffect, useState } from "react";
import axios from "../axios";
import KupPojazdButton from "./KupPojazdButton";

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

  // FILTRUJEMY tylko te, których status NIE JEST "zakupione"
  const widoczneOferty = oferty.filter(oferta => oferta.status !== "zakupione");

  return (
    <div className="mt-4">
      <h5>Lista ofert</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>OfertaId</th>
            <th>Pojazd</th>
            <th>Kwota</th>
            <th>Status</th>
            <th>Kup</th>
          </tr>
        </thead>
        <tbody>
          {widoczneOferty.map(oferta => {
            const pojazd = getPojazd(oferta.pojazdId);
            return (
              <tr key={oferta.ofertaId}>
                <td>{oferta.ofertaId}</td>
                <td>
                  {pojazd
                    ? `${pojazd.marka} ${pojazd.model} (${pojazd.rokProdukcji})`
                    : `ID: ${oferta.pojazdId}`}
                </td>
                <td>{oferta.kwota}</td>
                <td>{oferta.status}</td>
                <td>
                  {pojazd && (
                    <KupPojazdButton pojazd={pojazd} oferta={oferta} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OfertaList;