import React, { useEffect, useState } from "react";
import axios from "../axios";

function MojePojazdy() {
  const [pojazdy, setPojazdy] = useState([]);
  const [transakcje, setTransakcje] = useState([]);
  const [oferty, setOferty] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editPojazd, setEditPojazd] = useState(null);
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
      } catch (e) {}
    }
    axios.get("/api/pojazd/moje")
      .then(res => setPojazdy(res.data))
      .catch(() => setPojazdy([]));
    axios.get("/api/transakcja")
      .then(res => setTransakcje(res.data))
      .catch(() => setTransakcje([]));
    axios.get("/api/oferta")
      .then(res => setOferty(res.data))
      .catch(() => setOferty([]));
  }, []);

  // Pomocnicze
  const maAktywnaOferte = (pojazdId) => {
    return oferty.some(o => o.pojazdId === pojazdId && o.status === "aktywny");
  };

  const jestSprzedany = (pojazdId) => {
    return transakcje.some(t => t.pojazdId === pojazdId);
  };

  // Rodzaj własności (posiadane -> sprzedawane -> sprzedane -> kupione)
  const rodzajWlasnosci = (p) => {
    if (userId === null) return "";
    if (p.sprzedajacyId === userId) {
      if (jestSprzedany(p.pojazdId)) return "sprzedane";
      if (maAktywnaOferte(p.pojazdId)) return "sprzedawane";
      return "posiadane";
    }
    return "kupione";
  };

  // Sortowanie: "posiadane" -> "sprzedawane" -> "sprzedane" -> "kupione"
  const sortRodzaj = { "posiadane": 0, "kupione": 1, "sprzedawane": 2, "sprzedane": 3 };
  const pojazdyPosortowane = [...pojazdy].sort((a, b) => {
    const rA = sortRodzaj[rodzajWlasnosci(a)] ?? 99;
    const rB = sortRodzaj[rodzajWlasnosci(b)] ?? 99;
    return rA - rB;
  });

  // Edycja
  const handleDelete = async (pojazdId) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten pojazd?")) {
      try {
        await axios.delete(`/api/pojazd/${pojazdId}`);
        setPojazdy(prev => prev.filter(p => p.pojazdId !== pojazdId));
        alert("Pojazd został usunięty.");
        setEditPojazd(null);
      } catch (err) {
        alert("Błąd przy usuwaniu pojazdu: " + (err.response?.data?.title || err.message));
      }
    }
  };

  const handleEdit = (pojazd) => {
    setEditPojazd(pojazd);
    setEditForm({ ...pojazd });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/pojazd/${editPojazd.pojazdId}`, editForm);
      setPojazdy(prev =>
        prev.map(p =>
          p.pojazdId === editPojazd.pojazdId ? { ...editPojazd, ...editForm } : p
        )
      );
      setEditPojazd(null);
      alert("Pojazd zaktualizowany!");
    } catch (err) {
      alert("Błąd edycji pojazdu: " + (err.response?.data?.title || err.message));
    }
  };

  // Listy opcji do selecta (opcjonalnie do edycji)
  const paliwa = ["LPG", "Benzyna", "Benzyna + LPG", "Diesel", "CNG", "Hybryda", "Elektryczny", "Inne"];
  const skrzynie = ["Manualna", "Pół automatyczna", "Automatyczna", "Inna"];

  return (
    <div className="mt-4">
      <h5>Moje pojazdy (posiadane, sprzedawane, sprzedane, kupione)</h5>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>PojazdId</th>
              <th>Marka</th>
              <th>Model</th>
              <th>Rocznik</th>
              <th>Cena</th>
              <th>Przebieg</th>
              <th>Rodzaj własności</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {pojazdyPosortowane.map(p => (
              <tr key={p.pojazdId}>
                <td>{p.pojazdId}</td>
                <td>{p.marka}</td>
                <td>{p.model}</td>
                <td>{p.rokProdukcji}</td>
                <td>{p.cena}</td>
                <td>{p.przebieg}</td>
                <td>{rodzajWlasnosci(p)}</td>
                <td>
                  {rodzajWlasnosci(p) === "posiadane" && (
                    <>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDelete(p.pojazdId)}
                      >
                        Usuń
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(p)}
                      >
                        Edytuj
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* MODAL EDYCJI */}
      {editPojazd && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edytuj pojazd #{editPojazd.pojazdId}</h5>
                <button className="btn-close" onClick={() => setEditPojazd(null)} />
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editForm.marka || ""}
                  onChange={e => setEditForm(f => ({ ...f, marka: e.target.value }))}
                  placeholder="Marka"
                />
                <input
                  className="form-control mb-2"
                  value={editForm.model || ""}
                  onChange={e => setEditForm(f => ({ ...f, model: e.target.value }))}
                  placeholder="Model"
                />
                <input
                  className="form-control mb-2"
                  value={editForm.rokProdukcji || ""}
                  onChange={e => setEditForm(f => ({ ...f, rokProdukcji: e.target.value }))}
                  placeholder="Rok produkcji"
                  type="number"
                />
                <input
                  className="form-control mb-2"
                  value={editForm.cena || ""}
                  onChange={e => setEditForm(f => ({ ...f, cena: e.target.value }))}
                  placeholder="Cena"
                  type="number"
                />
                <input
                  className="form-control mb-2"
                  value={editForm.przebieg || ""}
                  onChange={e => setEditForm(f => ({ ...f, przebieg: e.target.value }))}
                  placeholder="Przebieg"
                  type="number"
                />
                <select
                  className="form-control mb-2"
                  value={editForm.rodzajPaliwa || ""}
                  onChange={e => setEditForm(f => ({ ...f, rodzajPaliwa: e.target.value }))}
                >
                  <option value="">Rodzaj paliwa...</option>
                  {paliwa.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <select
                  className="form-control mb-2"
                  value={editForm.skrzyniaBiegow || ""}
                  onChange={e => setEditForm(f => ({ ...f, skrzyniaBiegow: e.target.value }))}
                >
                  <option value="">Skrzynia biegów...</option>
                  {skrzynie.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <textarea
                  className="form-control mb-2"
                  value={editForm.opis || ""}
                  onChange={e => setEditForm(f => ({ ...f, opis: e.target.value }))}
                  placeholder="Opis"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditPojazd(null)}>
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

export default MojePojazdy;