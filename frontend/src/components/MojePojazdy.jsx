import React, { useEffect, useState } from "react";
import axios from "../axios";

function MojePojazdy() {
  const [pojazdy, setPojazdy] = useState([]);

  useEffect(() => {
    axios.get("/api/pojazd/moje")
      .then(res => setPojazdy(res.data))
      .catch(() => setPojazdy([]));
  }, []);

  return (
    <div className="mt-4">
      <h5>Moje pojazdy</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Marka</th>
            <th>Model</th>
            <th>Rok</th>
            <th>Cena</th>
            <th>Przebieg</th>
            <th>Opis</th>
          </tr>
        </thead>
        <tbody>
          {pojazdy.map(p => (
            <tr key={p.pojazdId}>
              <td>{p.marka}</td>
              <td>{p.model}</td>
              <td>{p.rokProdukcji}</td>
              <td>{p.cena}</td>
              <td>{p.przebieg}</td>
              <td>{p.opis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MojePojazdy;