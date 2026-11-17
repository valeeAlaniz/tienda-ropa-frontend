import { describe, expect, it } from "vitest";
import { transicionesPedido, transicionesTurno } from "@/lib/panelStaff";

const estados = (opciones: { estado: string }[]) => opciones.map((o) => o.estado);

describe("transicionesPedido", () => {
  it("un pedido pendiente se confirma o se cancela", () => {
    expect(estados(transicionesPedido("PENDIENTE", "RETIRO"))).toEqual([
      "CONFIRMADO",
      "CANCELADO",
    ]);
  });

  it("un pedido de envío confirmado pasa por enviado", () => {
    expect(estados(transicionesPedido("CONFIRMADO", "ENVIO"))).toEqual([
      "ENVIADO",
      "CANCELADO",
    ]);
  });

  it("un pedido de retiro confirmado se entrega directo, sin enviado", () => {
    expect(estados(transicionesPedido("CONFIRMADO", "RETIRO"))).toEqual([
      "ENTREGADO",
      "CANCELADO",
    ]);
  });

  it("un pedido enviado solo se entrega", () => {
    expect(estados(transicionesPedido("ENVIADO", "ENVIO"))).toEqual(["ENTREGADO"]);
  });

  it("entregado y cancelado ya no tienen acciones", () => {
    expect(transicionesPedido("ENTREGADO", "ENVIO")).toEqual([]);
    expect(transicionesPedido("CANCELADO", "RETIRO")).toEqual([]);
  });

  it("cancelar se marca como acción peligrosa", () => {
    const cancelar = transicionesPedido("PENDIENTE", "RETIRO").find(
      (o) => o.estado === "CANCELADO",
    );
    expect(cancelar?.peligro).toBe(true);
  });
});

describe("transicionesTurno", () => {
  it("un turno pendiente se confirma o se cancela", () => {
    expect(estados(transicionesTurno("PENDIENTE"))).toEqual(["CONFIRMADO", "CANCELADO"]);
  });

  it("un turno confirmado se completa o se cancela", () => {
    expect(estados(transicionesTurno("CONFIRMADO"))).toEqual(["COMPLETADO", "CANCELADO"]);
  });

  it("completado y cancelado ya no tienen acciones", () => {
    expect(transicionesTurno("COMPLETADO")).toEqual([]);
    expect(transicionesTurno("CANCELADO")).toEqual([]);
  });
});
