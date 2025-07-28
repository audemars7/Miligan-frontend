/**
 * Utilidades para manejo de fechas de manera consistente
 * Configurado para zona horaria de Perú (America/Lima)
 */

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD usando zona horaria de Perú
 */
export const getCurrentDate = () => {
  const ahora = new Date();
  // Forzar zona horaria de Perú (America/Lima)
  const fechaPeru = new Date(ahora.toLocaleString("en-US", {timeZone: "America/Lima"}));
  return `${fechaPeru.getFullYear()}-${String(fechaPeru.getMonth() + 1).padStart(2, '0')}-${String(fechaPeru.getDate()).padStart(2, '0')}`;
};

/**
 * Obtiene la hora actual en zona horaria de Perú
 */
export const getCurrentTime = () => {
  const ahora = new Date();
  return new Date(ahora.toLocaleString("en-US", {timeZone: "America/Lima"}));
};

/**
 * Formatea una fecha YYYY-MM-DD a formato legible en español
 */
export const formatDate = (fecha) => {
  // Parsear manualmente para evitar problemas de zona horaria
  const [year, month, day] = fecha.split('-').map(Number);
  const fechaLocal = new Date(year, month - 1, day); // month - 1 porque Date usa 0-based months
  
  const opciones = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'America/Lima'
  };
  return fechaLocal.toLocaleDateString('es-ES', opciones);
};

/**
 * Determina el estado de una fecha (pasada, hoy, futura)
 */
export const getDateStatus = (fecha) => {
  const hoy = getCurrentDate();
  
  if (fecha < hoy) return 'pasada';
  if (fecha === hoy) return 'hoy';
  return 'futura';
};

/**
 * Valida si una fecha es válida (no es pasada)
 */
export const isValidDate = (fecha) => {
  const hoy = getCurrentDate();
  return fecha >= hoy;
};

/**
 * Compara dos fechas en formato YYYY-MM-DD
 */
export const compareDates = (fecha1, fecha2) => {
  return fecha1.localeCompare(fecha2);
};

/**
 * Calcula milisegundos hasta la medianoche en zona horaria de Perú
 */
export const getMillisecondsUntilMidnight = () => {
  const ahora = getCurrentTime();
  const medianoche = new Date(ahora);
  medianoche.setHours(24, 0, 0, 0); // Siguiente medianoche
  return medianoche.getTime() - ahora.getTime();
}; 