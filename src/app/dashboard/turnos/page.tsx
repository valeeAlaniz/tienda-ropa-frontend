import { Suspense } from "react";
import Link from "next/link";
import { cambiarEstadoTurno } from "@/app/dashboard/turnos/actions";
import BotonesEstado from "@/components/BotonesEstado";
import Cargando from "@/components/Cargando";
import DashboardTabs from "@/components/DashboardTabs";
import { transicionesTurno } from "@/lib/panelStaff";
import { getMisTurnos, type EstadoTurno, type TipoTurno } from "@/lib/turnos";

export const metadata = { title: "Panel · Turnos" };

const TIPOS: Record<TipoTurno, string> = {
  PRUEBA: "Prueba",
  RETIRO: "Retiro",
  DEVOLUCION: "Devolución",
};

const ESTADOS: Record<EstadoTurno, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
  COMPLETADO: "Completado",
};

function formatearFecha(fecha: string) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function Contenido({ estado }: { estado?: string }) {
  // Con el token de staff, el back devuelve los turnos de todos los clientes
  const todos = await getMisTurnos();
  const turnos = todos
    .filter((t) => !estado || t.estado === estado)
    .sort((a, b) => `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`));

  if (turnos.length === 0) {
    return (
      <p className="py-16 text-center text-muted">No hay turnos para mostrar.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Hora</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Sucursal</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {turnos.map((t) => (
            <tr key={t.id} className="align-top">
              <td className="px-4 py-3 capitalize">{formatearFecha(t.fecha)}</td>
              <td className="px-4 py-3">{t.hora.slice(0, 5)}</td>
              <td className="px-4 py-3">{TIPOS[t.tipo]}</td>
              <td className="px-4 py-3 text-muted">{t.sucursal_nombre}</td>
              <td className="px-4 py-3 text-muted">Cliente #{t.cliente}</td>
              <td className="px-4 py-3">
                <span className="rounded-full border border-border px-3 py-0.5 text-xs">
                  {ESTADOS[t.estado]}
                </span>
              </td>
              <td className="px-4 py-3">
                <BotonesEstado
                  opciones={transicionesTurno(t.estado)}
                  accion={cambiarEstadoTurno.bind(null, t.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function DashboardTurnosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const chip = "rounded-full px-3 py-1 text-xs";

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <DashboardTabs actual="turnos" />
      <h1 className="mb-4 font-display text-4xl uppercase tracking-tight">Turnos</h1>

      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar por estado">
        <Link
          href="/dashboard/turnos"
          className={`${chip} ${!estado ? "bg-accent text-accent-foreground" : "border border-border"}`}
        >
          Todos
        </Link>
        {(Object.keys(ESTADOS) as EstadoTurno[]).map((e) => (
          <Link
            key={e}
            href={`/dashboard/turnos?estado=${e}`}
            className={`${chip} ${estado === e ? "bg-accent text-accent-foreground" : "border border-border"}`}
          >
            {ESTADOS[e]}
          </Link>
        ))}
      </div>

      <Suspense key={estado ?? "todos"} fallback={<Cargando texto="Cargando turnos..." />}>
        <Contenido estado={estado} />
      </Suspense>
    </main>
  );
}
