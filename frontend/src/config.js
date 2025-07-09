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

// Token JWT (en producción deberías obtenerlo dinámicamente)
export const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMSIsImV4cCI6MTc1MTgzNzA5MH0.ODqiXsemKZqW0XWyAD5-ar-Tgz6KBbLH1GujL-T0occ";

export default config; 