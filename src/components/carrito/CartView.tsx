"use client";

import Link from "next/link";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/ToastContext";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";

const botonPrincipal =
  "block w-full rounded-md bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground transition hover:opacity-80";

export function CartView() {
  const { cart, clearCart, totalPrice, totalItems } = useCart();
  const toast = useToast();

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="font-display text-5xl uppercase tracking-tight">Tu carrito está vacío</h1>
        <p className="mt-3 text-sm text-muted">Elegí una prenda del catálogo para empezar.</p>
        <Link
          href="/prendas"
          className="mt-6 inline-block rounded-md bg-accent px-6 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-80"
        >
          Ver prendas
        </Link>
      </main>
    );
  }

  function vaciar() {
    if (!window.confirm("¿Querés vaciar el carrito?")) return;
    clearCart();
    toast.success("Vaciaste el carrito.");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-5xl uppercase tracking-tight">Carrito</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted">
              {totalItems} {totalItems === 1 ? "prenda" : "prendas"}
            </span>
            <button
              type="button"
              onClick={vaciar}
              className="text-sm text-muted underline hover:text-foreground"
            >
              Vaciar carrito
            </button>
          </div>
          <ul>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        </section>

        <div className="h-fit space-y-4">
          <OrderSummary unidades={totalItems} total={totalPrice} />
          <Link href="/pedidos/checkout" className={botonPrincipal}>
            Finalizar compra
          </Link>
          <Link
            href="/prendas"
            className="block text-center text-sm text-muted underline hover:text-foreground"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
