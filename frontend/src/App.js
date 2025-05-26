import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Sistema de Pagos Unisalle</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>Página Principal</div>} />
            {/* Aquí se agregarán más rutas según se desarrolle el frontend */}
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2024 Universidad de La Salle</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;