import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import Cargando from "@/components/Cargando";
import DashboardTabs from "@/components/DashboardTabs";
import { formatearPrecio } from "@/components/PrendaCard";
import { getPrendas, getPrendasAlquiler } from "@/lib/api";
import { ETIQUETA_ESTADO } from "@/lib/estadosPedido";
import { getMisPedidos } from "@/lib/pedidos";
import { getMisTurnos } from "@/lib/turnos";

export const metadata = { title: "Panel · Resumen" };

const STOCK_BAJO = 5;

// Si una lista falla, el resumen sigue mostrándose con el resto.
async function intentar<T>(promesa: Promise<T[]>): Promise<T[]> {
  try {
    return await promesa;
  } catch {
    return [];
  }
}

function Tarjeta({
  titulo,
  valor,
  detalle,
  href,
}: {
  titulo: string;
  valor: number;
  detalle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent"
    >
      <p className="text-xs uppercase tracking-widest text-muted">{titulo}</p>
      <p className="mt-2 font-display text-5xl">{valor}</p>
      <p className="mt-1 text-xs text-muted">{detalle}</p>
    </Link>
  );
}

const fila =
  "flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm hover:border-accent";

async function Contenido() {
  const usuario = (await cookies()).get("usuario")?.value;
  const [prendas, alquiler, pedidos, turnos] = await Promise.all([
    intentar(getPrendas()),
    intentar(getPrendasAlquiler()),
    intentar(getMisPedidos()),
    intentar(getMisTurnos()),
  ]);

  const hoy = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Cordoba",
  });

  const activas = prendas.filter((p) => p.activo);
  const sinStock = activas.filter((p) => p.stock === 0).length;
  const stockBajo = activas.filter((p) => p.stock > 0 && p.stock <= STOCK_BAJO).length;
  const alquilerActivo = alquiler.filter((p) => p.activo).length;
  const pedidosPendientes = pedidos.filter((p) => p.estado === "PENDIENTE").length;
  const turnosPendientes = turnos.filter((t) => t.estado === "PENDIENTE").length;
  const turnosHoy = turnos.filter(
    (t) => t.fecha === hoy && (t.estado === "PENDIENTE" || t.estado === "CONFIRMADO"),
  ).length;

  const paraReponer = activas
    .filter((p) => p.stock <= STOCK_BAJO)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const ultimosPedidos = [...pedidos]
    .sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta))
    .slice(0, 5);

  const proximosTurnos = turnos
    .filter(
      (t) => t.fecha >= hoy && (t.estado === "PENDIENTE" || t.estado === "CONFIRMADO"),
    )
    .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
    .slice(0, 5);

  return (
    <>
      <p className="mt-2 text-sm text-muted">
        {usuario ? `Hola, ${usuario}. ` : ""}Este es el resumen de la tienda.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta
          titulo="Prendas"
          valor={activas.length}
          detalle="activas en la tienda"
          href="/dashboard/prendas"
        />
        <Tarjeta
          titulo="Stock bajo"
          valor={stockBajo}
          detalle={`quedan ${STOCK_BAJO} o menos`}
          href="/dashboard/prendas"
        />
        <Tarjeta
          titulo="Sin stock"
          valor={sinStock}
          detalle="para reponer"
          href="/dashboard/prendas"
        />
        <Tarjeta
          titulo="Alquiler"
          valor={alquilerActivo}
          detalle="prendas para alquilar"
          href="/dashboard/alquiler"
        />
        <Tarjeta
          titulo="Pedidos"
          valor={pedidos.length}
          detalle="en total"
          href="/dashboard/pedidos"
        />
        <Tarjeta
          titulo="Pedidos pendientes"
          valor={pedidosPendientes}
          detalle="esperando confirmación"
          href="/dashboard/pedidos"
        />
        <Tarjeta
          titulo="Turnos hoy"
          valor={turnosHoy}
          detalle="pendientes o confirmados"
          href="/dashboard/turnos"
        />
        <Tarjeta
          titulo="Turnos pendientes"
          valor={turnosPendientes}
          detalle="por confirmar"
          href="/dashboard/turnos?estado=PENDIENTE"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/dashboard/prendas/nuevo"
          className="bg-accent px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-accent-foreground hover:opacity-90"
        >
          Nueva prenda
        </Link>
        <Link
          href="/dashboard/alquiler/nuevo"
          className="border border-border px-6 py-2.5 text-sm uppercase tracking-widest hover:border-accent"
        >
          Nueva prenda de alquiler
        </Link>
        <Link
          href="/prendas"
          className="border border-border px-6 py-2.5 text-sm uppercase tracking-widest hover:border-accent"
        >
          Ver la tienda
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section>
          <h2 className="mb-4 font-display text-2xl uppercase tracking-tight">
            Prendas para reponer
          </h2>
          {paraReponer.length === 0 ? (
            <p className="text-sm text-muted">Todo el stock está en buen nivel.</p>
          ) : (
            <ul className="grid gap-2">
              {paraReponer.map((p) => (
                <li key={p.id}>
                  <Link href={`/dashboard/prendas/editar/${p.id}`} className={fila}>
                    <span>{p.nombre}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-muted">{formatearPrecio(p.precio)}</span>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs ${
                          p.stock === 0
                            ? "bg-red-600 text-white"
                            : "border border-border"
                        }`}
                      >
                        {p.stock === 0 ? "Sin stock" : `${p.stock} u.`}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl uppercase tracking-tight">
            Últimos pedidos
          </h2>
          {ultimosPedidos.length === 0 ? (
            <p className="text-sm text-muted">Todavía no hay pedidos.</p>
          ) : (
            <ul className="grid gap-2">
              {ultimosPedidos.map((p) => (
                <li key={p.id}>
                  <Link href="/dashboard/pedidos" className={fila}>
                    <span>
                      #{p.id} · {new Date(p.fecha_venta).toLocaleDateString("es-AR")}
                    </span>
                    <span className="flex items-center gap-3">
                      <span>{formatearPrecio(p.monto_total)}</span>
                      <span className="rounded-full border border-border px-3 py-0.5 text-xs">
                        {ETIQUETA_ESTADO[p.estado]}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl uppercase tracking-tight">
            Próximos turnos
          </h2>
          {proximosTurnos.length === 0 ? (
            <p className="text-sm text-muted">No hay turnos próximos.</p>
          ) : (
            <ul className="grid gap-2">
              {proximosTurnos.map((t) => (
                <li key={t.id}>
                  <Link href="/dashboard/turnos" className={fila}>
                    <span>
                      {new Date(`${t.fecha}T00:00:00`).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {t.hora.slice(0, 5)}
                    </span>
                    <span className="text-muted">{t.sucursal_nombre}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <DashboardTabs actual="resumen" />
      <h1 className="font-display text-4xl uppercase tracking-tight">
        Panel de administración
      </h1>
      <Suspense fallback={<Cargando texto="Cargando el resumen..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}
