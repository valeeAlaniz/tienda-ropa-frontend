import { Suspense } from "react";
import Link from "next/link";
import { crearPrendaAlquiler } from "@/app/dashboard/alquiler/actions";
import Cargando from "@/components/Cargando";
import PrendaAlquilerForm from "@/components/PrendaAlquilerForm";
import { getCategorias } from "@/lib/api";

async function Contenido() {
  const categorias = await getCategorias();

  return (
    <PrendaAlquilerForm
      categorias={categorias.filter((c) => c.activa !== false)}
      accion={crearPrendaAlquiler}
      textoBoton="Crear prenda de alquiler"
    />
  );
}

export default function NuevaPrendaAlquilerPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/dashboard/alquiler" className="text-sm underline hover:opacity-70">
        ← Volver a alquiler
      </Link>
      <h1 className="mb-8 mt-4 font-display text-4xl uppercase tracking-tight">
        Nueva prenda de alquiler
      </h1>
      <Suspense fallback={<Cargando texto="Cargando formulario..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}
