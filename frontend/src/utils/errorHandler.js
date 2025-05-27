/**
 * Utilidad para manejar errores de la API y mostrar mensajes adecuados al usuario
 */
export const getErrorMessage = (error) => {
  if (error.userMessage) {
    return error.userMessage;
  }

  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'Datos incorrectos. Por favor, verifique la información.';
      case 401:
        return 'No autorizado. Por favor, inicie sesión.';
      case 403:
        return 'No tiene permisos para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor, intente más tarde.';
      default:
        return 'Error en la solicitud. Por favor, intente nuevamente.';
    }
  }

  if (error.request) {
    return 'No se pudo conectar con el servidor. Verifique su conexión.';
  }

  return 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
};

/**
 * Formatea el mensaje de error para incluir detalles adicionales si están disponibles
 */
export const formatErrorMessage = (error, context = '') => {
  const baseMessage = getErrorMessage(error);
  const details = error.response?.data?.message;
  
  if (context && details) {
    return `${context}: ${baseMessage} (${details})`;
  }
  
  if (context) {
    return `${context}: ${baseMessage}`;
  }
  
  if (details) {
    return `${baseMessage} (${details})`;
  }
  
  return baseMessage;
};

/**
 * Verifica si un error es debido a problemas de red
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Verifica si un error es debido a una respuesta del servidor
 */
export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

/**
 * Verifica si un error es debido a un problema de validación
 */
export const isValidationError = (error) => {
  return error.response && error.response.status === 400;
};

/**
 * Retorna los errores de validación en un formato amigable
 */
export const getValidationErrors = (error) => {
  if (!isValidationError(error)) {
    return {};
  }

  const validationErrors = error.response.data.errors || {};
  return Object.keys(validationErrors).reduce((acc, field) => {
    acc[field] = validationErrors[field].join('. ');
    return acc;
  }, {});
};