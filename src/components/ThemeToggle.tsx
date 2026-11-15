"use client";

import { useTheme } from "@/context/ThemeContext";
import Button from "@/components/Button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="secondary" onClick={toggleTheme}>
      {theme === "light" ? "Modo oscuro" : "Modo claro"}
    </Button>
  );
}