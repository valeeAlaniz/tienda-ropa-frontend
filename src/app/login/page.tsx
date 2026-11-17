import { cookies } from "next/headers";
import { cerrarSesion } from "@/app/auth-actions";
import AuthForm from "@/components/auth/AuthForm";
import Button from "@/components/Button";

export const metadata = { title: "Ingresar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { registro } = await searchParams;
  const jar = await cookies();
  const usuario = jar.get("token") && jar.get("usuario")?.value;

  return (
    <main className="mx-auto my-12 grid w-full max-w-md gap-5 rounded-lg border border-border bg-card p-6">
      <h1 className="font-display text-4xl uppercase">
        {usuario ? "Mi cuenta" : "Iniciar sesión"}
      </h1>
      {usuario ? (
        <form action={cerrarSesion} className="grid gap-4">
          <p>Sesión iniciada como {usuario}.</p>
          <Button type="submit">Cerrar sesión</Button>
        </form>
      ) : (
        <>
          {registro === "ok" && (
            <p role="status" className="text-sm">Cuenta creada. Ya podés iniciar sesión.</p>
          )}
          <AuthForm />
        </>
      )}
    </main>
  );
}
