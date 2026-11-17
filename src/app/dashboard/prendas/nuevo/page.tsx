import { Suspense } from "react";
import Link from "next/link";
import { crearPrenda } from "@/app/dashboard/prendas/actions";
import Cargando from "@/components/Cargando";
import PrendaForm from "@/components/PrendaForm";
import { getCategorias } from "@/lib/api";

async function Contenido() {
  const categorias = await getCategorias();

  return (
    <PrendaForm
      categorias={categorias.filter((c) => c.activa !== false)}
      accion={crearPrenda}
      textoBoton="Crear prenda"
    />
  );
}

export default function NuevaPrendaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/dashboard/prendas" className="text-sm underline hover:opacity-70">
        ← Volver a prendas
      </Link>
      <h1 className="mb-8 mt-4 font-display text-4xl uppercase tracking-tight">
        Nueva prenda
      </h1>
      <Suspense fallback={<Cargando texto="Cargando formulario..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}
