/**
 * Configuración CORS para la comunicación frontend-backend
 */
const corsConfig = {
  // Configuración básica de CORS
  headers: {
    'Access-Control-Allow-Origin': process.env.REACT_APP_CORS_ORIGIN || 'http://localhost:8081',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With',
    'Access-Control-Allow-Credentials': 'true'
  },

  // Opciones para las peticiones
  requestOptions: {
    // Indica si se deben enviar credenciales en peticiones cross-origin
    withCredentials: true,
    
    // Tiempo máximo de espera para las peticiones preflight (OPTIONS)
    maxAge: 86400, // 24 horas
    
    // Permitir envío de cookies
    credentials: 'include'
  },

  // Lista de orígenes permitidos
  allowedOrigins: [
    'http://localhost:3000',     // Frontend desarrollo
    'http://localhost:8081',     // Backend desarrollo
    'https://api.unisalle.edu.co' // Producción (ejemplo)
  ],

  // Función para verificar si un origen está permitido
  isOriginAllowed: (origin) => {
    if (!origin) return false;
    return corsConfig.allowedOrigins.includes(origin);
  },

  // Función para manejar errores CORS
  handleCorsError: (error) => {
    if (error.response && error.response.status === 403) {
      return {
        error: true,
        message: 'Error de CORS: Acceso no permitido desde este origen',
        details: error.message
      };
    }
    return {
      error: true,
      message: 'Error en la comunicación cross-origin',
      details: error.message
    };
  },

  // Headers específicos para subida de archivos
  fileUploadHeaders: {
    ...this?.headers,
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With'
  }
};

// Ejemplo de configuración para el backend (Spring Boot)
export const backendCorsConfig = `
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Origin", "Content-Type", "Accept", "Authorization", "X-Request-With")
            .allowCredentials(true)
            .maxAge(86400);
    }
}`;

export default corsConfig;