import { describe, expect, it } from "vitest";
import {
  calcularCantidadTotal,
  calcularTotalCarrito,
  formatearMoneda,
  type CartItemType,
} from "./cartUtils";

const vestido: CartItemType = { id: 1, nombre: "Vestido negro", precio: 10000, cantidad: 1, stock: 5 };
const saco: CartItemType = { id: 2, nombre: "Saco de lino", precio: 25000, cantidad: 2, stock: 4 };

describe("calcularTotalCarrito", () => {
  it("suma precio por cantidad de cada prenda", () => {
    // 10000 × 1 + 25000 × 2
    expect(calcularTotalCarrito([vestido, saco])).toBe(60000);
  });

  it("devuelve 0 si el carrito está vacío", () => {
    expect(calcularTotalCarrito([])).toBe(0);
  });

  it("no arrastra errores de coma flotante", () => {
    const items: CartItemType[] = [
      { id: 1, nombre: "A", precio: 0.1, cantidad: 3, stock: 9 },
    ];
    expect(calcularTotalCarrito(items)).toBe(0.3);
  });
});

describe("calcularCantidadTotal", () => {
  it("suma las unidades de todas las prendas", () => {
    expect(calcularCantidadTotal([vestido, saco])).toBe(3);
  });

  it("devuelve 0 si el carrito está vacío", () => {
    expect(calcularCantidadTotal([])).toBe(0);
  });
});

describe("formatearMoneda", () => {
  it("usa separador de miles argentino y no muestra centavos si no hay", () => {
    expect(formatearMoneda(1500)).toMatch(/1\.500$/);
  });

  it("muestra dos decimales cuando hay centavos", () => {
    expect(formatearMoneda(10000.5)).toMatch(/10\.000,50$/);
  });
});
