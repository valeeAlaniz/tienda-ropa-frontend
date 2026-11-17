"use client";

import PrendaImage from "@/components/PrendaImage";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatearMoneda, type CartItemType } from "@/utils/cartUtils";

const botonCantidad =
  "grid h-8 w-8 place-items-center rounded-md border border-border text-base transition hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-40";

export function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCart();
  const toast = useToast();

  const detalle = [item.talle && `Talle ${item.talle === "UNICO" ? "único" : item.talle}`, item.color]
    .filter(Boolean)
    .join(" · ");

  function cambiar(cantidad: number) {
    if (cantidad > item.stock) {
      toast.warning(`No hay más unidades de ${item.nombre}.`);
      return;
    }
    updateQuantity(item.id, cantidad);
  }

  function quitar() {
    removeFromCart(item.id);
    toast.success(`Quitaste ${item.nombre} del carrito.`);
  }

  return (
    <li className="flex gap-4 border-b border-border py-4 last:border-b-0">
      <PrendaImage
        imagen={item.imagen ?? ""}
        nombre={item.nombre}
        className="h-24 w-20 shrink-0 text-2xl"
      />

      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row">
        <div>
          <h3 className="font-medium">{item.nombre}</h3>
          {detalle && <p className="text-sm text-muted">{detalle}</p>}
          <p className="mt-1 text-sm text-muted">{formatearMoneda(item.precio)} c/u</p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => cambiar(item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              aria-label={`Quitar una unidad de ${item.nombre}`}
              className={botonCantidad}
            >
              −
            </button>
            <span aria-live="polite" className="min-w-6 text-center text-sm">
              {item.cantidad}
            </span>
            <button
              type="button"
              onClick={() => cambiar(item.cantidad + 1)}
              aria-label={`Agregar una unidad de ${item.nombre}`}
              className={botonCantidad}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-lg font-medium">{formatearMoneda(item.precio * item.cantidad)}</p>
          <button
            type="button"
            onClick={quitar}
            className="text-sm text-muted underline hover:text-foreground"
          >
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
}
