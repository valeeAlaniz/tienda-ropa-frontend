"use client";

import { useState } from "react";
import { urlDeImagen } from "@/lib/imagen";

export default function PrendaImage({
  imagen,
  nombre,
  className = "",
}: {
  imagen: string;
  nombre: string;
  className?: string;
}) {
  const [fallo, setFallo] = useState(false);

  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-lg bg-border text-muted ${className}`}
    >
      {imagen && !fallo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlDeImagen(imagen)}
          alt={nombre}
          referrerPolicy="no-referrer"
          onError={() => setFallo(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-5xl font-light">
          {nombre.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
