import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { pagoService, estudianteService } from '../../services/api';
import './ListaPagos.css';

const ListaPagos = () => {
  const { codigo: codigoEstudiante } = useParams();
  const [pagos, setPagos] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtrosTipo, setFiltrosTipo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sinResultados, setSinResultados] = useState(false);

  const cargarDatosEstudiante = useCallback(async (codigo) => {
    try {
      const response = await estudianteService.buscarPorCodigo(codigo);
      if (response.data) {
        setEstudiante(response.data);
      }
    } catch (err) {
      console.error('Error al cargar datos del estudiante:', err);
    }
  }, []);

  const cargarTodosPagos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      setSinResultados(false);
      
      const response = await pagoService.listarTodos();
      const pagosData = response.data;
      
      if (Array.isArray(pagosData)) {
        setPagos(pagosData);
        setSinResultados(pagosData.length === 0);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (err) {
      console.error('Error al cargar pagos:', err);
      let errorMessage = 'Error al cargar los pagos.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'El servidor está tardando en responder. Reintentando automáticamente...';
      } else if (err.response?.status === 404) {
        errorMessage = 'No se encontraron registros de pagos.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'No se pudo conectar con el servidor. Verificando conexión...';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setPagos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarPagosEstudiante = useCallback(async () => {
    if (!codigoEstudiante) return;

    try {
      setCargando(true);
      setError(null);
      setSinResultados(false);

      await cargarDatosEstudiante(codigoEstudiante);
      const response = await pagoService.listarPorEstudiante(codigoEstudiante);
      const pagosData = response.data;

      if (Array.isArray(pagosData)) {
        setPagos(pagosData);
        setSinResultados(pagosData.length === 0);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (err) {
      console.error('Error al cargar pagos del estudiante:', err);
      let errorMessage = 'Error al cargar los pagos del estudiante.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'El servidor está tardando en responder. Reintentando automáticamente...';
      } else if (err.response?.status === 404) {
        errorMessage = 'No se encontraron pagos para este estudiante.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'No se pudo conectar con el servidor. Verificando conexión...';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setPagos([]);
    } finally {
      setCargando(false);
    }
  }, [codigoEstudiante, cargarDatosEstudiante]);

  useEffect(() => {
    if (codigoEstudiante) {
      cargarPagosEstudiante();
    } else {
      cargarTodosPagos();
    }
  }, [codigoEstudiante, cargarPagosEstudiante, cargarTodosPagos]);

  const filtrarPorStatus = async () => {
    if (!filtroStatus) {
      codigoEstudiante ? cargarPagosEstudiante() : cargarTodosPagos();
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setSinResultados(false);
      
      const response = await pagoService.listarPorStatus(filtroStatus);
      let pagosFiltrados = response.data;

      if (Array.isArray(pagosFiltrados)) {
        if (codigoEstudiante) {
          pagosFiltrados = pagosFiltrados.filter(
            pago => pago.estudiante.codigo === codigoEstudiante
          );
        }
        setPagos(pagosFiltrados);
        setSinResultados(pagosFiltrados.length === 0);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (err) {
      console.error('Error al filtrar pagos:', err);
      setError('Error al filtrar pagos por estado.');
      setPagos([]);
    } finally {
      setCargando(false);
    }
  };

  const filtrarPorTipo = async () => {
    if (filtrosTipo.length === 0) {
      codigoEstudiante ? cargarPagosEstudiante() : cargarTodosPagos();
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setSinResultados(false);
      
      const response = await pagoService.listarTodos();
      let pagosFiltrados = response.data;

      if (Array.isArray(pagosFiltrados)) {
        pagosFiltrados = pagosFiltrados.filter(pago =>
          filtrosTipo.includes(pago.tipoPago)
        );

        if (codigoEstudiante) {
          pagosFiltrados = pagosFiltrados.filter(
            pago => pago.estudiante.codigo === codigoEstudiante
          );
        }
        
        setPagos(pagosFiltrados);
        setSinResultados(pagosFiltrados.length === 0);
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (err) {
      console.error('Error al filtrar pagos:', err);
      setError('Error al filtrar pagos por tipo.');
      setPagos([]);
    } finally {
      setCargando(false);
    }
  };

  const actualizarStatus = async (id, nuevoStatus) => {
    try {
      setError(null);
      await pagoService.actualizarStatus(id, nuevoStatus);
      
      if (codigoEstudiante) {
        cargarPagosEstudiante();
      } else {
        cargarTodosPagos();
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError('Error al actualizar el estado del pago.');
    }
  };

  const descargarComprobante = async (id) => {
    try {
      setError(null);
      const response = await pagoService.descargarComprobante(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar comprobante:', err);
      setError('Error al descargar el comprobante.');
    }
  };

  const limpiarFiltros = () => {
    setFiltroStatus('');
    setFiltrosTipo([]);
    if (codigoEstudiante) {
      cargarPagosEstudiante();
    } else {
      cargarTodosPagos();
    }
  };

  const renderTablaPagos = () => {
    if (sinResultados) {
      return (
        <div className="mensaje-info">
          No se encontraron pagos con los criterios especificados.
        </div>
      );
    }

    return (
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.id}</td>
                <td>{pago.estudiante.nombre}</td>
                <td>{pago.tipoPago}</td>
                <td>${pago.cantidad.toFixed(2)}</td>
                <td>{new Date(pago.fecha).toLocaleDateString()}</td>
                <td>
                  <select
                    value={pago.status}
                    onChange={(e) => actualizarStatus(pago.id, e.target.value)}
                    className={`status-${pago.status.toLowerCase()}`}
                  >
                    <option value="CREADO">Creado</option>
                    <option value="VALIDADO">Validado</option>
                    <option value="RECHAZADO">Rechazado</option>
                  </select>
                </td>
                <td>
                  <button 
                    onClick={() => descargarComprobante(pago.id)}
                    className="btn-descargar"
                  >
                    Descargar Comprobante
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="lista-pagos">
      <h2>
        {estudiante 
          ? `Pagos de ${estudiante.nombre} (${estudiante.codigo})`
          : 'Listado de Pagos'}
      </h2>
      
      <div className="filtros">
        <div className="filtro">
          <select 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="CREADO">Creado</option>
            <option value="VALIDADO">Validado</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
          <button onClick={filtrarPorStatus}>Filtrar por Estado</button>
        </div>

        <div className="filtro">
          <Select
            isMulti
            options={[
              { value: 'CREDITO', label: 'Crédito' },
              { value: 'DEBITO', label: 'Débito' },
              { value: 'DEPOSITO', label: 'Depósito' },
              { value: 'TRANSFERENCIA', label: 'Transferencia' },
              { value: 'EFECTIVO', label: 'Efectivo' }
            ]}
            value={filtrosTipo.map(tipo => ({
              value: tipo,
              label: {
                'CREDITO': 'Crédito',
                'DEBITO': 'Débito',
                'DEPOSITO': 'Depósito',
                'TRANSFERENCIA': 'Transferencia',
                'EFECTIVO': 'Efectivo'
              }[tipo]
            }))}
            onChange={(selectedOptions) => {
              setFiltrosTipo(selectedOptions ? selectedOptions.map(option => option.value) : []);
            }}
            placeholder="Seleccionar tipos..."
            classNamePrefix="react-select"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: '#003d7d',
                primary25: '#e6eef7',
                primary50: '#cce0f5',
                primary75: '#99c2e6'
              }
            })}
          />
          <button onClick={filtrarPorTipo}>Filtrar por Tipos</button>
        </div>

        {(filtroStatus || filtrosTipo.length > 0) && (
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        )}
      </div>

      {error && (
        <div className="error-mensaje">
          <p>{error}</p>
          <button onClick={codigoEstudiante ? cargarPagosEstudiante : cargarTodosPagos}>
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando pagos...</p>
        </div>
      ) : (
        renderTablaPagos()
      )}
    </div>
  );
};

export default ListaPagos;