import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pagoService, estudianteService } from '../../services/api';
import './RegistroPago.css';

const RegistroPago = () => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    cantidad: '',
    tipo: 'EFECTIVO',
    fecha: new Date().toISOString().split('T')[0],
    codigoEstudiante: '',
    comprobante: null
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const response = await estudianteService.listarTodos();
      setEstudiantes(response.data);
    } catch (err) {
      setError('Error al cargar la lista de estudiantes');
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormulario(prev => ({
        ...prev,
        comprobante: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formulario.comprobante) {
      setError('Por favor seleccione un comprobante');
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', formulario.comprobante);
      formData.append('cantidad', formulario.cantidad);
      formData.append('type', formulario.tipo);
      formData.append('date', formulario.fecha);
      formData.append('codigoEstudiante', formulario.codigoEstudiante);

      await pagoService.registrarPago(formData);
      setExito(true);

      // Redireccionar a la lista de pagos después de 2 segundos
      setTimeout(() => {
        navigate('/pagos');
      }, 2000);

    } catch (err) {
      setError('Error al registrar el pago. Por favor intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-pago">
      <h2>Registrar Nuevo Pago</h2>

      {error && <div className="error-mensaje">{error}</div>}
      {exito && <div className="exito-mensaje">Pago registrado exitosamente</div>}

      <form onSubmit={handleSubmit} className="formulario-pago">
        <div className="form-grupo">
          <label htmlFor="codigoEstudiante">Estudiante:</label>
          <select
            id="codigoEstudiante"
            name="codigoEstudiante"
            value={formulario.codigoEstudiante}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante.codigo} value={estudiante.codigo}>
                {estudiante.codigo} - {estudiante.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-grupo">
          <label htmlFor="cantidad">Cantidad ($):</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formulario.cantidad}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="tipo">Tipo de Pago:</label>
          <select
            id="tipo"
            name="tipo"
            value={formulario.tipo}
            onChange={handleChange}
            required
          >
            <option value="CREDITO">Crédito</option>
            <option value="DEBITO">Débito</option>
            <option value="DEPOSITO">Depósito</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>
        </div>

        <div className="form-grupo">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formulario.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="comprobante">Comprobante:</label>
          <input
            type="file"
            id="comprobante"
            name="comprobante"
            onChange={handleArchivoChange}
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
          <small>Formatos permitidos: PDF, JPG, JPEG, PNG</small>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/pagos')}
            className="btn-cancelar"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-registrar"
            disabled={cargando}
          >
            {cargando ? 'Registrando...' : 'Registrar Pago'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroPago;