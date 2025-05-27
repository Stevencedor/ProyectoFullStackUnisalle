import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Sistema de Pagos Universidad de La Salle</h1>
        <p>Gestión eficiente de pagos para estudiantes</p>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Estudiantes</h3>
          <p>Gestiona la información de los estudiantes y sus pagos asociados</p>
          <Link to="/estudiantes" className="feature-button">
            Ver Estudiantes
          </Link>
        </div>

        <div className="feature-card">
          <h3>Pagos</h3>
          <p>Administra y da seguimiento a todos los pagos realizados</p>
          <Link to="/pagos" className="feature-button">
            Ver Pagos
          </Link>
        </div>

        <div className="feature-card">
          <h3>Registro de Pagos</h3>
          <p>Registra nuevos pagos de manera rápida y sencilla</p>
          <Link to="/registro-pago" className="feature-button">
            Registrar Pago
          </Link>
        </div>
      </div>

      {/* Footer con información adicional */}
      <div className="home-footer">
        <div className="footer-info">
          <h3>Sobre el Sistema</h3>
          <p>
            El Sistema de Pagos de la Universidad de La Salle está diseñado para facilitar 
            la gestión de pagos de los estudiantes, ofreciendo una interfaz intuitiva y 
            herramientas eficientes para el seguimiento de transacciones.
          </p>
        </div>
        <div className="footer-contact">
          <h3>Soporte</h3>
          <p>
            Si encuentras algún problema o necesitas ayuda, por favor contacta al equipo 
            de soporte técnico.
          </p>
          <a href="mailto:soporte@unisalle.edu.co" className="contact-link">
            soporte@unisalle.edu.co
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;