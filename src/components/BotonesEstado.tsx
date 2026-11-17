"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OpcionEstado } from "@/lib/panelStaff";

type Props = {
  opciones: OpcionEstado[];
  accion: (estado: string) => Promise<{ ok: true } | { ok: false; error: string }>;
};

// Botones para pasar un pedido o un turno al estado siguiente.
export default function BotonesEstado({ opciones, accion }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  if (opciones.length === 0) {
    return <span className="text-xs text-muted">Sin acciones</span>;
  }

  function cambiar(opcion: OpcionEstado) {
    if (opcion.peligro && !window.confirm(`¿Seguro que querés ${opcion.etiqueta.toLowerCase()}?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await accion(opcion.estado);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-2">
        {opciones.map((o) => (
          <button
            key={o.estado}
            onClick={() => cambiar(o)}
            disabled={pendiente}
            className={
              o.peligro
                ? "px-3 py-1 text-sm text-red-600 hover:underline disabled:opacity-60"
                : "bg-accent px-3 py-1 text-sm text-accent-foreground hover:opacity-90 disabled:opacity-60"
            }
          >
            {o.etiqueta}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="max-w-xs text-right text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
