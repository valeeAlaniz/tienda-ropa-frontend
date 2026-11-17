import { z } from "zod";

export const TIPOS_TURNO = [  
  { valor: "PRUEBA", etiqueta: "Prueba" },  
  { valor: "RETIRO", etiqueta: "Retiro" },  
  { valor: "DEVOLUCION", etiqueta: "Devolución" },  
] as const;

// Fecha de hoy en formato YYYY-MM-DD, en la zona horaria del navegador
export function hoyISO() {  
  const ahora = new Date();  
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");  
  const dia = String(ahora.getDate()).padStart(2, "0");  
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

export const turnoSchema = z.object({  
  sucursal: z.string().min(1, "Elegí una sucursal"),  
  tipo: z.enum(["PRUEBA", "RETIRO", "DEVOLUCION"]),  
  fecha: z    
    .string()    
    .min(1, "Elegí un día")    
    .refine((valor) => valor >= hoyISO(), "No se puede reservar en una fecha pasada"),  
  hora: z.string().min(1, "Elegí un horario"),
});

export type TurnoForm = z.infer<typeof turnoSchema>;