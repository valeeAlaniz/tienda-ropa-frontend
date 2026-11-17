"use server";

import { revalidatePath } from "next/cache";
import { cancelarTurno, crearTurno, type DatosTurno } from "@/lib/turnos";

export async function reservarTurno(datos: DatosTurno) {  
  const resultado = await crearTurno(datos);  
  if (resultado.ok) revalidatePath("/mis-turnos");  
  return resultado;
}

export async function cancelarMiTurno(id: number) {  
  const resultado = await cancelarTurno(id);  
  if (resultado.ok) revalidatePath("/mis-turnos");  
  return resultado;
}