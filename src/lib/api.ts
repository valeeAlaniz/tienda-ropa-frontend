import { getToken } from "@/lib/auth";
import type {
  Categoria,
  Prenda,
  PrendaAlquiler,
  PrendaDetalle,
} from "@/lib/types";

export const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {
  prendas: "/api/prendas/",
  prendasAlquiler: "/api/prendas-alquiler/",
  categorias: "/api/categorias/",
};

async function cabeceras(): Promise<HeadersInit> {
  const token = await getToken();
  return token ? { Authorization: `Token ${token}` } : {};
}

export async function list<T = unknown>(path: string): Promise<T[]> {
  const headers = await cabeceras();

  let page = 1;
  let all: T[] = [];

  while (true) {
    const separador = path.includes("?") ? "&" : "?";
    const res = await fetch(`${API_URL}${path}${separador}page=${page}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`La API respondió ${res.status} en ${path}`);
    }

    const data = await res.json();

    if (Array.isArray(data)) return data;

    all = all.concat(data.results ?? []);

    if (!data.next) return all;

    page += 1;
  }
}

export type FiltrosPrendas = {
  search?: string;
  categoria?: string;
  talle?: string;
  color?: string;
  ordering?: string;
  activo?: string | boolean;
};

function armarQuery(params?: FiltrosPrendas) {
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(params ?? {})) {
    if (valor !== undefined && valor !== "") {
      query.set(clave, String(valor));
    }
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function getPrendas(params?: FiltrosPrendas): Promise<Prenda[]> {
  return list<Prenda>(`${ENDPOINTS.prendas}${armarQuery(params)}`);
}

export async function getPrenda(id: string): Promise<PrendaDetalle | null> {
  const res = await fetch(`${API_URL}${ENDPOINTS.prendas}${id}/`, {
    headers: await cabeceras(),
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`La API respondió ${res.status} al pedir la prenda ${id}`);
  }

  return res.json();
}

export async function getPrendasAlquiler(
  params?: FiltrosPrendas,
): Promise<PrendaAlquiler[]> {
  return list<PrendaAlquiler>(
    `${ENDPOINTS.prendasAlquiler}${armarQuery(params)}`,
  );
}

export async function getPrendaAlquiler(id: string): Promise<PrendaAlquiler | null> {
  const res = await fetch(`${API_URL}${ENDPOINTS.prendasAlquiler}${id}/`, {
    headers: await cabeceras(),
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`La API respondió ${res.status} al pedir la prenda ${id}`);
  }

  return res.json();
}

export async function getCategorias() {
  return list<Categoria>(ENDPOINTS.categorias);
}
