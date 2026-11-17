// El carrito es solo del catálogo de venta: cada ítem es una Prenda.
// Las prendas de alquiler (PrendaAlquiler) nunca entran acá.
export interface CartItemType {
  id: number; // id de la Prenda
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number; // stock al momento de agregarla; el back vuelve a validarlo al comprar
  talle?: string;
  color?: string;
  imagen?: string;
}

/** Total del carrito: suma de precio × cantidad, redondeado a centavos. */
export function calcularTotalCarrito(items: CartItemType[]): number {
  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  return Math.round(total * 100) / 100;
}

/** Cantidad total de unidades en el carrito. */
export function calcularCantidadTotal(items: CartItemType[]): number {
  return items.reduce((acc, item) => acc + item.cantidad, 0);
}

/** Formatea un monto en pesos argentinos, mostrando centavos solo si hacen falta. */
export function formatearMoneda(monto: number): string {
  const tieneCentavos = Math.round(monto * 100) % 100 !== 0;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: tieneCentavos ? 2 : 0,
    maximumFractionDigits: tieneCentavos ? 2 : 0,
  }).format(monto);
}
