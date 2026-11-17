import Link from "next/link";
import TurnoCard from "@/components/TurnoCard";
import { requireToken } from "@/lib/auth";
import { getMisTurnos } from "@/lib/turnos";

export const metadata = { title: "Mis turnos" };

export default async function MisTurnosPage() {
  await requireToken();
  const turnos = await getMisTurnos();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl uppercase tracking-tight">
            Mis turnos
          </h1>
          <p className="mt-2 text-sm text-muted">
            Tus pruebas, retiros y devoluciones.
          </p>
        </div>
        <Link
          href="/turnos/reservar"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-80"
        >
          Reservar turno
        </Link>
      </div>

      {turnos.length === 0 ? (
        <p className="py-16 text-center text-muted">
          Todavía no tenés turnos reservados.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {turnos.map((turno) => (
            <TurnoCard key={turno.id} turno={turno} />
          ))}
        </ul>
      )}
    </main>
  );
}