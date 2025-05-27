const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const config = {
  apiUrl: API_BASE,
  timeout: parseInt(process.env.REACT_APP_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  endpoints: {
    // Endpoints de estudiantes
    estudiantes: {
      base: '/estudiantes',
      buscarPorCodigo: (codigo) => `/estudiantes/${codigo}`,
      porPrograma: '/estudiantesPorPrograma',
      pagosEstudiante: (codigo) => `/estudiantes/${codigo}/pagos`
    },
    // Endpoints de pagos
    pagos: {
      base: '/pagos',
      porStatus: '/pagosPorStatus',
      porTipo: '/pagosPorTipo',
      actualizarStatus: (id) => `/pagos/${id}/status`,
      comprobante: (id) => `/pagos/${id}/comprobante`
    },
    // Endpoint de diagnóstico
    health: '/actuator/health'
  }
};

export const getApiUrl = (path) => `${config.apiUrl}${path}`;

// Función para verificar si una URL es válida
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Función para verificar la configuración
export const validateConfig = () => {
  const issues = [];

  if (!isValidUrl(config.apiUrl)) {
    issues.push(`URL base inválida: ${config.apiUrl}`);
  }

  if (config.timeout < 1000) {
    issues.push('El timeout debe ser al menos 1000ms');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

// Exportar la configuración y utilidades
export default config;