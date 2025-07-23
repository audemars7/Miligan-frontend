// Configuración de la API
const config = {
  // URL de desarrollo (local)
  development: {
    API_URL: "http://localhost:5000"
  },
  // URL de producción (Render)
  production: {
    API_URL: process.env.REACT_APP_API_URL || "https://tennismiligan.onrender.com"
  }
};

// Determinar el entorno
const environment = process.env.NODE_ENV || "development";

// Exportar la configuración del entorno actual
export const API_URL = config[environment].API_URL;

export default config; 