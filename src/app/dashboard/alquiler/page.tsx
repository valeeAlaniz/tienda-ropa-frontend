import { Suspense } from "react";
import Link from "next/link";
import Cargando from "@/components/Cargando";
import DashboardTabs from "@/components/DashboardTabs";
import PrendaAlquilerTable from "@/components/PrendaAlquilerTable";
import { getPrendasAlquiler } from "@/lib/api";

async function Contenido() {
  // Con el token de staff, el back devuelve también las inactivas
  const prendas = await getPrendasAlquiler();
  return <PrendaAlquilerTable prendas={prendas} />;
}

export default function DashboardAlquilerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <DashboardTabs actual="alquiler" />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl uppercase tracking-tight">Alquiler</h1>
        <Link
          href="/dashboard/alquiler/nuevo"
          className="bg-accent px-6 py-2 text-sm font-semibold uppercase tracking-widest text-accent-foreground hover:opacity-90"
        >
          Nueva prenda de alquiler
        </Link>
      </div>
      <Suspense fallback={<Cargando texto="Cargando prendas de alquiler..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}
