import { formatearMoneda } from "@/utils/cartUtils";

type Props = { unidades: number; total: number };

// Sin hooks ni estado: recibe los datos por props y los muestra.
// El total es una estimación: el back lo vuelve a calcular con los precios vigentes.
export function OrderSummary({ unidades, total }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-2xl uppercase tracking-tight">Resumen</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Prendas</dt>
          <dd>{unidades}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-lg font-medium">
          <dt>Total</dt>
          <dd>{formatearMoneda(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
