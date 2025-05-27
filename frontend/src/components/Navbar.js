import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.jpg" alt="Logo Unisalle" />
          Sistema de Pagos
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/estudiantes" className="nav-link">
              Estudiantes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/pagos" className="nav-link">
              Pagos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/registro-pago" className="nav-link">
              Registrar Pago
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;