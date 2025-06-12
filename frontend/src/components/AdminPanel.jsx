import React, { useEffect, useState } from "react";
import axios from "../axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    axios.get("/api/uzytkownik").then(res => setUsers(res.data)).catch(() => setUsers([]));
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({ email: user.email, rola: user.rola }); // Tylko email i rola!
  };

  const handleDelete = async id => {
    if (window.confirm("Czy na pewno usunąć użytkownika?")) {
      try {
        await axios.delete(`/api/uzytkownik/${id}`);
        setUsers(prev => prev.filter(u => u.uzytkownikId !== id));
        alert("Użytkownik usunięty!");
        setEditUser(null);
      } catch (err) {
        alert("Błąd usuwania: " + err.message);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/uzytkownik/${editUser.uzytkownikId}`, { ...editUser, email: editForm.email, rola: editForm.rola });
      setUsers(prev =>
        prev.map(u => (u.uzytkownikId === editUser.uzytkownikId ? { ...u, email: editForm.email, rola: editForm.rola } : u))
      );
      setEditUser(null);
      alert("Zapisano zmiany!");
    } catch (err) {
      alert("Błąd zapisu: " + err.message);
    }
  };

  return (
    <div>
      <h2>Panel administratora</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Rola</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.uzytkownikId}>
              <td>{user.uzytkownikId}</td>
              <td>{user.imie}</td>
              <td>{user.nazwisko}</td>
              <td>{user.email}</td>
              <td>{user.rola}</td>
              <td>
                {/* Usuń + Edytuj, tylko admin */}
                <button onClick={() => handleEdit(user)} className="btn btn-sm btn-warning me-2">Edytuj</button>
                <button onClick={() => handleDelete(user.uzytkownikId)} className="btn btn-sm btn-danger">Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal do edycji użytkownika */}
      {editUser && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edytuj: {editUser.imie} {editUser.nazwisko}</h5>
                <button type="button" className="btn-close" onClick={() => setEditUser(null)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Email:</label>
                  <input type="email" className="form-control" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label>Rola:</label>
                  <select className="form-control" value={editForm.rola} onChange={e => setEditForm({ ...editForm, rola: e.target.value })}>
                    <option value="uzytkownik">Uzytkownik</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>Anuluj</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Zapisz zmiany</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPanel;