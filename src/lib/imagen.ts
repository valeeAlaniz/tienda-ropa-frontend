// Convierte un link de Google Drive en una URL que sirve para <img>
export function urlDeImagen(imagen: string): string {
  const drive =
    imagen.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) ??
    imagen.match(/drive\.google\.com\/(?:open|uc)\?[^#]*id=([^&#]+)/);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1000`;
  return imagen;
}
