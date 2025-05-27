import axios from 'axios';
import config, { validateConfig } from './config';
import corsConfig from './corsConfig';

// URL base del API - asegúrate que coincida con tu backend
const API_BASE_URL = 'http://localhost:8081';


// Validar la configuración antes de crear la instancia
const { isValid, issues } = validateConfig();
if (!isValid) {
  console.error('Problemas con la configuración de la API:', issues);
}

// Crear instancia de axios con configuración CORS y timeouts
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ...config.headers,
    ...corsConfig.headers
  },
  // Aplicar opciones de CORS desde corsConfig
  withCredentials: corsConfig.requestOptions.withCredentials,
  // Configuración de timeouts y reintentos
  timeout: 5000, // 5 segundos
  retries: 2,
  retryDelay: 1000, // 1 segundo entre reintentos
});

// Agregar lógica de reintentos
api.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    return Promise.reject(error);
  }

  config.retryCount += 1;
  console.log(`Reintentando petición (${config.retryCount}/${config.retry})...`);

  return new Promise(resolve => setTimeout(resolve, config.retryDelay))
    .then(() => api(config));
});

// Interceptor para depurar errores
api.interceptors.request.use(
  config => {
    console.log('Realizando petición a:', config.url);
    return config;
  },
  error => {
    console.error('Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para validar origen en peticiones
api.interceptors.request.use(
  (config) => {
    const origin = window.location.origin;
    if (!corsConfig.isOriginAllowed(origin)) {
      return Promise.reject(new Error(`Origen no permitido: ${origin}`));
    }
    console.log('Realizando petición a:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error);
    
    // Manejo específico de errores CORS
    if (error.response?.status === 403 || 
        error.code === 'ERR_NETWORK' ||
        error.message.includes('CORS')) {
      const corsError = corsConfig.handleCorsError(error);
      return Promise.reject(corsError);
    }
    
    // Otros tipos de errores
    if (error.code === 'ECONNABORTED') {
      error.userMessage = `Tiempo de espera agotado al intentar conectar con ${config.apiUrl}`;
    } else if (error.response) {
      const message = error.response.data?.message || 'Error en la solicitud';
      error.userMessage = `${message} (${error.response.status})`;
    } else if (error.request) {
      error.userMessage = `No se pudo conectar con el servidor en ${config.apiUrl}`;
    } else {
      error.userMessage = 'Error al procesar la solicitud';
    }
    
    return Promise.reject(error);
  }
);

// Servicios para Estudiantes
export const estudianteService = {
  listarTodos: () => 
    api.get(config.endpoints.estudiantes.base),
  
  buscarPorCodigo: (codigo) => {
    if (!codigo) throw new Error('Código de estudiante requerido');
    return api.get(config.endpoints.estudiantes.buscarPorCodigo(codigo));
  },
  
  listarPorPrograma: (programaId) => {
    if (!programaId) throw new Error('ID de programa requerido');
    return api.get(config.endpoints.estudiantes.porPrograma, {
      params: { programaId }
    });
  }
};

// Servicios para Pagos
export const pagoService = {
  listarTodos: () => 
    api.get(config.endpoints.pagos.base),
  
  listarPorEstudiante: (codigo) => {
    if (!codigo) throw new Error('Código de estudiante requerido');
    return api.get(config.endpoints.estudiantes.pagosEstudiante(codigo));
  },
  
  listarPorStatus: (status) => {
    if (!status) throw new Error('Estado de pago requerido');
    return api.get(config.endpoints.pagos.porStatus, { 
      params: { status } 
    });
  },
  
  listarPorTipo: (type) => {
    if (!type) throw new Error('Tipo de pago requerido');
    return api.get(config.endpoints.pagos.porTipo, { 
      params: { type } 
    });
  },
  
  actualizarStatus: (id, status) => {
    if (!id || !status) throw new Error('ID y estado de pago requeridos');
    return api.post(config.endpoints.pagos.actualizarStatus(id), null, {
      params: { status }
    });
  },
  
  registrarPago: (formData) => {
    if (!formData) throw new Error('Datos del pago requeridos');
    return api.post(config.endpoints.pagos.base, formData, {
      headers: corsConfig.fileUploadHeaders
    });
  },
  
  descargarComprobante: (pagoId) => {
    if (!pagoId) throw new Error('ID de pago requerido');
    return api.get(config.endpoints.pagos.comprobante(pagoId), {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
        ...corsConfig.headers
      }
    });
  }
};

// Funciones de diagnóstico
export const diagnostico = {
  verificarConexion: async () => {
    try {
      const response = await api.get(config.endpoints.health);
      return {
        status: 'success',
        data: {
          ...response.data,
          cors: 'habilitado',
          origin: window.location.origin
        }
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.userMessage || 'Error al verificar la conexión',
        cors: corsConfig.isOriginAllowed(window.location.origin) 
          ? 'configurado' 
          : 'no permitido'
      };
    }
  },

  verificarEndpoints: async () => {
    const resultados = {};
    
    for (const [servicio, endpoints] of Object.entries(config.endpoints)) {
      if (typeof endpoints === 'object') {
        resultados[servicio] = {};
        
        for (const [nombre, ruta] of Object.entries(endpoints)) {
          if (typeof ruta === 'string') {
            try {
              await api.options(ruta);
              resultados[servicio][nombre] = 'disponible';
            } catch (error) {
              resultados[servicio][nombre] = 'no disponible';
              console.error(`Error CORS en ${ruta}:`, error);
            }
          }
        }
      }
    }
    
    return resultados;
  }
};

export default api;