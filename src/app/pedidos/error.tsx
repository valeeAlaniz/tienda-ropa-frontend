"use client";

export default function ErrorPedidos({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h2 className="font-display text-3xl uppercase tracking-tight">No pudimos cargar tus pedidos</h2>
      <p className="mt-2 text-sm text-muted">
        Hubo un problema al conectar con el servidor o tu sesión venció. Probá de nuevo.
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
