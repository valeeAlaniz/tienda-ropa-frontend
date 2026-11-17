import ThemeToggle from "@/components/ThemeToggle";

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 px-6 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm opacity-70">
          © {new Date().getFullYear()} Tienda de ropa. Venta y alquiler de
          vestidos y trajes.
        </p>
        <ThemeToggle />
      </div>
    </footer>
  );
}