import React, { useEffect, useState } from "react";
import axios from "../axios";

function WszystkiePojazdy() {
  const [pojazdy, setPojazdy] = useState([]);
  const [users, setUsers] = useState([]);
  const [editPojazd, setEditPojazd] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    axios.get("/api/pojazd").then(res => setPojazdy(res.data)).catch(() => setPojazdy([]));
    axios.get("/api/uzytkownik").then(res => setUsers(res.data)).catch(() => setUsers([]));
  }, []);

  const getOwner = (sprzedajacyId) => {
    const user = users.find(u => u.uzytkownikId === sprzedajacyId);
    return user ? `${user.imie} ${user.nazwisko} (${user.email})` : "";
  };

  const handleEdit = (p) => {
    setEditPojazd(p);
    setEditForm({ ...p });
  };

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

  return (
    <div className="mt-4">
      <h5>Wszystkie pojazdy (dla admina)</h5>
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
              <th>Rodzaj paliwa</th>
              <th>Skrzynia biegów</th>
              <th>Opis</th>
              <th>Sprzedawca (właściciel)</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {pojazdy.map(p => (
              <tr key={p.pojazdId}>
                <td>{p.pojazdId}</td>
                <td>{p.marka}</td>
                <td>{p.model}</td>
                <td>{p.rokProdukcji}</td>
                <td>{p.cena}</td>
                <td>{p.przebieg}</td>
                <td>{p.rodzajPaliwa}</td>
                <td>{p.skrzyniaBiegow}</td>
                <td>{p.opis}</td>
                <td>{getOwner(p.sprzedajacyId)}</td>
                <td>
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
                <input
                  className="form-control mb-2"
                  value={editForm.rodzajPaliwa || ""}
                  onChange={e => setEditForm(f => ({ ...f, rodzajPaliwa: e.target.value }))}
                  placeholder="Rodzaj paliwa"
                />
                <input
                  className="form-control mb-2"
                  value={editForm.skrzyniaBiegow || ""}
                  onChange={e => setEditForm(f => ({ ...f, skrzyniaBiegow: e.target.value }))}
                  placeholder="Skrzynia biegów"
                />
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

export default WszystkiePojazdy;