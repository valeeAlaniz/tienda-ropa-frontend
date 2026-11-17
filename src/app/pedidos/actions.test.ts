
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(),
  getDirecciones: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/lib/auth", () => ({
  getToken: mocks.getToken,
}));

vi.mock("@/lib/pedidos", () => ({
  getDirecciones: mocks.getDirecciones,
}));

vi.mock("@/lib/api", () => ({
  API_URL: "http://localhost:8000",
}));

import { crearPedido } from "./actions";

const valores = {
  tipoEntrega: "RETIRO" as const,
  sucursal: "1",
  direccion: "nueva",
  calle: "",
  numero: "",
  ciudad: "",
  codigoPostal: "",
};

const items = [{ id: 1, cantidad: 2 }];

describe("crearPedido", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    mocks.getToken.mockResolvedValue("token-prueba");
    mocks.getDirecciones.mockResolvedValue([]);
  });

  it("registra correctamente un pedido", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 25 }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const resultado = await crearPedido(valores, items);

    expect(resultado).toEqual({ ok: true, id: 25 });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/pedidos");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/ventas/pedidos/crear_completo/",
      expect.objectContaining({
        method: "POST",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("informa cuando la solicitud supera el tiempo de espera", async () => {
    const error = new Error("Tiempo de espera agotado");
    error.name = "TimeoutError";

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));

    const resultado = await crearPedido(valores, items);

    expect(resultado.ok).toBe(false);

    if (!resultado.ok) {
      expect(resultado.error).toContain(
        "El pedido podría haberse registrado",
      );
    }
  });

  it("informa un error cuando no puede conectarse", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    const resultado = await crearPedido(valores, items);

    expect(resultado).toEqual({
      ok: false,
      error: "No pudimos conectarnos con el servidor.",
    });
  });
});
