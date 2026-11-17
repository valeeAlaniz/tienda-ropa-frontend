export default function Cargando({ texto = "Cargando..." }: { texto?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
      <p className="text-sm opacity-70">{texto}</p>
    </div>
  );
}