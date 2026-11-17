import Link from "next/link";

export default function DashboardTabs({ actual }: { actual: "prendas" | "alquiler" }) {
  const base = "px-4 py-2 text-sm uppercase tracking-widest";
  const activa = "bg-accent text-accent-foreground";
  const inactiva = "border border-border hover:border-accent";

  return (
    <nav aria-label="Secciones del panel" className="mb-8 flex gap-3">
      <Link
        href="/dashboard/prendas"
        className={`${base} ${actual === "prendas" ? activa : inactiva}`}
      >
        Prendas
      </Link>
      <Link
        href="/dashboard/alquiler"
        className={`${base} ${actual === "alquiler" ? activa : inactiva}`}
      >
        Alquiler
      </Link>
    </nav>
  );
}
