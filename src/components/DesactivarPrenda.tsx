"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { desactivarPrenda } from "@/app/dashboard/prendas/actions";

export default function DesactivarPrenda({ id, nombre }: { id: number; nombre: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function desactivar() {
    startTransition(async () => {
      const res = await desactivarPrenda(id);
      if (res.error) {
        setError(res.error);
        return;
      }
      setConfirmando(false);
      router.refresh();
    });
  }

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        aria-label={`Desactivar ${nombre}`}
        className="text-sm text-red-600 hover:underline"
      >
        Desactivar
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted">¿Seguro?</span>
      <button
        onClick={desactivar}
        disabled={pendiente}
        className="bg-red-600 px-3 py-1 text-white disabled:opacity-60"
      >
        {pendiente ? "Desactivando..." : "Sí, desactivar"}
      </button>
      <button
        onClick={() => {
          setConfirmando(false);
          setError(null);
        }}
        className="underline"
      >
        Cancelar
      </button>
      {error && (
        <span role="alert" className="w-full text-red-600">
          {error}
        </span>
      )}
    </span>
  );
}
