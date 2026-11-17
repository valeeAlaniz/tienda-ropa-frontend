import { describe, expect, it } from "vitest";
import { prendaAlquilerSchema, prendaSchema } from "@/lib/schemas/prenda";

const prendaValida = {
  nombre: "Camisa de lino",
  descripcion: "Camisa de lino blanca, ideal para verano",
  imagen: "https://ejemplo.com/camisa.jpg",
  categoria: "1",
  talle: "M" as const,
  color: "Blanco",
  destacado: false,
  activo: true,
  precio: "38500",
  stock: "10",
};

function mensajes(datos: unknown, schema = prendaSchema) {
  const resultado = schema.safeParse(datos);
  return resultado.success ? [] : resultado.error.issues.map((i) => i.message);
}

describe("prendaSchema", () => {
  it("acepta una prenda válida", () => {
    expect(prendaSchema.safeParse(prendaValida).success).toBe(true);
  });

  it("rechaza un nombre muy corto", () => {
    expect(mensajes({ ...prendaValida, nombre: "ab" })).toContain(
      "El nombre debe tener al menos 3 caracteres",
    );
  });

  it("rechaza una descripción muy corta", () => {
    expect(mensajes({ ...prendaValida, descripcion: "corta" })).toContain(
      "La descripción debe tener al menos 10 caracteres",
    );
  });

  it("rechaza un precio en cero o que no es número", () => {
    expect(prendaSchema.safeParse({ ...prendaValida, precio: "0" }).success).toBe(false);
    expect(prendaSchema.safeParse({ ...prendaValida, precio: "abc" }).success).toBe(false);
  });

  it("acepta stock 0 pero rechaza negativo o decimal", () => {
    expect(prendaSchema.safeParse({ ...prendaValida, stock: "0" }).success).toBe(true);
    expect(prendaSchema.safeParse({ ...prendaValida, stock: "-1" }).success).toBe(false);
    expect(prendaSchema.safeParse({ ...prendaValida, stock: "1.5" }).success).toBe(false);
  });

  it("rechaza un talle que no existe", () => {
    expect(prendaSchema.safeParse({ ...prendaValida, talle: "XXXL" }).success).toBe(false);
  });

  it("acepta imagen vacía pero rechaza un link sin http", () => {
    expect(prendaSchema.safeParse({ ...prendaValida, imagen: "" }).success).toBe(true);
    expect(prendaSchema.safeParse({ ...prendaValida, imagen: "foto.jpg" }).success).toBe(false);
  });

  it("exige elegir categoría", () => {
    expect(mensajes({ ...prendaValida, categoria: "" })).toContain("Elegí una categoría");
  });
});

describe("prendaAlquilerSchema", () => {
  const { precio, stock, ...base } = prendaValida;
  void precio;
  void stock;
  const alquilerValido = { ...base, precio_por_dia: "12000" };

  it("acepta una prenda de alquiler válida", () => {
    expect(prendaAlquilerSchema.safeParse(alquilerValido).success).toBe(true);
  });

  it("rechaza un precio por día en cero", () => {
    expect(
      prendaAlquilerSchema.safeParse({ ...alquilerValido, precio_por_dia: "0" }).success,
    ).toBe(false);
  });

  it("rechaza si falta el precio por día", () => {
    expect(prendaAlquilerSchema.safeParse(base).success).toBe(false);
  });
});