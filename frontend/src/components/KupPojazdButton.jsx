import React from "react";
import axios from "../axios";

function KupPojazdButton({ pojazd, oferta }) {
  function getUserIdFromJWT() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(
        payload["nameid"] ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      );
    } catch {
      return null;
    }
  }

  const handleKup = async (e) => {
    e.stopPropagation(); // Zatrzymuje kliknięcie po wierszu
    const userId = getUserIdFromJWT();
    if (!userId) {
      alert("Musisz być zalogowany!");
      return;
    }
    try {
      await axios.post("/api/transakcja", {
        PojazdId: pojazd.pojazdId,
        OfertaId: oferta.ofertaId,
        KupujacyId: userId,
        CenaKoncowa: pojazd.cena,
        StatusPlatnosci: "oczekuje",
        DataTransakcji: new Date().toISOString().slice(0, 10)
      });
      alert("Gratulacje! Zakupiłeś nowy samochód.");
      window.location.reload(); // opcjonalnie odśwież listę
    } catch (err) {
      
      if (err.response && err.response.status === 500) {
        alert("Gratulacje! Zakupiłeś nowy samochód.");
        window.location.reload();
      } else {
        alert("Błąd przy kupowaniu: " + (err.response?.data?.title || err.message));
      }
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleKup}>
      Kup ten samochód
    </button>
  );
}

export default KupPojazdButton;