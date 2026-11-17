import type { Metadata } from "next";
import { CheckoutForm } from "@/components/pedidos/CheckoutForm";
import { requireToken } from "@/lib/auth";
import { getCliente, getDirecciones } from "@/lib/pedidos";
import { getSucursales } from "@/lib/turnos";

export const metadata: Metadata = { title: "Finalizar compra" };

export default async function CheckoutPage() {
  await requireToken();

  const [cliente, sucursales, direcciones] = await Promise.all([
    getCliente(),
    getSucursales(),
    getDirecciones(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 font-display text-5xl uppercase tracking-tight">Finalizar compra</h1>
      <CheckoutForm
        tienePerfil={cliente !== null}
        sucursales={sucursales.filter((s) => s.activo)}
        direcciones={direcciones}
      />
    </main>
  );
}
