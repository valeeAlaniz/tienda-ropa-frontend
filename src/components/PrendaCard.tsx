import Link from "next/link";
import PrendaImage from "@/components/PrendaImage";
import type { Prenda } from "@/lib/types";

export function formatearPrecio(valor: string) {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function PrendaCard({ prenda }: { prenda: Prenda }) {
  return (
    <Link
      href={`/prendas/${prenda.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
    >
      <div className="relative">
        <PrendaImage
          imagen={prenda.imagen}
          nombre={prenda.nombre}
          className="aspect-[3/4] w-full rounded-none"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {prenda.destacado && (
            <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-accent-foreground">
              Destacado
            </span>
          )}
          {prenda.stock === 0 && (
            <span className="rounded-full border border-border bg-card px-3 py-0.5 text-xs">
              Sin stock
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {prenda.categoria && (
          <p className="text-xs uppercase tracking-widest text-muted">
            {prenda.categoria.nombre}
          </p>
        )}
        <h3 className="mt-1 font-display text-xl uppercase tracking-tight">{prenda.nombre}</h3>
        <p className="text-sm text-muted">
          Talle {prenda.talle === "UNICO" ? "único" : prenda.talle} · {prenda.color}
        </p>
        <p className="mt-auto pt-3 text-lg font-medium text-accent">
          {formatearPrecio(prenda.precio)}
        </p>
      </div>
    </Link>
  );
}
