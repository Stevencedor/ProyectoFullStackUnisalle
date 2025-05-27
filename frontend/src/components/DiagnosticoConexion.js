import React, { useState } from 'react';
import { diagnostico } from '../services/api';
import './ApiTest.css'; // Reutilizamos los estilos existentes

const DiagnosticoConexion = () => {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const probarConexion = async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await diagnostico.verificarConexion();
      setResultado(respuesta);
      console.log("Resultado diagnóstico:", respuesta);
    } catch (err) {
      console.error("Error en diagnóstico:", err);
      setError(err.message || 'Error al realizar diagnóstico');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="api-test-container">
      <h3>Diagnóstico de Conexión API</h3>
      
      <div className="test-controls">
        <button 
          className="test-button"
          onClick={probarConexion} 
          disabled={cargando}
        >
          {cargando ? 'Diagnosticando...' : 'Probar Conexión'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}
      
      {resultado && (
        <div className={`result-container ${resultado.status === 'success' ? 'success' : 'error'}`}>
          <h4>Resultado del diagnóstico:</h4>
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
      
      <div className="connection-tips">
        <h4>Consejos para solucionar problemas de conexión:</h4>
        <ul>
          <li>Verifica que el servidor backend esté corriendo en <code>http://localhost:8080</code></li>
          <li>Comprueba la configuración CORS en el backend</li>
          <li>Asegúrate que los endpoints estén correctamente definidos</li>
          <li>Revisa la consola del navegador para ver errores específicos</li>
        </ul>
      </div>
    </div>
  );
};

export default DiagnosticoConexion;
