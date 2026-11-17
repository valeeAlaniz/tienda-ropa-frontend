import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editarPrenda } from "@/app/dashboard/prendas/actions";
import Cargando from "@/components/Cargando";
import PrendaForm from "@/components/PrendaForm";
import { getCategorias, getPrenda } from "@/lib/api";

async function Contenido({ id }: { id: string }) {
  const [prenda, categorias] = await Promise.all([getPrenda(id), getCategorias()]);

  if (!prenda) notFound();

  return (
    <PrendaForm
      categorias={categorias.filter((c) => c.activa !== false)}
      accion={editarPrenda.bind(null, Number(id))}
      valoresIniciales={{
        nombre: prenda.nombre,
        descripcion: prenda.descripcion,
        imagen: prenda.imagen,
        categoria: prenda.categoria === null ? "" : String(prenda.categoria),
        talle: prenda.talle,
        color: prenda.color,
        destacado: prenda.destacado,
        activo: prenda.activo,
        precio: prenda.precio,
        stock: String(prenda.stock),
      }}
      textoBoton="Guardar cambios"
    />
  );
}

export default async function EditarPrendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/dashboard/prendas" className="text-sm underline hover:opacity-70">
        ← Volver a prendas
      </Link>
      <h1 className="mb-8 mt-4 font-display text-4xl uppercase tracking-tight">
        Editar prenda
      </h1>
      <Suspense fallback={<Cargando texto="Cargando prenda..." />}>
        <Contenido id={id} />
      </Suspense>
    </main>
  );
}
