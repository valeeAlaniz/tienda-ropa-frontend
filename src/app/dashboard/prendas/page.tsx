import { Suspense } from "react";
import Link from "next/link";
import Cargando from "@/components/Cargando";
import PrendaTable from "@/components/PrendaTable";
import { getPrendas } from "@/lib/api";

async function Contenido() {
  // Con el token de staff, el back devuelve también las prendas inactivas
  const prendas = await getPrendas();
  return <PrendaTable prendas={prendas} />;
}

export default function DashboardPrendasPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl uppercase tracking-tight">Prendas</h1>
        <Link
          href="/dashboard/prendas/nuevo"
          className="bg-accent px-6 py-2 text-sm font-semibold uppercase tracking-widest text-accent-foreground hover:opacity-90"
        >
          Nueva prenda
        </Link>
      </div>
      <Suspense fallback={<Cargando texto="Cargando prendas..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}
