import ReservarTurnoForm from "@/components/ReservarTurnoForm";
import { requireToken } from "@/lib/auth";
import { getSucursales } from "@/lib/turnos";

export const metadata = { title: "Reservar turno" };

export default async function ReservarTurnoPage() {
  await requireToken();
  const sucursales = await getSucursales();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-5xl uppercase tracking-tight">
        Reservar turno
      </h1>
      <p className="mt-2 text-sm text-muted">
        Elegí sucursal, día y horario para tu prueba, retiro o devolución.
      </p>

      <div className="mt-8">
        {sucursales.length === 0 ? (
          <p className="py-8 text-center text-muted">
            Todavía no hay sucursales disponibles.
          </p>
        ) : (
          <ReservarTurnoForm sucursales={sucursales} />
        )}
      </div>
    </main>
  );
}