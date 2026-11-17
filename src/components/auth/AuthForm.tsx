"use client";

import Link from "next/link";
import { useActionState, type HTMLInputTypeAttribute } from "react";
import { iniciarSesion, registrarCliente } from "@/app/auth-actions";
import Button from "@/components/Button";

function Campo({
  nombre,
  etiqueta,
  autoComplete,
  tipo = "text",
  maxLength,
  opcional = false,
}: {
  nombre: string;
  etiqueta: string;
  autoComplete: string;
  tipo?: HTMLInputTypeAttribute;
  maxLength?: number;
  opcional?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {etiqueta}
      <input
        name={nombre}
        type={tipo}
        autoComplete={autoComplete}
        required={!opcional}
        maxLength={maxLength}
        className="rounded-md border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-accent"
      />
    </label>
  );
}

export default function AuthForm({ registro = false }: { registro?: boolean }) {
  const [estado, accion, pendiente] = useActionState(
    registro ? registrarCliente : iniciarSesion,
    {},
  );

  return (
    <>
      <form action={accion} className="grid gap-4">
        {registro && (
          <>
            <Campo nombre="nombre" etiqueta="Nombre" autoComplete="given-name" maxLength={100} />
            <Campo nombre="apellido" etiqueta="Apellido" autoComplete="family-name" maxLength={100} />
            <Campo nombre="email" etiqueta="Correo electrónico" tipo="email" autoComplete="email" maxLength={254} />
            <Campo nombre="telefono" etiqueta="Teléfono (opcional)" tipo="tel" autoComplete="tel" maxLength={30} opcional />
          </>
        )}
        <Campo nombre="username" etiqueta="Usuario" autoComplete="username" maxLength={150} />
        <Campo nombre="password" etiqueta="Contraseña" tipo="password" autoComplete={registro ? "new-password" : "current-password"} />
        {registro && (
          <Campo nombre="password_confirm" etiqueta="Confirmá tu contraseña" tipo="password" autoComplete="new-password" />
        )}
        {estado.error && <p role="alert" className="text-sm">{estado.error}</p>}
        <Button type="submit" disabled={pendiente}>
          {pendiente ? "Enviando…" : registro ? "Crear cuenta" : "Ingresar"}
        </Button>
      </form>
      <Link
        href={registro ? "/login" : "/registro"}
        className="text-sm font-medium underline underline-offset-4"
      >
        {registro ? "Ya tengo una cuenta" : "Crear una cuenta"}
      </Link>
    </>
  );
}
