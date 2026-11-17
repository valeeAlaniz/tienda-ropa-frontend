"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TALLES } from "@/lib/schemas/prenda";
import type { Categoria } from "@/lib/types";

const campo =
  "rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-2 focus:outline-accent";

export default function PrendaFilters({
  categorias,
  placeholder = "Buscar prendas...",
  campoPrecio = "precio",
}: {
  categorias: Categoria[];
  placeholder?: string;
  campoPrecio?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("search") ?? "");

  function actualizar(clave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function limpiar() {
    setBusqueda("");
    router.replace(pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          actualizar("search", busqueda.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder={placeholder}
          aria-label="Buscar"
          className={campo}
        />
        <button className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90">
          Buscar
        </button>
      </form>

      <select
        value={searchParams.get("categoria") ?? ""}
        onChange={(e) => actualizar("categoria", e.target.value)}
        aria-label="Filtrar por categoría"
        className={campo}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("talle") ?? ""}
        onChange={(e) => actualizar("talle", e.target.value)}
        aria-label="Filtrar por talle"
        className={campo}
      >
        <option value="">Todos los talles</option>
        {TALLES.map((t) => (
          <option key={t} value={t}>
            {t === "UNICO" ? "Único" : t}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("ordering") ?? ""}
        onChange={(e) => actualizar("ordering", e.target.value)}
        aria-label="Ordenar"
        className={campo}
      >
        <option value="">Orden por defecto</option>
        <option value={campoPrecio}>Menor precio</option>
        <option value={`-${campoPrecio}`}>Mayor precio</option>
        <option value="nombre">Nombre A-Z</option>
      </select>

      <button onClick={limpiar} className="text-sm underline hover:opacity-70">
        Limpiar filtros
      </button>
    </div>
  );
}
