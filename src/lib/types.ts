export type Categoria = {
  id: number;
  nombre: string;
  descripcion?: string;
  activa?: boolean;
};

export type Talle = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "UNICO";

// Lo que devuelve GET /api/prendas/ (categoría anidada)
export type Prenda = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  categoria: Categoria | null;
  talle: Talle;
  color: string;
  imagen: string;
  destacado: boolean;
  activo: boolean;
};

// Lo que devuelve el detalle y lo que se envía al crear o editar (solo ids)
export type PrendaDetalle = Omit<Prenda, "categoria"> & {
  categoria: number | null;
};

// Catálogo de alquiler (lo expone Marcos F en /api/prendas-alquiler/)
export type PrendaAlquiler = {
  id: number;
  nombre: string;
  descripcion: string;
  precio_por_dia: string;
  categoria: Categoria | null;
  talle: Talle;
  color: string;
  imagen: string;
  destacado: boolean;
  activo: boolean;
};
