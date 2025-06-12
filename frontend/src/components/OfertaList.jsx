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
    sprzedany: "",
    paliwo: "",
    skrzynia: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);

  const [userId, setUserId] = useState(null);
  const [rola, setRola] = useState("");
  const [editOferta, setEditOferta] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
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
        setRola(
          payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            payload["role"] ||
            payload["rola"] ||
            ""
        );
      } catch (e) {}
    }
    axios.get("/api/oferta").then(res => setOferty(res.data)).catch(() => setOferty([]));
    axios.get("/api/pojazd").then(res => setPojazdy(res.data)).catch(() => setPojazdy([]));
  }, []);

  const getPojazd = id => pojazdy.find(p => p.pojazdId === id);

  // Filtrowanie - Zbiory wartości do selectów
  const marki = Array.from(new Set(pojazdy.map(p => p.marka))).sort();
  const modele = Array.from(
    new Set(
      pojazdy.filter(p => !filters.marka || p.marka === filters.marka)
             .map(p => p.model)
    )
  ).sort();
  const rodzajePaliwa = Array.from(new Set(pojazdy.map(p => p.rodzajPaliwa).filter(Boolean))).sort();
  const skrzynieBiegow = Array.from(new Set(pojazdy.map(p => p.skrzyniaBiegow).filter(Boolean))).sort();

  // OFERTY PO FILTRZE
  let widoczneOferty = oferty.filter(oferta => {
    const p = getPojazd(oferta.pojazdId);
    if (filters.marka && p?.marka !== filters.marka) return false;
    if (filters.model && p?.model !== filters.model) return false;
    if (filters.rok && (!p || !String(p.rokProdukcji).includes(filters.rok))) return false;
    if (filters.paliwo && (!p || p.rodzajPaliwa !== filters.paliwo)) return false;
    if (filters.skrzynia && (!p || p.skrzyniaBiegow !== filters.skrzynia)) return false;
    if (
      filters.sprzedany === "sprzedany" && (!oferta.status || oferta.status !== "sprzedany")
    )
      return false;
    if (
      filters.sprzedany === "aktywny" && (!oferta.status || oferta.status !== "aktywny")
    )
      return false;
    return true;
  });

  // Sortowanie (jak było)
  const sortStatus = status => status === "aktywny" ? 0 : 1;
  const widoczneOfertyPosortowane = [...widoczneOferty].sort((a, b) => {
    const priA = sortStatus(a.status);
    const priB = sortStatus(b.status);
    if (priA !== priB) return priA - priB;
    if (sortConfig.key !== null) {
      let aValue, bValue;
      if (sortConfig.key === "marka-model") {
        const pa = getPojazd(a.pojazdId) || {};
        const pb = getPojazd(b.pojazdId) || {};
        aValue = `${pa.marka || ""} ${pa.model || ""}`;
        bValue = `${pb.marka || ""} ${pb.model || ""}`;
      } else if (
        sortConfig.key === "marka" ||
        sortConfig.key === "model" ||
        sortConfig.key === "rokProdukcji"
      ) {
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
    }
    return 0;
  });

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

  const handleEdit = oferta => {
    setEditOferta(oferta);
    setEditForm({ ...oferta });
  };

  const handleDelete = async ofertaId => {
    if (window.confirm("Czy na pewno chcesz usunąć tę ofertę?")) {
      try {
        await axios.delete(`/api/oferta/${ofertaId}`);
        setOferty(prev => prev.filter(o => o.ofertaId !== ofertaId));
        alert("Oferta została usunięta.");
        setEditOferta(null);
      } catch (err) {
        alert("Błąd przy usuwaniu oferty: " + (err.response?.data?.title || err.message));
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/oferta/${editOferta.ofertaId}`, editForm);
      setOferty(prev =>
        prev.map(o =>
          o.ofertaId === editOferta.ofertaId ? { ...editOferta, ...editForm } : o
        )
      );
      setEditOferta(null);
      alert("Oferta zaktualizowana!");
    } catch (err) {
      alert("Błąd edycji oferty: " + (err.response?.data?.title || err.message));
    }
  };

  return (
    <div className="mt-4">
      <h5>Lista ofert</h5>
      {/* FILTRY */}
      <div className="mb-3 row">
        <div className="col-md-2">
          <label className="form-label">Marka</label>
          <select name="marka" className="form-select" value={filters.marka} onChange={handleFilt}>
            <option value="">-- dowolna --</option>
            {marki.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Model</label>
          <select name="model" className="form-select" value={filters.model} onChange={handleFilt}>
            <option value="">-- dowolny --</option>
            {modele.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Rok</label>
          <input
            name="rok"
            className="form-control"
            placeholder="np. 2015"
            value={filters.rok}
            onChange={handleFilt}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Paliwo</label>
          <select name="paliwo" className="form-select" value={filters.paliwo} onChange={handleFilt}>
            <option value="">-- dowolne --</option>
            {rodzajePaliwa.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Skrzynia</label>
          <select name="skrzynia" className="form-select" value={filters.skrzynia} onChange={handleFilt}>
            <option value="">-- dowolna --</option>
            {skrzynieBiegow.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Status</label>
          <select name="sprzedany" className="form-select" value={filters.sprzedany} onChange={handleFilt}>
            <option value="">-- dowolny --</option>
            <option value="aktywny">Aktywny</option>
            <option value="sprzedany">Sprzedany</option>
          </select>
        </div>
      </div>
      {/* TABELA OFERT */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("marka-model")}>
                Samochód {sortArrow("marka-model")}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("rokProdukcji")}>
                Rocznik{sortArrow("rokProdukcji")}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("kwota")}>
                <div style={{ fontSize: "0.85em", color: "#666" }}>Cena</div>
                {sortArrow("kwota")}
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                Status{sortArrow("status")}
              </th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {widoczneOfertyPosortowane.map(oferta => {
              const pojazd = getPojazd(oferta.pojazdId);
              return (
                <tr
                  key={oferta.ofertaId}
                  onClick={() => {
                    setShowModal(true);
                    setCurrentCar({ oferta, pojazd });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    {pojazd ? `${pojazd.marka} ${pojazd.model}` : ""}
                  </td>
                  <td>{pojazd?.rokProdukcji}</td>
                  <td>{oferta.kwota}</td>
                  <td>
                    {oferta.status === "sprzedany" ? (
                      <span className="text-success">sprzedany</span>
                    ) : (
                      pojazd && <KupPojazdButton pojazd={pojazd} oferta={oferta} />
                    )}
                  </td>
                  <td>
                    {userId &&
                      oferta.status !== "sprzedany" &&
                      (rola === "ADMIN" ||
                        (pojazd && pojazd.sprzedajacyId === userId)) && (
                        <>
                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(oferta.ofertaId);
                            }}
                          >
                            Usuń
                          </button>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={e => {
                              e.stopPropagation();
                              handleEdit(oferta);
                            }}
                          >
                            Edytuj
                          </button>
                        </>
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* MODALE */}
      {showModal && currentCar && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)"
          }}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Szczegóły samochodu {currentCar.pojazd?.marka} {currentCar.pojazd?.model}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  <li className="list-group-item"><b>Marka:</b> {currentCar.pojazd?.marka}</li>
                  <li className="list-group-item"><b>Model:</b> {currentCar.pojazd?.model}</li>
                  <li className="list-group-item"><b>Rok produkcji:</b> {currentCar.pojazd?.rokProdukcji}</li>
                  <li className="list-group-item"><b>Przebieg:</b> {currentCar.pojazd?.przebieg}</li>
                  <li className="list-group-item"><b>Rodzaj paliwa:</b> {currentCar.pojazd?.rodzajPaliwa}</li>
                  <li className="list-group-item"><b>Skrzynia biegów:</b> {currentCar.pojazd?.skrzyniaBiegow}</li>
                  <li className="list-group-item"><b>Opis:</b> {currentCar.pojazd?.opis}</li>
                  <li className="list-group-item"><b>Status oferty:</b> {currentCar.oferta?.status}</li>
                  <li className="list-group-item"><b>Cena oferty:</b> {currentCar.oferta?.kwota}</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editOferta && (
        <div className="modal fade show" style={{
          display: "block",
          background: "rgba(0,0,0,0.5)"
        }}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edytuj ofertę {getPojazd(editOferta.pojazdId)
                    ? `${getPojazd(editOferta.pojazdId).marka} ${getPojazd(editOferta.pojazdId).model}`
                    : ""}
                </h5>
                <button className="btn-close" onClick={() => setEditOferta(null)} />
              </div>
              <div className="modal-body">
                <label className="form-label">Cena</label>
                <input
                  className="form-control mb-2"
                  value={editForm.kwota || ""}
                  onChange={e => setEditForm(f => ({ ...f, kwota: e.target.value }))}
                  placeholder="Kwota"
                  type="number"
                />
                <input
                  className="form-control mb-2"
                  value={editForm.status || ""}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  placeholder="Status"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditOferta(null)}>
                  Anuluj
                </button>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfertaList;