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

  const handleKup = async () => {
    const userId = getUserIdFromJWT();
    if (!userId) {
      alert("Musisz być zalogowany!");
      return;
    }
    try {
      await axios.post("/api/transakcja", {
        PojazdId: pojazd.pojazdId,
        OfertaId: oferta.ofertaId,        // <- przekazujesz ID oferty
        KupujacyId: userId,
        CenaKoncowa: pojazd.cena,
        StatusPlatnosci: "oczekuje",
        DataTransakcji: new Date().toISOString().slice(0, 10)
      });
      alert("Kupiono samochód! Oferta oznaczona jako sprzedana.");
    } catch (err) {
      alert("Błąd przy kupowaniu: " + (err.response?.data?.title || err.message));
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleKup}>
      Kup ten samochód
    </button>
  );
}

export default KupPojazdButton;