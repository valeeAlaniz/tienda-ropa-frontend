"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { reservarTurno } from "@/app/turnos/actions";
import Button from "@/components/Button";
import SelectorHorario from "@/components/SelectorHorario";
import {
  hoyISO,
  TIPOS_TURNO,
  turnoSchema,
  type TurnoForm,
} from "@/lib/schemas/turno";
import type { Sucursal } from "@/lib/turnos";

const campo =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent";

export default function ReservarTurnoForm({ sucursales }: { sucursales: Sucursal[] }) {
  const router = useRouter();
  const [enviando, iniciar] = useTransition();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TurnoForm>({
    resolver: zodResolver(turnoSchema),
    defaultValues: { sucursal: "", tipo: "PRUEBA", fecha: "", hora: "" },
  });

  const sucursal = useWatch({ control, name: "sucursal" });
  const fecha = useWatch({ control, name: "fecha" });
  const hora = useWatch({ control, name: "hora" });

  const reiniciarHora = () => setValue("hora", "");

  const onSubmit = handleSubmit((datos) => {
    setErrorServidor(null);
    iniciar(async () => {
      const resultado = await reservarTurno({
        sucursal: Number(datos.sucursal),
        tipo: datos.tipo,
        fecha: datos.fecha,
        hora: datos.hora,
      });

      if (resultado.ok) {
        router.push("/mis-turnos");
        return;
      }

      setErrorServidor(resultado.error);
      setValue("hora", "");
      setVersion((actual) => actual + 1);
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <label htmlFor="sucursal" className="mb-1 block text-sm font-medium">
          Sucursal
        </label>
        <select
          id="sucursal"
          className={campo}
          {...register("sucursal", { onChange: reiniciarHora })}
        >
          <option value="">Elegí una sucursal</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre} ({s.ciudad})
            </option>
          ))}
        </select>
        {errors.sucursal && (
          <p className="mt-1 text-xs text-red-600">{errors.sucursal.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tipo" className="mb-1 block text-sm font-medium">
          Tipo de turno
        </label>
        <select id="tipo" className={campo} {...register("tipo")}>
          {TIPOS_TURNO.map((tipo) => (
            <option key={tipo.valor} value={tipo.valor}>
              {tipo.etiqueta}
            </option>
          ))}
        </select>
        {errors.tipo && (
          <p className="mt-1 text-xs text-red-600">{errors.tipo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="fecha" className="mb-1 block text-sm font-medium">
          Día
        </label>
        <input
          id="fecha"
          type="date"
          min={hoyISO()}
          className={campo}
          {...register("fecha", { onChange: reiniciarHora })}
        />
        {errors.fecha && (
          <p className="mt-1 text-xs text-red-600">{errors.fecha.message}</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Horario</p>
        <SelectorHorario
          sucursal={sucursal}
          fecha={fecha}
          value={hora}
          version={version}
          onChange={(elegida) => setValue("hora", elegida, { shouldValidate: true })}
        />
        {errors.hora && (
          <p className="mt-1 text-xs text-red-600">{errors.hora.message}</p>
        )}
      </div>

      {errorServidor && (
        <p role="alert" className="text-sm text-red-600">
          {errorServidor}
        </p>
      )}

      <Button type="submit" disabled={enviando}>
        {enviando ? "Reservando..." : "Reservar turno"}
      </Button>
    </form>
  );
}