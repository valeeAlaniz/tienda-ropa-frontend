import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editarPrendaAlquiler } from "@/app/dashboard/alquiler/actions";
import Cargando from "@/components/Cargando";
import PrendaAlquilerForm from "@/components/PrendaAlquilerForm";
import { getCategorias, getPrendaAlquiler } from "@/lib/api";

async function Contenido({ id }: { id: string }) {
  const [prenda, categorias] = await Promise.all([
    getPrendaAlquiler(id),
    getCategorias(),
  ]);

  if (!prenda) notFound();

  return (
    <PrendaAlquilerForm
      categorias={categorias.filter((c) => c.activa !== false)}
      accion={editarPrendaAlquiler.bind(null, Number(id))}
      valoresIniciales={{
        nombre: prenda.nombre,
        descripcion: prenda.descripcion,
        imagen: prenda.imagen,
        categoria: prenda.categoria ? String(prenda.categoria.id) : "",
        talle: prenda.talle,
        color: prenda.color,
        destacado: prenda.destacado,
        activo: prenda.activo,
        precio_por_dia: prenda.precio_por_dia,
      }}
      textoBoton="Guardar cambios"
    />
  );
}

export default async function EditarPrendaAlquilerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/dashboard/alquiler" className="text-sm underline hover:opacity-70">
        ← Volver a alquiler
      </Link>
      <h1 className="mb-8 mt-4 font-display text-4xl uppercase tracking-tight">
        Editar prenda de alquiler
      </h1>
      <Suspense fallback={<Cargando texto="Cargando prenda..." />}>
        <Contenido id={id} />
      </Suspense>
    </main>
  );
}
