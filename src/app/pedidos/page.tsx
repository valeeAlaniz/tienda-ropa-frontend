import type { Metadata } from "next";
import Link from "next/link";
import { requireToken } from "@/lib/auth";
import { ETIQUETA_ESTADO } from "@/lib/estadosPedido";
import { getMisPedidos } from "@/lib/pedidos";
import { formatearMoneda } from "@/utils/cartUtils";

export const metadata: Metadata = { title: "Mis pedidos" };

export default async function PedidosPage() {
  await requireToken();
  const pedidos = await getMisPedidos();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-5xl uppercase tracking-tight">Mis pedidos</h1>
      <p className="mt-2 text-sm text-muted">Tus compras y en qué estado está cada una.</p>

      {pedidos.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">Todavía no hiciste ninguna compra.</p>
          <Link
            href="/prendas"
            className="mt-6 inline-block rounded-md bg-accent px-6 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-80"
          >
            Ver prendas
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <Link
                href={`/pedidos/${pedido.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-accent"
              >
                <div>
                  <p className="font-medium">Pedido #{pedido.id}</p>
                  <p className="text-sm text-muted">
                    {new Date(pedido.fecha_venta).toLocaleDateString("es-AR")} ·{" "}
                    {pedido.tipo_entrega === "ENVIO" ? "Envío a domicilio" : "Retiro en sucursal"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatearMoneda(Number(pedido.monto_total))}</p>
                  <span className="rounded-full border border-border px-3 py-0.5 text-xs">
                    {ETIQUETA_ESTADO[pedido.estado]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
