import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { CartProvider, useCart } from "./CartContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const vestido = { id: 1, nombre: "Vestido negro", precio: 10000, cantidad: 1, stock: 3 };

describe("CartContext", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.clearCart());
  });

  it("agrega una prenda y calcula el total", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(vestido);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.totalPrice).toBe(10000);
    expect(result.current.totalItems).toBe(1);
  });

  it("suma la cantidad si la prenda ya estaba", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(vestido);
      result.current.addToCart(vestido);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].cantidad).toBe(2);
    expect(result.current.totalPrice).toBe(20000);
  });

  it("no deja pasar el stock y avisa cuántas unidades agregó", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    let agregadas = -1;

    act(() => {
      result.current.addToCart({ ...vestido, cantidad: 2 });
      agregadas = result.current.addToCart({ ...vestido, cantidad: 5 });
    });

    expect(agregadas).toBe(1);
    expect(result.current.cart[0].cantidad).toBe(3);
  });

  it("cambia la cantidad sin pasar el stock", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(vestido);
      result.current.updateQuantity(1, 99);
    });

    expect(result.current.cart[0].cantidad).toBe(3);
  });

  it("quita una prenda y vacía el carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(vestido);
      result.current.addToCart({ ...vestido, id: 2, nombre: "Saco" });
      result.current.removeFromCart(1);
    });
    expect(result.current.cart.map((i) => i.id)).toEqual([2]);

    act(() => result.current.clearCart());
    expect(result.current.cart).toHaveLength(0);
  });

  it("guarda el carrito en localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(vestido);
    });

    const guardado = JSON.parse(window.localStorage.getItem("tienda-carrito") ?? "[]");
    expect(guardado).toHaveLength(1);
    expect(guardado[0].id).toBe(1);
  });
});
