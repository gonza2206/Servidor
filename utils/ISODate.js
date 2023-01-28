/**
 * 
 * @param {string} date 
 * @returns  ISO 8601 Date
 * * Converts a date yyyy-m-d-h-m-s into an ISO 8601 format
 */
export function convertToISO(date) {
    // Separar la fecha en un arreglo
    const dateArray = date.split("-");
  
    // Crear una nueva instancia de Date
    const newDate = new Date(dateArray[0], dateArray[1]-1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
  
    // Convertir la fecha a formato ISO 8601
    const isoDate = newDate.toISOString();
  
    return isoDate;
  }