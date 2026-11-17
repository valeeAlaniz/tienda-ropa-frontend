import Link from "next/link";
import PrendaImage from "@/components/PrendaImage";
import { formatearPrecio } from "@/components/PrendaCard";
import type { PrendaAlquiler } from "@/lib/types";

export default function PrendaAlquilerCard({ prenda }: { prenda: PrendaAlquiler }) {
  return (
    <Link
      href={`/alquiler/${prenda.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
    >
      <div className="relative">
        <PrendaImage
          imagen={prenda.imagen}
          nombre={prenda.nombre}
          className="aspect-[3/4] w-full rounded-none"
        />
        {prenda.destacado && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-accent-foreground">
            Destacado
          </span>
        )}
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
          {formatearPrecio(prenda.precio_por_dia)}
          <span className="text-sm font-normal text-muted"> / día</span>
        </p>
      </div>
    </Link>
  );
}
