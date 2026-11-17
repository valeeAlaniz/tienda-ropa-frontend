import AuthForm from "@/components/auth/AuthForm";

export const metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return (
    <main className="mx-auto my-12 grid w-full max-w-md gap-5 rounded-lg border border-border bg-card p-6">
      <h1 className="font-display text-4xl uppercase">Crear cuenta</h1>
      <AuthForm registro />
    </main>
  );
}
