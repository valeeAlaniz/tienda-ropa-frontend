"use client";

import { useEffect, useState } from "react";
import { mensajeDeError } from "@/lib/errores";

type Props = {
  sucursal: string;
  fecha: string;
  value: string;
  onChange: (hora: string) => void;
  /** Cambiarlo fuerza a volver a pedir los horarios */
  version?: number;
};

type Resultado = { clave: string; horarios: string[]; error: string | null };

export default function SelectorHorario({
  sucursal,
  fecha,
  value,
  onChange,
  version = 0,
}: Props) {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const clave = `${sucursal}|${fecha}|${version}`;
  const listo = Boolean(sucursal && fecha);

  useEffect(() => {
    if (!sucursal || !fecha) return;
    const controlador = new AbortController();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/logistica/turnos/horarios_libres/?sucursal=${sucursal}&fecha=${fecha}`;
    
    fetch(url, { signal: controlador.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(mensajeDeError(data));
        return data.horarios as string[];
      })
      .then((horarios) => setResultado({ clave, horarios, error: null }))
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setResultado({
          clave,
          horarios: [],
          error: error.message || "No pudimos cargar los horarios.",
        });
      });

    return () => controlador.abort();
  }, [sucursal, fecha, clave]);

  if (!listo) {
    return (
      <p className="text-sm text-muted">
        Elegí una sucursal y un día para ver los horarios.
      </p>
    );
  }

  if (!resultado || resultado.clave !== clave) {
    return (
      <p role="status" className="text-sm text-muted">
        Buscando horarios...
      </p>
    );
  }

  if (resultado.error) {
    return <p className="text-sm text-red-600">{resultado.error}</p>;
  }

  if (resultado.horarios.length === 0) {
    return (
      <p className="text-sm text-muted">No hay horarios libres para ese día.</p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {resultado.horarios.map((hora) => {
        const elegido = hora === value;
        return (
          <button
            key={hora}
            type="button"
            aria-pressed={elegido}
            onClick={() => onChange(hora)}
            className={`rounded-md border px-3 py-2 text-sm transition ${
              elegido
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card hover:border-accent"
            }`}
          >
            {hora}
          </button>
        );
      })}
    </div>
  );
}