import Link from "next/link";
import { cookies } from "next/headers";
import { cerrarSesion } from "@/app/auth-actions";
import ThemeToggle from "@/components/layout/ThemeToggle";
import CartLink from "@/components/carrito/CartLink";

const enlace =
  "rounded-sm px-2 py-1 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent";

export default async function Navbar() {
  const jar = await cookies();
  const conSesion = Boolean(jar.get("token")?.value);
  const esStaff = conSesion && jar.get("staff")?.value === "1";
  const usuario = conSesion ? jar.get("usuario")?.value : undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-x-4 gap-y-2 px-4 py-3 md:flex md:justify-between">
        <Link href="/" className="flex items-baseline gap-1.5 justify-self-start">
          <span className="font-display text-2xl uppercase tracking-tight">Tienda</span>
          <span className="font-script text-2xl text-muted">de ropa</span>
          {esStaff && (
            <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground">
              Admin
            </span>
          )}
        </Link>

        {esStaff ? (
          <nav
            aria-label="Navegación del panel"
            className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-4"
          >
            <Link href="/dashboard" className={enlace}>Inicio</Link>
            <Link href="/dashboard/prendas" className={enlace}>Prendas</Link>
            <Link href="/dashboard/alquiler" className={enlace}>Alquiler</Link>
            <Link href="/dashboard/pedidos" className={enlace}>Pedidos</Link>
            <Link href="/dashboard/turnos" className={enlace}>Turnos</Link>
            <Link href="/prendas" className={enlace}>Ver tienda</Link>
          </nav>
        ) : (
          <nav
            aria-label="Navegación principal"
            className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-4"
          >
            <Link href="/" className={enlace}>Inicio</Link>
            <Link href="/prendas" className={enlace}>Comprar</Link>
            <Link href="/alquiler" className={enlace}>Alquiler</Link>
            {conSesion && <Link href="/pedidos" className={enlace}>Mis pedidos</Link>}
            <Link href={conSesion ? "/mis-turnos" : "/turnos/reservar"} className={enlace}>
              {conSesion ? "Mis turnos" : "Reservar turno"}
            </Link>

            {conSesion ? (

            <span
            className="inline-flex items-center gap-2 px-1 text-sm font-medium text-foreground"
            title="Usuario conectado"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="9" r="3" />
                <path d="M6.5 19a6 6 0 0 1 11 0" />
            </svg>
            <span className="max-w-28 truncate">
                {usuario ?? "Mi cuenta"}
            </span>
            </span>

            ) : (
                <Link href="/login" className={enlace}>
                    Ingresar
                </Link>
            )}

          </nav>
        )}

        <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end">

            {esStaff ? (
                <form action={cerrarSesion}>
                    <button type="submit" className={enlace}>
                         Cerrar sesión
                    </button>
                </form>
            ) : (
             <>
                <CartLink />
                {conSesion && (
                    <form action={cerrarSesion}>
                        <button type="submit" className={enlace}>
                            Cerrar sesión
                        </button>
                    </form>
            )}
            </>
            )}
            <ThemeToggle />

        </div>
      </div>
    </header>
  );
}
