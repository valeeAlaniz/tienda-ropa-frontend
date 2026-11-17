import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrendaImage from "@/components/PrendaImage";
import { formatearPrecio } from "@/components/PrendaCard";
import { getCategorias, getPrenda } from "@/lib/api";

async function Contenido({ id }: { id: string }) {
  const [prenda, categorias] = await Promise.all([
    getPrenda(id),
    getCategorias(),
  ]);

  if (!prenda) notFound();

  const categoria = categorias.find((c) => c.id === prenda.categoria);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <PrendaImage
        imagen={prenda.imagen}
        nombre={prenda.nombre}
        className="aspect-[3/4] w-full max-w-md"
      />

      <div>
        {categoria && (
          <p className="text-xs uppercase tracking-wide text-muted">
            {categoria.nombre}
          </p>
        )}
        <h1 className="mt-1 font-display text-5xl uppercase tracking-tight">{prenda.nombre}</h1>
        <p className="mt-3 text-2xl">{formatearPrecio(prenda.precio)}</p>
        <p className="mt-6 opacity-80">{prenda.descripcion}</p>

        <dl className="mt-6 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted">Talle</dt>
          <dd>{prenda.talle === "UNICO" ? "Único" : prenda.talle}</dd>
          <dt className="text-muted">Color</dt>
          <dd>{prenda.color}</dd>
        </dl>

        <p className="mt-6 text-sm text-muted">
          {prenda.stock > 0
            ? `${prenda.stock} unidades disponibles`
            : "Sin stock por el momento"}
        </p>

        {/* Marcos A agrega acá el botón "Agregar al carrito" (AddToCartButton) */}
      </div>
    </div>
  );
}

export default async function PrendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/prendas" className="text-sm underline hover:text-muted">
        ← Volver a prendas
      </Link>
      <div className="mt-8">
        <Suspense
          fallback={
            <div role="status" className="py-16 text-center text-sm text-muted">
              Cargando prenda...
            </div>
          }
        >
          <Contenido id={id} />
        </Suspense>
      </div>
    </main>
  );
}
