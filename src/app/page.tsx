import Link from "next/link";
import PrendaCard from "@/components/PrendaCard";
import { getCategorias, getPrendas } from "@/lib/api";
import type { Categoria, Prenda } from "@/lib/types";

async function cargarDatos() {
  try {
    const [prendas, categorias] = await Promise.all([
      getPrendas({ activo: "true" }),
      getCategorias(),
    ]);
    const destacadas = prendas.filter((p) => p.destacado);
    const nuevas = (destacadas.length >= 4 ? destacadas : prendas).slice(0, 4);
    return { nuevas, categorias: categorias.filter((c) => c.activa !== false) };
  } catch {
    // Si el back no responde, la Home igual se muestra (sin productos)
    return { nuevas: [] as Prenda[], categorias: [] as Categoria[] };
  }
}

const ventajas = [
  "Envíos a todo el país",
  "Reservá tu turno",
  "Probá antes de alquilar",
  "Compra segura",
];

const pasos = [
  ["01", "Elegí", "Mirá los vestidos y trajes disponibles para alquilar."],
  ["02", "Reservá tu turno", "Elegí fecha para probártelo y retirarlo."],
  ["03", "Disfrutalo", "Devolvelo en la fecha acordada. Nosotros nos ocupamos del resto."],
];

const botonPrimario =
  "inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-accent-foreground transition hover:opacity-90";
const botonSecundario =
  "inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest transition hover:bg-foreground hover:text-background";

export default async function Home() {
  const { nuevas, categorias } = await cargarDatos();

  return (
    <main>
      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-24">
        <div>
          <p className="font-script text-3xl text-muted">Para cada ocasión</p>
          <h1 className="mt-2 font-display text-6xl uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Vestí
            <br />
            distinto<span className="text-muted">.</span>
          </h1>
          <p className="mt-6 max-w-md text-muted">
            Ropa para comprar, y vestidos y trajes para alquilar. Reservá tu
            turno, probalo y llevalo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/prendas" className={botonPrimario}>
              Comprar ahora <span aria-hidden>→</span>
            </Link>
            <Link href="/alquiler" className={botonSecundario}>
              Alquilar
            </Link>
          </div>
        </div>

        <div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card bg-cover bg-center"
          style={{ backgroundImage: "var(--fondo)" }}
        >
          <Link
            href="/prendas"
            className="absolute bottom-4 right-4 flex items-center gap-4 border border-border bg-card/90 px-4 py-3 backdrop-blur transition hover:border-accent"
          >
            <span className="text-xs uppercase tracking-widest text-muted">
              Nueva colección
              <span className="block font-display text-lg tracking-normal text-foreground">
                Ver prendas
              </span>
            </span>
            <span className="grid h-8 w-8 place-items-center bg-accent text-accent-foreground">
              +
            </span>
          </Link>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="border-y border-border bg-card/70 backdrop-blur">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {ventajas.map((texto) => (
            <li
              key={texto}
              className="flex items-center justify-center gap-3 px-4 py-5 text-xs font-semibold uppercase tracking-widest"
            >
              <span className="text-muted" aria-hidden>
                +
              </span>
              {texto}
            </li>
          ))}
        </ul>
      </section>

      {/* NUEVOS INGRESOS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl uppercase tracking-tight">
            Nuevos ingresos <span aria-hidden>→</span>
          </h2>
          <Link
            href="/prendas"
            className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground"
          >
            Ver todo
          </Link>
        </div>

        {nuevas.length === 0 ? (
          <p className="py-12 text-center text-muted">
            Pronto vas a ver acá las últimas novedades.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {nuevas.map((prenda) => (
              <PrendaCard key={prenda.id} prenda={prenda} />
            ))}
          </div>
        )}
      </section>

      {/* EXPLORAR */}
      <section className="mx-auto grid max-w-6xl items-stretch gap-8 px-6 pb-16 md:grid-cols-[280px_1fr]">
        <nav aria-label="Categorías" className="border border-border bg-card/90 p-6">
          <ul className="space-y-4">
            {categorias.map((c, i) => (
              <li key={c.id}>
                <Link
                  href={`/prendas?categoria=${c.id}`}
                  className="flex items-baseline gap-4 text-sm font-semibold uppercase tracking-widest hover:text-muted"
                >
                  <span className="text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.nombre}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/alquiler"
                className="flex items-baseline gap-4 text-sm font-semibold uppercase tracking-widest hover:text-muted"
              >
                <span className="text-xs text-muted">
                  {String(categorias.length + 1).padStart(2, "0")}
                </span>
                Alquiler
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col justify-center gap-4 py-6">
          <p className="font-script text-3xl text-muted">Tu estilo</p>
          <h2 className="font-display text-6xl uppercase leading-[0.95] tracking-tight sm:text-7xl">
            Explorá
            <br />
            el estilo
          </h2>
          <div className="h-1 w-40 bg-accent" />
        </div>
      </section>

      {/* ALQUILER */}
      <section id="alquiler" className="mx-auto max-w-6xl scroll-mt-32 px-6 pb-20">
        <div className="grid gap-10 bg-accent p-8 text-accent-foreground md:grid-cols-[1fr_1.2fr] md:p-12">
          <div>
            <p className="font-script text-3xl opacity-70">Para tu gran noche</p>
            <h2 className="mt-2 font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Alquilá
              <br />
              con turno
            </h2>
            <p className="mt-4 max-w-sm text-sm opacity-80">
              Vestidos y trajes para eventos. Reservás la fecha, te lo probás y
              te lo llevás.
            </p>
            <Link
              href="/alquiler"
              className="mt-8 inline-flex items-center gap-2 border border-current px-6 py-3 text-sm font-semibold uppercase tracking-widest transition hover:opacity-70"
            >
              Ver alquiler <span aria-hidden>→</span>
            </Link>
          </div>

          <ol className="space-y-6">
            {pasos.map(([numero, titulo, texto]) => (
              <li key={numero} className="flex gap-5 border-t border-current/30 pt-5">
                <span className="font-display text-4xl leading-none opacity-60">
                  {numero}
                </span>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest">
                    {titulo}
                  </h3>
                  <p className="mt-1 text-sm opacity-80">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
