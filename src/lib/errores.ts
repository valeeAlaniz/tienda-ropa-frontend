// Convierte la respuesta de error de la API (DRF) en un texto para mostrar.
export function mensajeDeError(  
  data: unknown,  
  porDefecto = "No se pudo completar la operación.",
): string {  
  if (typeof data === "string") return data;  
  if (Array.isArray(data)) return data.map(String).join(" ");  
  if (data && typeof data === "object") {    
    const objeto = data as Record<string, unknown>;    
    if (typeof objeto.detail === "string") return objeto.detail;    
    const partes = Object.values(objeto).flatMap((valor) =>      
      Array.isArray(valor) ? valor.map(String) : [String(valor)],    );    
    if (partes.length > 0) return partes.join(" ");  
  }  
  return porDefecto;
}