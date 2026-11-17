"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  calcularCantidadTotal,
  calcularTotalCarrito,
  type CartItemType,
} from "@/utils/cartUtils";

export type { CartItemType };

// El carrito vive en localStorage para que no se pierda al recargar o al ir a iniciar sesión.
// Se lee con useSyncExternalStore: en el servidor siempre arranca vacío y no hay desajuste al hidratar.
const STORAGE_KEY = "tienda-carrito";
const VACIO: CartItemType[] = [];

const oyentes = new Set<() => void>();
let cache: CartItemType[] | null = null;

function esItemValido(valor: unknown): valor is CartItemType {
  if (!valor || typeof valor !== "object") return false;
  const item = valor as Record<string, unknown>;
  return (
    Number.isInteger(item.id) &&
    typeof item.nombre === "string" &&
    typeof item.precio === "number" &&
    Number.isInteger(item.cantidad) &&
    (item.cantidad as number) > 0 &&
    Number.isInteger(item.stock)
  );
}

function leer(): CartItemType[] {
  if (cache === null) {
    try {
      const crudo = window.localStorage.getItem(STORAGE_KEY);
      const datos: unknown = crudo ? JSON.parse(crudo) : [];
      cache = Array.isArray(datos) ? datos.filter(esItemValido) : [];
    } catch {
      cache = [];
    }
  }
  return cache;
}

function escribir(items: CartItemType[]) {
  cache = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Sin localStorage (modo privado, cuota): el carrito sigue funcionando en memoria.
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);

  // Si el carrito cambia en otra pestaña, se vuelve a leer.
  const alCambiarStorage = (evento: StorageEvent) => {
    if (evento.key === STORAGE_KEY || evento.key === null) {
      cache = null;
      avisar();
    }
  };
  window.addEventListener("storage", alCambiarStorage);

  return () => {
    oyentes.delete(avisar);
    window.removeEventListener("storage", alCambiarStorage);
  };
}

/** Agrega unidades sin pasar el stock. Devuelve cuántas se agregaron realmente. */
function agregar(item: CartItemType): number {
  const actual = leer();
  const existente = actual.find((i) => i.id === item.id);
  const enCarrito = existente?.cantidad ?? 0;
  const agregadas = Math.max(0, Math.min(item.cantidad, item.stock - enCarrito));

  if (agregadas === 0) return 0;

  escribir(
    existente
      ? actual.map((i) =>
          i.id === item.id
            ? { ...i, cantidad: i.cantidad + agregadas, precio: item.precio, stock: item.stock }
            : i,
        )
      : [...actual, { ...item, cantidad: agregadas }],
  );
  return agregadas;
}

function quitar(id: number) {
  escribir(leer().filter((i) => i.id !== id));
}

function cambiarCantidad(id: number, cantidad: number) {
  if (!Number.isFinite(cantidad)) return;
  escribir(
    leer().map((i) =>
      i.id === id
        ? { ...i, cantidad: Math.min(Math.max(1, Math.floor(cantidad)), i.stock) }
        : i,
    ),
  );
}

function vaciar() {
  escribir([]);
}

type CartContextType = {
  cart: CartItemType[];
  addToCart: (item: CartItemType) => number;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(suscribir, leer, () => VACIO);

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      addToCart: agregar,
      removeFromCart: quitar,
      updateQuantity: cambiarCantidad,
      clearCart: vaciar,
      totalPrice: calcularTotalCarrito(cart),
      totalItems: calcularCantidadTotal(cart),
    }),
    [cart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
