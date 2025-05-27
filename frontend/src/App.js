import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListaEstudiantes from './pages/estudiantes/ListaEstudiantes';
import ListaPagos from './pages/pagos/ListaPagos';
import RegistroPago from './pages/pagos/RegistroPago';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/estudiantes" element={<ListaEstudiantes />} />
            <Route path="/pagos" element={<ListaPagos />} />
            <Route path="/registro-pago" element={<RegistroPago />} />
            {/* Ruta para ver pagos de un estudiante específico */}
            <Route path="/estudiantes/:codigo/pagos" element={<ListaPagos />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Universidad de La Salle - Sistema de Pagos</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;