"use server";

import { revalidatePath } from "next/cache";
import { API_URL, ENDPOINTS } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  prendaAlquilerSchema,
  type PrendaAlquilerFormValues,
} from "@/lib/schemas/prenda";

export type ResultadoPrendaAlquiler = {
  ok?: true;
  error?: string;
  errores?: Record<string, string[]>;
};

async function llamar(path: string, opciones: RequestInit = {}) {
  const token = await getToken();

  return fetch(`${API_URL}${path}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    cache: "no-store",
  }).catch(() => null);
}

function refrescar() {
  revalidatePath("/dashboard/alquiler");
  revalidatePath("/alquiler");
  revalidatePath("/");
}

export async function desactivarPrendaAlquiler(
  id: number,
): Promise<ResultadoPrendaAlquiler> {
  const res = await llamar(`${ENDPOINTS.prendasAlquiler}${id}/`, {
    method: "DELETE",
  });

  if (!res) return { error: "Sin conexión con la API." };

  if (res.status === 401 || res.status === 403) {
    return { error: "Tu sesión venció. Volvé a iniciar sesión." };
  }

  if (!res.ok && res.status !== 404) {
    return { error: "No se pudo desactivar la prenda." };
  }

  refrescar();
  return {};
}

async function enviarPrendaAlquiler(
  path: string,
  method: "POST" | "PUT",
  valores: PrendaAlquilerFormValues,
): Promise<ResultadoPrendaAlquiler> {
  const parsed = prendaAlquilerSchema.safeParse(valores);

  if (!parsed.success) {
    return { error: "Los datos del formulario no son válidos." };
  }

  const v = parsed.data;

  const res = await llamar(path, {
    method,
    body: JSON.stringify({
      nombre: v.nombre,
      descripcion: v.descripcion,
      imagen: v.imagen,
      precio_por_dia: v.precio_por_dia,
      categoria: Number(v.categoria),
      talle: v.talle,
      color: v.color,
      destacado: v.destacado,
      activo: v.activo,
    }),
  });

  if (!res) return { error: "No se pudo conectar con la API." };

  if (res.status === 401 || res.status === 403) {
    return { error: "Tu sesión venció. Volvé a iniciar sesión." };
  }

  if (res.status === 400) {
    const errores = await res.json().catch(() => null);
    return { error: "La API rechazó algunos datos.", errores: errores ?? undefined };
  }

  if (!res.ok) return { error: "No se pudo guardar la prenda." };

  refrescar();
  return { ok: true };
}

export async function crearPrendaAlquiler(
  valores: PrendaAlquilerFormValues,
): Promise<ResultadoPrendaAlquiler> {
  return enviarPrendaAlquiler(ENDPOINTS.prendasAlquiler, "POST", valores);
}

export async function editarPrendaAlquiler(
  id: number,
  valores: PrendaAlquilerFormValues,
): Promise<ResultadoPrendaAlquiler> {
  return enviarPrendaAlquiler(`${ENDPOINTS.prendasAlquiler}${id}/`, "PUT", valores);
}
