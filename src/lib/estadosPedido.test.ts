import { describe, expect, it } from "vitest";
import { pasosDelPedido, puedeCancelarElCliente } from "./estadosPedido";

describe("pasosDelPedido", () => {
  it("el envío pasa por ENVIADO", () => {
    expect(pasosDelPedido("ENVIO")).toEqual(["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO"]);
  });

  it("el retiro se entrega directo desde CONFIRMADO", () => {
    expect(pasosDelPedido("RETIRO")).toEqual(["PENDIENTE", "CONFIRMADO", "ENTREGADO"]);
  });
});

describe("puedeCancelarElCliente", () => {
  it("solo permite cancelar un pedido pendiente", () => {
    expect(puedeCancelarElCliente("PENDIENTE")).toBe(true);
    for (const estado of ["CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"] as const) {
      expect(puedeCancelarElCliente(estado)).toBe(false);
    }
  });
});
