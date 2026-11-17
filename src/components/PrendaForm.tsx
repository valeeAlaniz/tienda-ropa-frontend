"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ResultadoPrenda } from "@/app/dashboard/prendas/actions";
import { TALLES, prendaSchema, type PrendaFormValues } from "@/lib/schemas/prenda";
import type { Categoria } from "@/lib/types";

const campo =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-2 focus:outline-accent/30";

const VALORES_VACIOS: PrendaFormValues = {
  nombre: "",
  descripcion: "",
  imagen: "",
  categoria: "",
  talle: "M",
  color: "",
  destacado: false,
  activo: true,
  precio: "",
  stock: "0",
};

const CAMPOS = [
  "nombre",
  "descripcion",
  "imagen",
  "categoria",
  "talle",
  "color",
  "destacado",
  "activo",
  "precio",
  "stock",
] as const;

function Campo({
  etiqueta,
  error,
  children,
}: {
  etiqueta: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {etiqueta}
      {children}
      {error && (
        <span role="alert" className="text-xs font-normal text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

type Props = {
  categorias: Categoria[];
  accion: (valores: PrendaFormValues) => Promise<ResultadoPrenda>;
  valoresIniciales?: PrendaFormValues;
  textoBoton?: string;
};

export default function PrendaForm({
  categorias,
  accion,
  valoresIniciales,
  textoBoton = "Guardar prenda",
}: Props) {
  const router = useRouter();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PrendaFormValues>({
    resolver: zodResolver(prendaSchema),
    defaultValues: valoresIniciales ?? VALORES_VACIOS,
  });

  async function onSubmit(valores: PrendaFormValues) {
    setErrorGeneral(null);
    const res = await accion(valores);

    if (res.ok) {
      router.push("/dashboard/prendas");
      router.refresh();
      return;
    }

    setErrorGeneral(res.error ?? "No se pudo guardar la prenda.");
    for (const [clave, mensajes] of Object.entries(res.errores ?? {})) {
      if ((CAMPOS as readonly string[]).includes(clave)) {
        setError(clave as keyof PrendaFormValues, { message: mensajes.join(" ") });
      } else {
        setErrorGeneral((previo) => `${previo} ${mensajes.join(" ")}`);
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid max-w-2xl gap-5 rounded-2xl border border-border bg-card p-8"
    >
      <Campo etiqueta="Nombre" error={errors.nombre?.message}>
        <input {...register("nombre")} className={campo} />
      </Campo>

      <Campo etiqueta="Descripción" error={errors.descripcion?.message}>
        <textarea {...register("descripcion")} rows={4} className={campo} />
      </Campo>

      <Campo etiqueta="Link de la imagen (opcional)" error={errors.imagen?.message}>
        <input
          {...register("imagen")}
          placeholder="https://drive.google.com/file/d/..."
          className={campo}
        />
        <span className="text-xs font-normal text-muted">
          En Drive: clic derecho en la foto → Compartir → Acceso general: &quot;Cualquier persona
          con el enlace&quot; → Copiar enlace.
        </span>
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo etiqueta="Precio (ARS)" error={errors.precio?.message}>
          <input {...register("precio")} inputMode="decimal" className={campo} />
        </Campo>
        <Campo etiqueta="Stock" error={errors.stock?.message}>
          <input {...register("stock")} type="number" min={0} className={campo} />
        </Campo>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo etiqueta="Talle" error={errors.talle?.message}>
          <select {...register("talle")} className={campo}>
            {TALLES.map((t) => (
              <option key={t} value={t}>
                {t === "UNICO" ? "Único" : t}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Color" error={errors.color?.message}>
          <input {...register("color")} className={campo} />
        </Campo>
      </div>

      <Campo etiqueta="Categoría" error={errors.categoria?.message}>
        <select {...register("categoria")} className={campo}>
          <option value="">Elegí una categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.nombre}
            </option>
          ))}
        </select>
      </Campo>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("destacado")} />
          Prenda destacada
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("activo")} />
          Activa (visible en la tienda)
        </label>
      </div>

      {errorGeneral && (
        <p role="alert" className="rounded-lg border border-red-600/40 px-3 py-2 text-sm text-red-600">
          {errorGeneral}
        </p>
      )}

      <button
        disabled={isSubmitting}
        className="bg-accent px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}
