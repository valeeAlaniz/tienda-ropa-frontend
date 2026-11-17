import type { EstadoPedido, TipoEntrega } from "@/lib/estadosPedido";

export type OpcionEstado = { estado: string; etiqueta: string; peligro?: boolean };

/** Estados a los que el staff puede pasar un pedido. Igual que las transiciones del back. */
export function transicionesPedido(
  estado: EstadoPedido,
  tipo: TipoEntrega,
): OpcionEstado[] {
  switch (estado) {
    case "PENDIENTE":
      return [
        { estado: "CONFIRMADO", etiqueta: "Confirmar pago" },
        { estado: "CANCELADO", etiqueta: "Cancelar", peligro: true },
      ];
    case "CONFIRMADO":
      return [
        tipo === "ENVIO"
          ? { estado: "ENVIADO", etiqueta: "Marcar enviado" }
          : { estado: "ENTREGADO", etiqueta: "Marcar entregado" },
        { estado: "CANCELADO", etiqueta: "Cancelar", peligro: true },
      ];
    case "ENVIADO":
      return [{ estado: "ENTREGADO", etiqueta: "Marcar entregado" }];
    default:
      return [];
  }
}

export type EstadoTurnoPanel = "PENDIENTE" | "CONFIRMADO" | "CANCELADO" | "COMPLETADO";

/** Estados a los que el staff puede pasar un turno. */
export function transicionesTurno(estado: EstadoTurnoPanel): OpcionEstado[] {
  switch (estado) {
    case "PENDIENTE":
      return [
        { estado: "CONFIRMADO", etiqueta: "Confirmar" },
        { estado: "CANCELADO", etiqueta: "Cancelar", peligro: true },
      ];
    case "CONFIRMADO":
      return [
        { estado: "COMPLETADO", etiqueta: "Completar" },
        { estado: "CANCELADO", etiqueta: "Cancelar", peligro: true },
      ];
    default:
      return [];
  }
}
