import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="opacity-70">La página que buscás no existe.</p>
      <Link href="/" className="underline">
        Volver al inicio
      </Link>
    </main>
  );
}