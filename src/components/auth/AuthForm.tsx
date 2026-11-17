
"use client";

import Link from "next/link";
import {
  useActionState,
  useState,
  type ChangeEvent,
  type HTMLInputTypeAttribute,
} from "react";

import { iniciarSesion, registrarCliente } from "@/app/auth-actions";
import Button from "@/components/Button";

type DatosFormulario = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  username: string;
};

function Campo({
  nombre,
  etiqueta,
  autoComplete,
  tipo = "text",
  maxLength,
  opcional = false,
  valor,
  onChange,
}: {
  nombre: string;
  etiqueta: string;
  autoComplete: string;
  tipo?: HTMLInputTypeAttribute;
  maxLength?: number;
  opcional?: boolean;
  valor?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
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
        value={valor}
        onChange={onChange}
        className="rounded-md border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-accent"
      />
    </label>
  );
}

export default function AuthForm({
  registro = false,
}: {
  registro?: boolean;
}) {
  const [estado, accion, pendiente] = useActionState(
    registro ? registrarCliente : iniciarSesion,
    {},
  );

  const [datos, setDatos] = useState<DatosFormulario>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    username: "",
  });

  const actualizarCampo = (campo: keyof DatosFormulario) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setDatos((anterior) => ({
        ...anterior,
        [campo]: event.target.value,
      }));
    };

  return (
    <>
      <form action={accion} className="grid gap-4">
        {registro && (
          <>
            <Campo
              nombre="nombre"
              etiqueta="Nombre"
              autoComplete="given-name"
              maxLength={100}
              valor={datos.nombre}
              onChange={actualizarCampo("nombre")}
            />
            <Campo
              nombre="apellido"
              etiqueta="Apellido"
              autoComplete="family-name"
              maxLength={100}
              valor={datos.apellido}
              onChange={actualizarCampo("apellido")}
            />
            <Campo
              nombre="email"
              etiqueta="Correo electrónico"
              tipo="email"
              autoComplete="email"
              maxLength={254}
              valor={datos.email}
              onChange={actualizarCampo("email")}
            />
            <Campo
              nombre="telefono"
              etiqueta="Teléfono (opcional)"
              tipo="tel"
              autoComplete="tel"
              maxLength={30}
              opcional
              valor={datos.telefono}
              onChange={actualizarCampo("telefono")}
            />
          </>
        )}

        <Campo
          nombre="username"
          etiqueta="Usuario"
          autoComplete="username"
          maxLength={150}
          valor={registro ? datos.username : undefined}
          onChange={registro ? actualizarCampo("username") : undefined}
        />

        <Campo
          nombre="password"
          etiqueta="Contraseña"
          tipo="password"
          autoComplete={registro ? "new-password" : "current-password"}
        />

        {registro && (
          <Campo
            nombre="password_confirm"
            etiqueta="Confirmá tu contraseña"
            tipo="password"
            autoComplete="new-password"
          />
        )}

        {estado.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {estado.error}
          </p>
        )}

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
