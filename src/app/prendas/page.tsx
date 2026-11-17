import { Suspense } from "react";
import PrendaCard from "@/components/PrendaCard";
import PrendaFilters from "@/components/PrendaFilters";
import { getCategorias, getPrendas } from "@/lib/api";

type ParametrosBusqueda = {
  search?: string;
  categoria?: string;
  talle?: string;
  ordering?: string;
};

function Cargando({ texto }: { texto: string }) {
  return (
    <div role="status" className="py-16 text-center text-sm text-muted">
      {texto}
    </div>
  );
}

async function BarraDeFiltros() {
  const categorias = await getCategorias();
  return <PrendaFilters categorias={categorias} />;
}

async function Contenido({ filtros }: { filtros: ParametrosBusqueda }) {
  const prendas = await getPrendas({
    activo: "true",
    search: filtros.search,
    categoria: filtros.categoria,
    talle: filtros.talle,
    ordering: filtros.ordering,
  });

  if (prendas.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        No encontramos prendas con esos filtros.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {prendas.map((prenda) => (
        <PrendaCard key={prenda.id} prenda={prenda} />
      ))}
    </div>
  );
}

export default async function PrendasPage({
  searchParams,
}: {
  searchParams: Promise<ParametrosBusqueda>;
}) {
  const filtros = await searchParams;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-5xl font-medium">Prendas</h1>
      <p className="mt-2 text-sm text-muted">Ropa para comprar.</p>

      <div className="mt-8">
        <Suspense fallback={<div className="h-10" />}>
          <BarraDeFiltros />
        </Suspense>
      </div>

      <div className="mt-10">
        <Suspense
          key={JSON.stringify(filtros)}
          fallback={<Cargando texto="Cargando prendas..." />}
        >
          <Contenido filtros={filtros} />
        </Suspense>
      </div>
    </main>
  );
}
