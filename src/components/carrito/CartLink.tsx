"use client";

import Link from "next/link";
import { useCart } from "@/context/cart/CartContext";

// Acceso al carrito con el contador de unidades. Va en la barra de navegación.
export default function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito, ${totalItems} ${totalItems === 1 ? "unidad" : "unidades"}`}
      className="relative inline-flex items-center rounded-md border border-foreground/30 px-3 py-2 text-sm font-medium transition hover:bg-foreground/10"
    >
      Carrito
      {totalItems > 0 && (
        <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-medium text-accent-foreground">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
