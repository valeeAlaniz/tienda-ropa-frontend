import Link from "next/link";

const SECCIONES = [
  { clave: "resumen", etiqueta: "Resumen", href: "/dashboard" },
  { clave: "prendas", etiqueta: "Prendas", href: "/dashboard/prendas" },
  { clave: "alquiler", etiqueta: "Alquiler", href: "/dashboard/alquiler" },
  { clave: "pedidos", etiqueta: "Pedidos", href: "/dashboard/pedidos" },
  { clave: "turnos", etiqueta: "Turnos", href: "/dashboard/turnos" },
] as const;

export type SeccionPanel = (typeof SECCIONES)[number]["clave"];

export default function DashboardTabs({ actual }: { actual: SeccionPanel }) {
  const base = "px-4 py-2 text-sm uppercase tracking-widest";
  const activa = "bg-accent text-accent-foreground";
  const inactiva = "border border-border hover:border-accent";

  return (
    <nav aria-label="Secciones del panel" className="mb-8 flex flex-wrap gap-3">
      {SECCIONES.map((s) => (
        <Link
          key={s.clave}
          href={s.href}
          className={`${base} ${actual === s.clave ? activa : inactiva}`}
        >
          {s.etiqueta}
        </Link>
      ))}
    </nav>
  );
}
