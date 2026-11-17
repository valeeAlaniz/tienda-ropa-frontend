import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CancelarPedidoButton from "@/components/pedidos/CancelarPedidoButton";
import ProgresoPedido from "@/components/pedidos/ProgresoPedido";
import { requireToken } from "@/lib/auth";
import { ETIQUETA_ESTADO, puedeCancelarElCliente } from "@/lib/estadosPedido";
import { getDirecciones, getPedido, type Direccion } from "@/lib/pedidos";
import { getSucursales, type Sucursal } from "@/lib/turnos";
import { formatearMoneda } from "@/utils/cartUtils";

export const metadata: Metadata = { title: "Detalle del pedido" };

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireToken();
  const { id } = await params;

  // Si el pedido es de otro cliente, el back responde 404 y acá se muestra "no encontrado".
  const pedido = await getPedido(id);
  if (!pedido) notFound();

  const [sucursales, direcciones] = await Promise.all([
    pedido.tipo_entrega === "RETIRO"
      ? getSucursales().catch((): Sucursal[] => [])
      : Promise.resolve<Sucursal[]>([]),
    pedido.tipo_entrega === "ENVIO"
      ? getDirecciones().catch((): Direccion[] => [])
      : Promise.resolve<Direccion[]>([]),
  ]);

  const sucursal = sucursales.find((s) => s.id === pedido.sucursal_retiro);
  const direccion = direcciones.find((d) => d.id === pedido.direccion_envio);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/pedidos" className="text-sm underline hover:text-muted">
        ← Volver a mis pedidos
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl uppercase tracking-tight">Pedido #{pedido.id}</h1>
          <p className="mt-1 text-sm text-muted">
            {new Date(pedido.fecha_venta).toLocaleDateString("es-AR")}
          </p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-sm">
          {ETIQUETA_ESTADO[pedido.estado]}
        </span>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <ProgresoPedido estado={pedido.estado} tipoEntrega={pedido.tipo_entrega} />
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl uppercase tracking-tight">Prendas</h2>
        <ul className="mt-3 grid gap-2">
          {pedido.detalles_pedido.map((detalle) => (
            <li
              key={detalle.id}
              className="flex justify-between gap-3 border-b border-border pb-2 text-sm last:border-b-0"
            >
              <span>
                {detalle.prenda_nombre} <span className="text-muted">× {detalle.cantidad}</span>
              </span>
              <span>{formatearMoneda(Number(detalle.precio_unitario) * detalle.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>{formatearMoneda(Number(pedido.monto_total))}</span>
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm">
        <h2 className="font-display text-2xl uppercase tracking-tight">Entrega y pago</h2>
        <p className="mt-3">
          {pedido.tipo_entrega === "RETIRO"
            ? `Retiro en sucursal${sucursal ? `: ${sucursal.nombre}, ${sucursal.direccion}, ${sucursal.ciudad}` : ""}`
            : `Envío a domicilio${direccion ? `: ${direccion.calle} ${direccion.numero}, ${direccion.ciudad}` : ""}`}
        </p>
        <p className="mt-2 text-muted">
          {pedido.pago
            ? `Pago por ${pedido.pago.metodo.toLowerCase()}: ${pedido.pago.aprobado ? "aprobado" : "pendiente"}`
            : "Pago pendiente de confirmación"}
        </p>
      </section>

      {puedeCancelarElCliente(pedido.estado) && (
        <div className="mt-6">
          <CancelarPedidoButton id={pedido.id} />
        </div>
      )}
    </main>
  );
}
