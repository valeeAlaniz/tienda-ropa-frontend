import { API_URL, list } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { mensajeDeError } from "@/lib/errores";

export type Sucursal = {  
  id: number;  
  nombre: string;  
  direccion: string;  
  ciudad: string;  
  telefono: string;  
  activo: boolean;
};

export type TipoTurno = "PRUEBA" | "RETIRO" | "DEVOLUCION";
export type EstadoTurno = "PENDIENTE" | "CONFIRMADO" | "CANCELADO" | "COMPLETADO";

export type Turno = {  
  id: number;  
  sucursal: number;  
  sucursal_nombre: string;  
  cliente: number;  
  tipo: TipoTurno;  
  estado: EstadoTurno;  
  fecha: string;  
  hora: string;  
  creado: string;
};

export type DatosTurno = {  
  sucursal: number;  
  tipo: TipoTurno;  
  fecha: string;  
  hora: string;
};

export type ResultadoAccion = { ok: true } | { ok: false; error: string };

export async function getSucursales() {  
  return list<Sucursal>("/api/logistica/sucursales/");
}

export async function getMisTurnos() {  
  return list<Turno>("/api/logistica/turnos/");
}

async function enviar(path: string, cuerpo?: unknown): Promise<ResultadoAccion> {  
  const token = await getToken();  
  if (!token) return { ok: false, error: "Iniciá sesión para continuar." };  
  try {    
    const res = await fetch(`${API_URL}${path}`, {      
      method: "POST",      
      headers: {        
        "Content-Type": "application/json",        
        Authorization: `Token ${token}`,      
      },      
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,      
      cache: "no-store",    });    
    if (res.ok) return { ok: true };    
    const data = await res.json().catch(() => null);    
    return { ok: false, error: mensajeDeError(data) };  
  } catch {    
    return { ok: false, error: "No pudimos conectarnos con el servidor." };  
  }
}

export function crearTurno(datos: DatosTurno) {  
  return enviar("/api/logistica/turnos/", datos);
}

export function cancelarTurno(id: number) {  
  return enviar(`/api/logistica/turnos/${id}/cancelar/`);
}