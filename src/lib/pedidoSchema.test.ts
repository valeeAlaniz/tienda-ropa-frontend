import { describe, expect, it } from "vitest";
import { pedidoSchema } from "./pedidoSchema";

const base = {
  tipoEntrega: "RETIRO",
  sucursal: "1",
  direccion: "nueva",
  calle: "",
  numero: "",
  ciudad: "",
  codigoPostal: "",
};

const campoConError = (valores: object) => {
  const resultado = pedidoSchema.safeParse({ ...base, ...valores });
  return resultado.success ? [] : resultado.error.issues.map((i) => i.path[0]);
};

describe("pedidoSchema", () => {
  it("acepta un retiro con sucursal", () => {
    expect(pedidoSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza un retiro sin sucursal", () => {
    expect(campoConError({ sucursal: "" })).toEqual(["sucursal"]);
  });

  it("rechaza un tipo de entrega inventado", () => {
    expect(pedidoSchema.safeParse({ ...base, tipoEntrega: "DRON" }).success).toBe(false);
  });

  it("exige todos los campos de una dirección nueva en un envío", () => {
    expect(campoConError({ tipoEntrega: "ENVIO" })).toEqual([
      "calle",
      "numero",
      "ciudad",
      "codigoPostal",
    ]);
  });

  it("acepta un envío con dirección nueva completa", () => {
    const valores = {
      tipoEntrega: "ENVIO",
      calle: "Colón",
      numero: "456",
      ciudad: "Río Cuarto",
      codigoPostal: "5800",
    };
    expect(pedidoSchema.safeParse({ ...base, ...valores }).success).toBe(true);
  });

  it("acepta un envío a una dirección guardada sin pedir los campos", () => {
    expect(pedidoSchema.safeParse({ ...base, tipoEntrega: "ENVIO", direccion: "7" }).success).toBe(true);
  });
});
