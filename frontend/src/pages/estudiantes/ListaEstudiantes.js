import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudianteService } from '../../services/api';
import './ListaEstudiantes.css';

const ListaEstudiantes = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtroPrograma, setFiltroPrograma] = useState('');
  const [busquedaCodigo, setBusquedaCodigo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sinResultados, setSinResultados] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setCargando(true);
      setError(null);
      setSinResultados(false);
      const response = await estudianteService.listarTodos();
      
      if (response.data && Array.isArray(response.data)) {
        setEstudiantes(response.data);
        setSinResultados(response.data.length === 0);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      let errorMessage = 'Error al cargar los estudiantes.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'El servidor está tardando en responder. Reintentando automáticamente...';
      } else if (err.response?.status === 404) {
        errorMessage = 'No se encontraron datos de estudiantes.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'No se pudo conectar con el servidor. Verificando conexión...';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setEstudiantes([]);
    } finally {
      setCargando(false);
    }
  };

  const buscarPorCodigo = async () => {
    if (!busquedaCodigo.trim()) {
      cargarEstudiantes();
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setSinResultados(false);
      const response = await estudianteService.buscarPorCodigo(busquedaCodigo);
      
      if (response.data) {
        setEstudiantes(response.data ? [response.data] : []);
        setSinResultados(!response.data);
      } else {
        setSinResultados(true);
        setEstudiantes([]);
      }
    } catch (err) {
      console.error('Error al buscar estudiante:', err);
      setError('No se encontró ningún estudiante con ese código.');
      setEstudiantes([]);
    } finally {
      setCargando(false);
    }
  };

  const filtrarPorPrograma = async () => {
    if (!filtroPrograma.trim()) {
      cargarEstudiantes();
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setSinResultados(false);
      const response = await estudianteService.listarPorPrograma(filtroPrograma);
      
      if (response.data && Array.isArray(response.data)) {
        setEstudiantes(response.data);
        setSinResultados(response.data.length === 0);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (err) {
      console.error('Error al filtrar estudiantes:', err);
      setError('Error al filtrar estudiantes. Por favor, intente nuevamente.');
      setEstudiantes([]);
    } finally {
      setCargando(false);
    }
  };

  const verPagosEstudiante = (codigo) => {
    navigate(`/estudiantes/${codigo}/pagos`);
  };

  const renderTablaEstudiantes = () => {
    if (sinResultados) {
      return (
        <div className="mensaje-info">
          No se encontraron estudiantes con los criterios especificados.
        </div>
      );
    }

    return (
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Programa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => (
              <tr key={estudiante.codigo}>
                <td>{estudiante.codigo}</td>
                <td>{estudiante.nombre}</td>
                <td>{estudiante.programaId}</td>
                <td>
                  <button 
                    className="btn-ver-pagos"
                    onClick={() => verPagosEstudiante(estudiante.codigo)}
                  >
                    Ver Pagos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const limpiarFiltros = () => {
    setBusquedaCodigo('');
    setFiltroPrograma('');
    cargarEstudiantes();
  };

  return (
    <div className="lista-estudiantes">
      <h2>Listado de Estudiantes</h2>
      
      <div className="filtros">
        <div className="busqueda">
          <input
            type="text"
            placeholder="Buscar por código"
            value={busquedaCodigo}
            onChange={(e) => setBusquedaCodigo(e.target.value)}
          />
          <button onClick={buscarPorCodigo}>Buscar</button>
        </div>

        <div className="filtro-programa">
          <input
            type="text"
            placeholder="Filtrar por programa"
            value={filtroPrograma}
            onChange={(e) => setFiltroPrograma(e.target.value)}
          />
          <button onClick={filtrarPorPrograma}>Filtrar</button>
        </div>

        {(busquedaCodigo || filtroPrograma) && (
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        )}
      </div>

      {error && (
        <div className="error-mensaje">
          <p>{error}</p>
          <button onClick={cargarEstudiantes}>Reintentar</button>
        </div>
      )}

      {cargando ? (
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando estudiantes...</p>
        </div>
      ) : (
        renderTablaEstudiantes()
      )}
    </div>
  );
};

export default ListaEstudiantes;