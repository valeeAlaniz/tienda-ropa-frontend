import { z } from "zod";

export const TALLES = ["XS", "S", "M", "L", "XL", "XXL", "UNICO"] as const;

const imagen = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || /^https?:\/\//i.test(v),
    "Ingresá un link que empiece con http:// o https://",
  );

const precio = (mensaje: string) =>
  z
    .string()
    .min(1, mensaje)
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      "Ingresá un precio válido mayor a 0 (ej: 45000)",
    );

const base = {
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  imagen,
  categoria: z.string().min(1, "Elegí una categoría"),
  talle: z.enum(TALLES, { message: "Elegí un talle" }),
  color: z.string().trim().min(2, "Ingresá el color"),
  destacado: z.boolean(),
  activo: z.boolean(),
};

export const prendaSchema = z.object({
  ...base,
  precio: precio("Ingresá un precio"),
  stock: z
    .string()
    .min(1, "Ingresá el stock")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      "El stock debe ser un número entero, 0 o mayor",
    ),
});

export const prendaAlquilerSchema = z.object({
  ...base,
  precio_por_dia: precio("Ingresá el precio por día"),
});

export type PrendaFormValues = z.infer<typeof prendaSchema>;
export type PrendaAlquilerFormValues = z.infer<typeof prendaAlquilerSchema>;
