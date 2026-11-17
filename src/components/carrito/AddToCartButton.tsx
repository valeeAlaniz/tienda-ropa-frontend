"use client";

import Link from "next/link";
import Button from "@/components/Button";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/ToastContext";
import type { PrendaDetalle } from "@/lib/types";

type Props = {
  prenda: Pick<PrendaDetalle, "id" | "nombre" | "precio" | "stock" | "talle" | "color" | "imagen">;
};

export default function AddToCartButton({ prenda }: Props) {
  const { cart, addToCart } = useCart();
  const toast = useToast();

  const enCarrito = cart.find((item) => item.id === prenda.id)?.cantidad ?? 0;
  const sinStock = prenda.stock <= 0;
  const todoEnCarrito = !sinStock && enCarrito >= prenda.stock;

  function agregar() {
    const agregadas = addToCart({
      id: prenda.id,
      nombre: prenda.nombre,
      precio: Number(prenda.precio),
      cantidad: 1,
      stock: prenda.stock,
      talle: prenda.talle,
      color: prenda.color,
      imagen: prenda.imagen || undefined,
    });

    if (agregadas === 0) {
      toast.warning("Ya tenés en el carrito todas las unidades disponibles.");
      return;
    }
    toast.success(`Agregaste ${prenda.nombre} al carrito.`);
  }

  return (
    <div className="mt-6">
      <Button onClick={agregar} disabled={sinStock || todoEnCarrito}>
        {sinStock
          ? "Sin stock"
          : todoEnCarrito
            ? "Ya tenés todo el stock en el carrito"
            : "Agregar al carrito"}
      </Button>

      {enCarrito > 0 && (
        <p role="status" className="mt-2 text-sm text-muted">
          Tenés {enCarrito} en el carrito.{" "}
          <Link href="/carrito" className="underline hover:text-foreground">
            Ver carrito
          </Link>
        </p>
      )}
    </div>
  );
}
