import {
  ETIQUETA_ESTADO,
  pasosDelPedido,
  type EstadoPedido,
  type TipoEntrega,
} from "@/lib/estadosPedido";

type Props = { estado: EstadoPedido; tipoEntrega: TipoEntrega };

// Línea de progreso del pedido. El envío pasa por ENVIADO; el retiro no.
export default function ProgresoPedido({ estado, tipoEntrega }: Props) {
  if (estado === "CANCELADO") {
    return (
      <p
        role="status"
        className="rounded-md border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm"
      >
        Este pedido fue cancelado y las prendas volvieron al stock.
      </p>
    );
  }

  const pasos = pasosDelPedido(tipoEntrega);
  const actual = pasos.indexOf(estado);

  return (
    <ol className="flex w-full items-start" aria-label="Progreso del pedido">
      {pasos.map((paso, indice) => {
        const alcanzado = indice <= actual;
        const esActual = indice === actual;

        return (
          <li
            key={paso}
            aria-current={esActual ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center gap-2 text-center"
          >
            {indice > 0 && (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-3 h-0.5 w-full ${
                  alcanzado ? "bg-accent" : "bg-border"
                }`}
              />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 grid h-6 w-6 place-items-center rounded-full border text-xs ${
                alcanzado
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted"
              }`}
            >
              {alcanzado ? "✓" : ""}
            </span>
            <span className={`text-xs ${esActual ? "font-medium" : "text-muted"}`}>
              {ETIQUETA_ESTADO[paso]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
