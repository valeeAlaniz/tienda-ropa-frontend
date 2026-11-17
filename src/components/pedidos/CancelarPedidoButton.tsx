"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cancelarPedido } from "@/app/pedidos/actions";
import Button from "@/components/Button";
import { useToast } from "@/context/ToastContext";

export default function CancelarPedidoButton({ id }: { id: number }) {
  const router = useRouter();
  const toast = useToast();
  const [cancelando, iniciar] = useTransition();

  function cancelar() {
    if (!window.confirm("¿Querés cancelar este pedido? Las prendas vuelven al stock.")) return;

    iniciar(async () => {
      const resultado = await cancelarPedido(id);

      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }

      toast.success(`Cancelaste el pedido #${id}.`);
      router.refresh();
    });
  }

  return (
    <Button variant="danger" onClick={cancelar} disabled={cancelando}>
      {cancelando ? "Cancelando..." : "Cancelar pedido"}
    </Button>
  );
}
