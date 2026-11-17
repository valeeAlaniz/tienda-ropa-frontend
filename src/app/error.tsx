"use client";

import Button from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Algo salió mal</h1>
      <p className="opacity-70">{error.message}</p>
      <Button onClick={reset}>Reintentar</Button>
    </main>
  );
}