import { Suspense } from "react";
import { cambiarEstadoPedido } from "@/app/dashboard/pedidos/actions";
import BotonesEstado from "@/components/BotonesEstado";
import Cargando from "@/components/Cargando";
import DashboardTabs from "@/components/DashboardTabs";
import { formatearPrecio } from "@/components/PrendaCard";
import { ETIQUETA_ESTADO } from "@/lib/estadosPedido";
import { transicionesPedido } from "@/lib/panelStaff";
import { getMisPedidos } from "@/lib/pedidos";

export const metadata = { title: "Panel · Pedidos" };

async function Contenido() {
  // Con el token de staff, el back devuelve los pedidos de todos los clientes
  const pedidos = await getMisPedidos();

  if (pedidos.length === 0) {
    return <p className="py-16 text-center text-muted">Todavía no hay pedidos.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-widest text-muted">
          <tr>
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Entrega</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pedidos.map((p) => (
            <tr key={p.id} className="align-top">
              <td className="px-4 py-3">
                <p className="font-medium">#{p.id}</p>
                <details className="mt-1 text-xs text-muted">
                  <summary className="cursor-pointer">
                    {p.detalles_pedido.length} prenda
                    {p.detalles_pedido.length === 1 ? "" : "s"}
                  </summary>
                  <ul className="mt-1 space-y-0.5">
                    {p.detalles_pedido.map((d) => (
                      <li key={d.id}>
                        {d.cantidad} × {d.prenda_nombre}
                      </li>
                    ))}
                  </ul>
                </details>
              </td>
              <td className="px-4 py-3">
                {new Date(p.fecha_venta).toLocaleDateString("es-AR")}
              </td>
              <td className="px-4 py-3 text-muted">Cliente #{p.cliente}</td>
              <td className="px-4 py-3">
                {p.tipo_entrega === "ENVIO" ? "Envío" : "Retiro en sucursal"}
              </td>
              <td className="px-4 py-3">{formatearPrecio(p.monto_total)}</td>
              <td className="px-4 py-3">
                <span className="rounded-full border border-border px-3 py-0.5 text-xs">
                  {ETIQUETA_ESTADO[p.estado]}
                </span>
              </td>
              <td className="px-4 py-3">
                <BotonesEstado
                  opciones={transicionesPedido(p.estado, p.tipo_entrega)}
                  accion={cambiarEstadoPedido.bind(null, p.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPedidosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <DashboardTabs actual="pedidos" />
      <h1 className="mb-8 font-display text-4xl uppercase tracking-tight">Pedidos</h1>
      <Suspense fallback={<Cargando texto="Cargando pedidos..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}
