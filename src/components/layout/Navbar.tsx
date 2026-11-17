import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { getToken } from "@/lib/auth";
import CartLink from "@/components/carrito/CartLink";

const enlace = "rounded-sm px-2 py-1 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent";

export default async function Navbar() {
  const conSesion = Boolean(await getToken());

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-x-4 gap-y-2 px-4 py-3 md:flex md:justify-between">
        <Link href="/" className="flex items-baseline gap-1.5 justify-self-start">
          <span className="font-display text-2xl uppercase tracking-tight">Tienda</span>
          <span className="font-script text-2xl text-muted">de ropa</span>
        </Link>
        <nav
          aria-label="Navegación principal"
          className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-4"
        >
          <Link href="/prendas" className={enlace}>Comprar</Link>
          <Link href="/#alquiler" className={enlace}>Alquiler</Link>
          <Link href={conSesion ? "/mis-turnos" : "/turnos/reservar"} className={enlace}>
            {conSesion ? "Mis turnos" : "Reservar turno"}
          </Link>
          <Link href="/login" className={enlace}>{conSesion ? "Mi cuenta" : "Ingresar"}</Link>
        </nav>
        <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end">
            <CartLink />
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
