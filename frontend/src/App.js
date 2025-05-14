import React from 'react';
import OfertaList from './components/OfertaList';
import DodajOferte from './components/DodajOferte';

function App() {
  return (
    <div className="App">
      <h1>🏁 Oferty z komisu</h1>
      <OfertaList />
      <DodajOferte />
    </div>
  );
}

export default App;
