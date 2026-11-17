"use client";

import { useState, useTransition } from "react";
import { cancelarMiTurno } from "@/app/turnos/actions";
import Button from "@/components/Button";
import type { EstadoTurno, Turno, TipoTurno } from "@/lib/turnos";

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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TurnoCard({ turno }: { turno: Turno }) {
  const [error, setError] = useState<string | null>(null);
  const [cancelando, iniciar] = useTransition();

  const puedeCancelar =
    turno.estado === "PENDIENTE" || turno.estado === "CONFIRMADO";

  function cancelar() {
    if (!window.confirm("¿Querés cancelar este turno?")) return;
    setError(null);
    iniciar(async () => {
      const resultado = await cancelarMiTurno(turno.id);
      if (!resultado.ok) setError(resultado.error);
    });
  }

  return (
    <li className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {TIPOS[turno.tipo]}
          </p>
          <p className="mt-1 text-lg font-medium capitalize">
            {formatearFecha(turno.fecha)} · {turno.hora.slice(0, 5)}
          </p>
          <p className="text-sm text-muted">{turno.sucursal_nombre}</p>
        </div>
        <span className="rounded-full border border-border px-3 py-0.5 text-xs">
          {ESTADOS[turno.estado]}
        </span>
      </div>

      {puedeCancelar && (
        <div className="mt-4">
          <Button variant="secondary" onClick={cancelar} disabled={cancelando}>
            {cancelando ? "Cancelando..." : "Cancelar turno"}
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </li>
  );
}