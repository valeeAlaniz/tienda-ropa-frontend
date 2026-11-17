"use server";

import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { mensajeDeError } from "@/lib/errores";

export type ResultadoEstadoTurno = { ok: true } | { ok: false; error: string };

export async function cambiarEstadoTurno(
  id: number,
  estado: string,
): Promise<ResultadoEstadoTurno> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Tu sesión venció. Volvé a iniciar sesión." };

  const res = await fetch(`${API_URL}/api/logistica/turnos/${id}/cambiar_estado/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
    body: JSON.stringify({ estado }),
    cache: "no-store",
  }).catch(() => null);

  if (!res) return { ok: false, error: "No pudimos conectarnos con el servidor." };

  if (res.status === 401 || res.status === 403) {
    return { ok: false, error: "No tenés permiso para cambiar el estado." };
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return { ok: false, error: mensajeDeError(data, "No se pudo cambiar el estado.") };
  }

  revalidatePath("/dashboard/turnos");
  revalidatePath("/mis-turnos");
  return { ok: true };
}
