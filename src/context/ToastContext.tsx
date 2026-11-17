"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type TipoToast = "success" | "error" | "warning";

type Toast = { id: number; tipo: TipoToast; mensaje: string };

type ToastApi = {
  success: (mensaje: string) => void;
  error: (mensaje: string) => void;
  warning: (mensaje: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const DURACION_MS: Record<TipoToast, number> = {
  success: 4000,
  warning: 6000,
  error: 8000,
};
const MAXIMO_VISIBLES = 4;

const ESTILO: Record<TipoToast, string> = {
  success: "border-l-green-600",
  warning: "border-l-amber-500",
  error: "border-l-red-600",
};

// Un solo punto para avisar el resultado de cada acción: éxito, error o advertencia.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ultimoId = useRef(0);
  const temporizadores = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const cerrar = useCallback((id: number) => {
    clearTimeout(temporizadores.current.get(id));
    temporizadores.current.delete(id);
    setToasts((actuales) => actuales.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo: TipoToast, mensaje: string) => {
      ultimoId.current += 1;
      const id = ultimoId.current;
      setToasts((actuales) => [...actuales, { id, tipo, mensaje }].slice(-MAXIMO_VISIBLES));
      temporizadores.current.set(
        id,
        setTimeout(() => cerrar(id), DURACION_MS[tipo]),
      );
    },
    [cerrar],
  );

  useEffect(() => {
    const pendientes = temporizadores.current;
    return () => {
      pendientes.forEach((temporizador) => clearTimeout(temporizador));
      pendientes.clear();
    };
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (mensaje) => mostrar("success", mensaje),
      error: (mensaje) => mostrar("error", mensaje),
      warning: (mensaje) => mostrar("warning", mensaje),
    }),
    [mostrar],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onCerrar={cerrar} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast debe usarse dentro de un ToastProvider");
  return api;
}

export function Toaster({
  toasts,
  onCerrar,
}: {
  toasts: Toast[];
  onCerrar: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tipo === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex items-start gap-3 rounded-md border border-l-4 border-border bg-card px-4 py-3 text-sm shadow-lg ${ESTILO[toast.tipo]}`}
        >
          <p className="flex-1">{toast.mensaje}</p>
          <button
            type="button"
            onClick={() => onCerrar(toast.id)}
            aria-label="Cerrar aviso"
            className="text-muted hover:text-foreground"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
