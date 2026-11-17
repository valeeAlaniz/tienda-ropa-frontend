import { API_URL, list } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { EstadoPedido, TipoEntrega } from "@/lib/estadosPedido";

export type { EstadoPedido, TipoEntrega };

export type DetallePedido = {
  id: number;
  pedido: number;
  prenda: number;
  prenda_nombre: string;
  cantidad: number;
  precio_unitario: string;
};

export type Pago = {
  id: number;
  metodo: string;
  monto: string;
  aprobado: boolean;
};

export type Pedido = {
  id: number;
  cliente: number;
  fecha_venta: string;
  monto_total: string;
  estado: EstadoPedido;
  tipo_entrega: TipoEntrega;
  sucursal_retiro: number | null;
  direccion_envio: number | null;
  detalles_pedido: DetallePedido[];
  pago: Pago | null;
};

export type Direccion = {
  id: number;
  calle: string;
  numero: string;
  ciudad: string;
  codigo_postal: string;
};

export type Cliente = { id: number; nombre: string; apellido: string; email: string };

const ENDPOINTS = {
  pedidos: "/api/ventas/pedidos/",
  direcciones: "/api/clientes/direcciones/",
  clientes: "/api/clientes/clientes/",
};

// El back filtra por usuario: el cliente solo recibe lo suyo y el staff recibe todo.
export const getMisPedidos = () => list<Pedido>(ENDPOINTS.pedidos);

export const getDirecciones = () => list<Direccion>(ENDPOINTS.direcciones);

export async function getCliente(): Promise<Cliente | null> {
  const clientes = await list<Cliente>(ENDPOINTS.clientes);
  return clientes[0] ?? null;
}

export async function getPedido(id: string): Promise<Pedido | null> {
  const token = await getToken();
  const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {};

  const res = await fetch(`${API_URL}${ENDPOINTS.pedidos}${id}/`, {
    headers,
    cache: "no-store",
  });

  // Un pedido ajeno también responde 404: el back no lo muestra.
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`La API respondió ${res.status} al pedir el pedido ${id}`);
  return res.json();
}
