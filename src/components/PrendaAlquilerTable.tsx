import Link from "next/link";
import DesactivarPrendaAlquiler from "@/components/DesactivarPrendaAlquiler";
import { formatearPrecio } from "@/components/PrendaCard";
import type { PrendaAlquiler } from "@/lib/types";

export default function PrendaAlquilerTable({
  prendas,
}: {
  prendas: PrendaAlquiler[];
}) {
  if (prendas.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        Todavía no hay prendas de alquiler. Creá la primera con el botón de arriba.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Talle</th>
            <th className="px-4 py-3">Precio por día</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {prendas.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium">{p.nombre}</td>
              <td className="px-4 py-3 text-muted">{p.categoria?.nombre ?? "-"}</td>
              <td className="px-4 py-3">{p.talle === "UNICO" ? "Único" : p.talle}</td>
              <td className="px-4 py-3">{formatearPrecio(p.precio_por_dia)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-0.5 text-xs ${
                    p.activo
                      ? "bg-accent text-accent-foreground"
                      : "border border-border text-muted"
                  }`}
                >
                  {p.activo ? "Activa" : "Inactiva"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-end gap-4">
                  <Link
                    href={`/dashboard/alquiler/editar/${p.id}`}
                    className="text-sm underline hover:opacity-70"
                  >
                    Editar
                  </Link>
                  {p.activo && <DesactivarPrendaAlquiler id={p.id} nombre={p.nombre} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
