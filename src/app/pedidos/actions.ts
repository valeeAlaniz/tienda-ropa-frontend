"use server";

import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { mensajeDeError } from "@/lib/errores";
import { pedidoSchema, type PedidoFormValues } from "@/lib/pedidoSchema";
import { getDirecciones } from "@/lib/pedidos";

export type ItemCarrito = { id: number; cantidad: number };
export type ResultadoPedido = { ok: true; id: number } | { ok: false; error: string };
export type ResultadoCancelacion = { ok: true } | { ok: false; error: string };

const SESION_VENCIDA = "Tu sesión venció. Volvé a iniciar sesión.";
const SIN_CONEXION = "No pudimos conectarnos con el servidor.";

export async function crearPedido(
  valores: PedidoFormValues,
  items: ItemCarrito[],
): Promise<ResultadoPedido> {
  const token = await getToken();
  if (!token) return { ok: false, error: SESION_VENCIDA };

  const parsed = pedidoSchema.safeParse(valores);
  if (!parsed.success) {
    return { ok: false, error: "Los datos del formulario no son válidos." };
  }
  const v = parsed.data;

  if (items.length === 0) return { ok: false, error: "Tu carrito está vacío." };

  const itemsValidos = items.every(
    (item) =>
      Number.isInteger(item.id) && Number.isInteger(item.cantidad) && item.cantidad >= 1,
  );
  if (!itemsValidos) {
    return { ok: false, error: "Hay una prenda o una cantidad inválida en el carrito." };
  }

  // El back arma el pedido solo con ids y cantidades: el precio y el total los calcula él.
  const cuerpo: Record<string, unknown> = {
    tipo_entrega: v.tipoEntrega,
    prendas: items.map((item) => ({ prenda_id: item.id, cantidad: item.cantidad })),
  };

  if (v.tipoEntrega === "RETIRO") {
    cuerpo.sucursal_retiro = Number(v.sucursal);
  } else if (v.direccion === "nueva") {
    cuerpo.direccion_envio = {
      calle: v.calle,
      numero: v.numero,
      ciudad: v.ciudad,
      codigo_postal: v.codigoPostal,
    };
  } else {
    const direcciones = await getDirecciones().catch(() => null);
    const guardada = direcciones?.find((d) => d.id === Number(v.direccion));
    if (!guardada) {
      return { ok: false, error: "La dirección elegida ya no está disponible." };
    }
    cuerpo.direccion_envio = {
      calle: guardada.calle,
      numero: guardada.numero,
      ciudad: guardada.ciudad,
      codigo_postal: guardada.codigo_postal,
    };
  }

  const respuesta = await fetch(`${API_URL}/api/ventas/pedidos/crear_completo/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
    body: JSON.stringify(cuerpo),
    cache: "no-store",
  }).catch(() => null);

  if (!respuesta) return { ok: false, error: SIN_CONEXION };
  // El back usa SessionAuthentication primero: una sesión inválida responde 403 y no 401.
  if (respuesta.status === 401 || respuesta.status === 403) {
    return { ok: false, error: SESION_VENCIDA };
  }

  const data = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    return { ok: false, error: mensajeDeError(data, "No se pudo registrar el pedido.") };
  }
  if (!data?.id) {
    return { ok: false, error: "El servidor no devolvió el número del pedido." };
  }

  revalidatePath("/pedidos");
  return { ok: true, id: data.id };
}

export async function cancelarPedido(id: number): Promise<ResultadoCancelacion> {
  const token = await getToken();
  if (!token) return { ok: false, error: SESION_VENCIDA };

  const respuesta = await fetch(`${API_URL}/api/ventas/pedidos/${id}/cancelar/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (!respuesta) return { ok: false, error: SIN_CONEXION };
  if (respuesta.status === 401) return { ok: false, error: SESION_VENCIDA };

  if (!respuesta.ok) {
    const data = await respuesta.json().catch(() => null);
    return { ok: false, error: mensajeDeError(data, "No se pudo cancelar el pedido.") };
  }

  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${id}`);
  return { ok: true };
}
