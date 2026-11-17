import { describe, expect, it } from "vitest";
import { urlDeImagen } from "@/lib/imagen";

describe("urlDeImagen", () => {
  it("convierte un link de archivo de Google Drive", () => {
    expect(
      urlDeImagen("https://drive.google.com/file/d/ABC123/view?usp=sharing"),
    ).toBe("https://drive.google.com/thumbnail?id=ABC123&sz=w1000");
  });

  it("convierte un link de Drive con ?id=", () => {
    expect(urlDeImagen("https://drive.google.com/open?id=XYZ789")).toBe(
      "https://drive.google.com/thumbnail?id=XYZ789&sz=w1000",
    );
  });

  it("deja igual una URL común", () => {
    const url = "https://picsum.photos/seed/camisa/600/800";
    expect(urlDeImagen(url)).toBe(url);
  });

  it("deja igual un texto vacío", () => {
    expect(urlDeImagen("")).toBe("");
  });
});