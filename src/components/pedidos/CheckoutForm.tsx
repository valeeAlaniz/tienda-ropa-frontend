"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { crearPedido } from "@/app/pedidos/actions";
import Button from "@/components/Button";
import { OrderSummary } from "@/components/carrito/OrderSummary";
import { useCart } from "@/context/cart/CartContext";
import { useToast } from "@/context/ToastContext";
import { pedidoSchema, type PedidoFormValues } from "@/lib/pedidoSchema";
import type { Direccion } from "@/lib/pedidos";
import type { Sucursal } from "@/lib/turnos";
import { formatearMoneda } from "@/utils/cartUtils";

const campo =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent";

function Campo({
  etiqueta,
  error,
  children,
}: {
  etiqueta: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {etiqueta}
      {children}
      {error && (
        <span role="alert" className="text-xs font-normal text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

type Props = {
  tienePerfil: boolean;
  sucursales: Sucursal[];
  direcciones: Direccion[];
};

export function CheckoutForm({ tienePerfil, sucursales, direcciones }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const [enviando, iniciar] = useTransition();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [terminado, setTerminado] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      tipoEntrega: "RETIRO",
      sucursal: "",
      direccion: direcciones[0] ? String(direcciones[0].id) : "nueva",
      calle: "",
      numero: "",
      ciudad: "",
      codigoPostal: "",
    },
  });

  const tipoEntrega = useWatch({ control, name: "tipoEntrega" });
  const direccion = useWatch({ control, name: "direccion" });

  const onSubmit = handleSubmit((valores) => {
    setErrorServidor(null);
    iniciar(async () => {
      const resultado = await crearPedido(
        valores,
        cart.map((item) => ({ id: item.id, cantidad: item.cantidad })),
      );

      if (!resultado.ok) {
        setErrorServidor(resultado.error);
        toast.error(resultado.error);
        return;
      }

      setTerminado(true);
      clearCart();
      toast.success(`Pedido #${resultado.id} registrado.`);
      router.push(`/pedidos/${resultado.id}`);
    });
  });

  if (terminado) {
    return (
      <p role="status" className="py-16 text-center text-sm text-muted">
        Pedido registrado. Te llevamos al detalle...
      </p>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="font-display text-3xl uppercase tracking-tight">No hay prendas en el carrito</h2>
        <p className="mt-2 text-sm text-muted">Agregá alguna antes de finalizar la compra.</p>
        <Link
          href="/prendas"
          className="mt-6 inline-block rounded-md bg-accent px-6 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-80"
        >
          Ver prendas
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        onSubmit={onSubmit}
        noValidate
        className="grid h-fit gap-5 rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="font-display text-2xl uppercase tracking-tight">¿Cómo querés recibirlo?</h2>

        {!tienePerfil && (
          <p
            role="alert"
            className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm"
          >
            Para comprar necesitás tener un perfil de cliente.{" "}
            <Link href="/perfil" className="underline">
              Completá tu perfil
            </Link>
            .
          </p>
        )}

        <fieldset className="flex flex-wrap gap-6 text-sm">
          <legend className="sr-only">Tipo de entrega</legend>
          <label className="flex items-center gap-2">
            <input type="radio" value="RETIRO" {...register("tipoEntrega")} />
            Retiro en sucursal
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="ENVIO" {...register("tipoEntrega")} />
            Envío a domicilio
          </label>
        </fieldset>

        {tipoEntrega === "RETIRO" ? (
          <Campo etiqueta="Sucursal" error={errors.sucursal?.message}>
            <select className={campo} {...register("sucursal")}>
              <option value="">Elegí una sucursal</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} — {s.direccion}, {s.ciudad}
                </option>
              ))}
            </select>
          </Campo>
        ) : (
          <>
            <Campo etiqueta="Dirección de entrega">
              <select className={campo} {...register("direccion")}>
                {direcciones.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.calle} {d.numero}, {d.ciudad}
                  </option>
                ))}
                <option value="nueva">Usar una dirección nueva</option>
              </select>
            </Campo>

            {direccion === "nueva" && (
              <div className="grid gap-4">
                <Campo etiqueta="Calle" error={errors.calle?.message}>
                  <input className={campo} {...register("calle")} />
                </Campo>
                <div className="grid grid-cols-2 gap-4">
                  <Campo etiqueta="Número" error={errors.numero?.message}>
                    <input className={campo} {...register("numero")} />
                  </Campo>
                  <Campo etiqueta="Código postal" error={errors.codigoPostal?.message}>
                    <input className={campo} {...register("codigoPostal")} />
                  </Campo>
                </div>
                <Campo etiqueta="Ciudad" error={errors.ciudad?.message}>
                  <input className={campo} {...register("ciudad")} />
                </Campo>
              </div>
            )}
          </>
        )}

        {errorServidor && (
          <p
            role="alert"
            className="rounded-md border border-red-600/40 bg-red-600/10 px-3 py-2 text-sm"
          >
            {errorServidor}
          </p>
        )}

        <Button type="submit" disabled={enviando || !tienePerfil} className="py-3">
          {enviando ? "Registrando pedido..." : "Confirmar pedido"}
        </Button>
      </form>

      <div className="grid h-fit gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl uppercase tracking-tight">Tu carrito</h2>
            <Link href="/carrito" className="text-sm text-muted underline hover:text-foreground">
              Editar
            </Link>
          </div>
          <ul className="mt-4 grid gap-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-3 border-b border-border pb-2 text-sm last:border-b-0"
              >
                <span>
                  {item.nombre} <span className="text-muted">× {item.cantidad}</span>
                </span>
                <span>{formatearMoneda(item.precio * item.cantidad)}</span>
              </li>
            ))}
          </ul>
        </div>
        <OrderSummary unidades={totalItems} total={totalPrice} />
      </div>
    </div>
  );
}
