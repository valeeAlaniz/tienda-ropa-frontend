"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { API_URL } from "@/lib/api";
import { mensajeDeError } from "@/lib/errores";

const credenciales = z.object({
  username: z.string().trim().min(1).max(150),
  password: z.string().min(1),
});

const datosRegistro = credenciales.extend({
  email: z.email().max(254),
  nombre: z.string().trim().min(1).max(100),
  apellido: z.string().trim().min(1).max(100),
  telefono: z.string().trim().max(30),
  password_confirm: z.string().min(1),
});

const respuestaLogin = z.object({
  token: z.string().regex(/^[a-f0-9]{40}$/),
  username: z.string().min(1),
  is_staff: z.boolean(),
});

type Estado = { error?: string };

async function enviar(path: string, datos: Record<string, string>) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data: unknown = await res.json().catch(() => null);
    return { res, data };
  } catch {
    return null;
  }
}

export async function iniciarSesion(
  _previo: Estado,
  formulario: FormData,
): Promise<Estado> {
  const datos = credenciales.safeParse(Object.fromEntries(formulario));
  if (!datos.success) return { error: "Ingresá tu usuario y contraseña." };

  const resultado = await enviar("/api/token/", datos.data);
  if (!resultado || resultado.res.status >= 500) {
    return { error: "No pudimos conectar con la tienda. Intentá de nuevo." };
  }

  if (!resultado.res.ok) {
    return {
      error: resultado.res.status === 429
        ? "Demasiados intentos. Probá de nuevo en unos minutos."
        : "El usuario o la contraseña son incorrectos.",
    };
  }

  const sesion = respuestaLogin.safeParse(resultado.data);
  if (!sesion.success) {
    return { error: "La tienda devolvió una respuesta de inicio de sesión inválida." };
  }

  const jar = await cookies();
  const opciones = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  } as const;

  jar.set("token", sesion.data.token, opciones);
  jar.set("usuario", sesion.data.username, opciones);
  jar.set("staff", sesion.data.is_staff ? "1" : "0", opciones);
  redirect("/prendas");
}

export async function registrarCliente(
  _previo: Estado,
  formulario: FormData,
): Promise<Estado> {
  const datos = datosRegistro.safeParse(Object.fromEntries(formulario));
  if (!datos.success) return { error: "Revisá los datos del formulario." };
  if (datos.data.password !== datos.data.password_confirm) {
    return { error: "Las contraseñas no coinciden." };
  }

  const resultado = await enviar("/api/clientes/registro/", datos.data);
  if (!resultado || resultado.res.status >= 500) {
    return { error: "No pudimos conectar con la tienda. Intentá de nuevo." };
  }

  if (!resultado.res.ok) {
    return {
      error: mensajeDeError(resultado.data, "No se pudo crear la cuenta."),
    };
  }

  redirect("/login?registro=ok");
}

export async function cerrarSesion() {
  const jar = await cookies();
  for (const nombre of ["token", "usuario", "staff"]) jar.delete(nombre);
  redirect("/login");
}
