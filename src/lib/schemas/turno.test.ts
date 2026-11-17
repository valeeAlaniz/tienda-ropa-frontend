import { describe, expect, it } from "vitest";
import { hoyISO, turnoSchema } from "./turno";

const valido = {
  sucursal: "1",
  tipo: "PRUEBA",
  fecha: "2999-01-01",
  hora: "10:00",
};

describe("turnoSchema", () => {
  it("acepta una reserva válida", () => {
    expect(turnoSchema.safeParse(valido).success).toBe(true);
  });

  it("acepta una reserva para hoy", () => {
    expect(turnoSchema.safeParse({ ...valido, fecha: hoyISO() }).success).toBe(true);
  });

  it("rechaza fechas pasadas", () => {
    expect(turnoSchema.safeParse({ ...valido, fecha: "2000-01-01" }).success).toBe(false);
  });

  it("exige sucursal, día y horario", () => {
    const resultado = turnoSchema.safeParse({ ...valido, sucursal: "", fecha: "", hora: "" });
    expect(resultado.success).toBe(false);
  });

  it("rechaza un tipo de turno desconocido", () => {
    expect(turnoSchema.safeParse({ ...valido, tipo: "OTRO" }).success).toBe(false);
  });
});