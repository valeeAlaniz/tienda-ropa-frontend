// Los valores se escriben igual que en el back, en MAYÚSCULAS.
export type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
export type TipoEntrega = "RETIRO" | "ENVIO";

export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Pago confirmado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

/** Pasos que recorre un pedido. El retiro no pasa por ENVIADO; el envío sí. */
export function pasosDelPedido(tipo: TipoEntrega): EstadoPedido[] {
  return tipo === "ENVIO"
    ? ["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO"]
    : ["PENDIENTE", "CONFIRMADO", "ENTREGADO"];
}

/** Solo el cliente dueño puede cancelar, y solo mientras el pedido está pendiente. */
export function puedeCancelarElCliente(estado: EstadoPedido): boolean {
  return estado === "PENDIENTE";
}
