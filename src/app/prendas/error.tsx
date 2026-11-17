"use client";

export default function ErrorPrendas({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h2 className="font-display text-3xl font-medium">No pudimos cargar las prendas</h2>
      <p className="mt-2 text-sm text-muted">
        Hubo un problema al conectar con el servidor. Probá de nuevo en unos
        segundos.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-accent px-6 py-2 text-sm text-accent-foreground hover:opacity-90"
      >
        Reintentar
      </button>
    </main>
  );
}
