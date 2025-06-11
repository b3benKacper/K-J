import React, { useEffect, useState } from "react";
import axios from "../axios";
import KupPojazdButton from "./KupPojazdButton";

function OfertaList() {
  const [oferty, setOferty] = useState([]);
  const [pojazdy, setPojazdy] = useState([]);
  const [filters, setFilters] = useState({
    marka: "",
    model: "",
    rok: "",
    sprzedany: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    axios.get("/api/oferta").then(res => setOferty(res.data)).catch(() => setOferty([]));
    axios.get("/api/pojazd").then(res => setPojazdy(res.data)).catch(() => setPojazdy([]));
  }, []);

  const getPojazd = id => pojazdy.find(p => p.pojazdId === id);

  // Unikalne marki i modele
  const marki = Array.from(new Set(pojazdy.map(p => p.marka))).sort();
  const modele = Array.from(
    new Set(
      pojazdy
        .filter(p => !filters.marka || p.marka === filters.marka)
        .map(p => p.model)
    )
  ).sort();

  // Filtrowanie
  let widoczneOferty = oferty.filter(oferta => {
    const p = getPojazd(oferta.pojazdId);
    if (filters.marka && p?.marka !== filters.marka) return false;
    if (filters.model && p?.model !== filters.model) return false;
    if (filters.rok && (!p || !String(p.rokProdukcji).includes(filters.rok))) return false;
    if (
      filters.sprzedany &&
      (filters.sprzedany === "sprzedany"
        ? oferta.status !== "sprzedany"
        : oferta.status === "sprzedany")
    )
      return false;
    return true;
  });

  // Sortowanie
  if (sortConfig.key != null) {
    widoczneOferty = [...widoczneOferty].sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === "marka" || sortConfig.key === "model" || sortConfig.key === "rokProdukcji") {
        const pa = getPojazd(a.pojazdId) || {};
        const pb = getPojazd(b.pojazdId) || {};
        aValue = pa[sortConfig.key];
        bValue = pb[sortConfig.key];
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  // Sort arrow helper
  const sortArrow = key =>
    sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? " ↑"
        : " ↓"
      : "";

  const handleSort = key => {
    setSortConfig(cur => {
      if (cur.key === key) {
        return { key, direction: cur.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleFilt = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="mt-4">
      <h5>Lista ofert</h5>
      {/* FILTRY */}
      <div className="row mb-3">
        <div className="col">
          <select
            name="marka"
            className="form-control"
            value={filters.marka}
            onChange={e => setFilters({ ...filters, marka: e.target.value, model: "" })}
          >
            <option value="">Filtruj marka</option>
            {marki.map(marka => (
              <option key={marka} value={marka}>{marka}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            name="model"
            className="form-control"
            value={filters.model}
            onChange={handleFilt}
            disabled={!filters.marka}
          >
            <option value="">Filtruj model</option>
            {modele.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            name="rok"
            className="form-control"
            placeholder="Filtruj rocznik"
            value={filters.rok}
            onChange={handleFilt}
          />
        </div>
        <div className="col">
          <select name="sprzedany" className="form-control" value={filters.sprzedany} onChange={handleFilt}>
            <option value="">Wszystkie</option>
            <option value="sprzedany">Sprzedane</option>
            <option value="niesprzedany">Dostępne</option>
          </select>
        </div>
      </div>
      {/* TABELA */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("ofertaId")}>
              L.{sortArrow("ofertaId")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("marka")}>
              Marka{sortArrow("marka")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("model")}>
              Model{sortArrow("model")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("rokProdukcji")}>
              Rocznik{sortArrow("rokProdukcji")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("kwota")}>
              Kwota{sortArrow("kwota")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
              Status{sortArrow("status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {widoczneOferty.map(oferta => {
            const pojazd = getPojazd(oferta.pojazdId);
            return (
              <tr key={oferta.ofertaId}>
                <td>{oferta.ofertaId}</td>
                <td>{pojazd?.marka}</td>
                <td>{pojazd?.model}</td>
                <td>{pojazd?.rokProdukcji}</td>
                <td>{oferta.kwota}</td>
                <td>
                  {oferta.status === "sprzedany" ? (
                    <span className="text-success">sprzedany</span>
                  ) : (
                    pojazd && <KupPojazdButton pojazd={pojazd} oferta={oferta} />
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