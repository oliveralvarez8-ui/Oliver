// Pequeña utilidad para mostrar fechas como texto relativo ("hace 2 días"),
// que es más legible que una fecha ISO en la ficha de una zapatilla.

export function tiempoRelativo(fechaISO: string): string {
  const diferenciaMs = Date.now() - new Date(fechaISO).getTime();
  const minutos = Math.floor(diferenciaMs / (1000 * 60));
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) return 'justo ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  if (horas < 24) return `hace ${horas} h`;
  if (dias === 1) return 'hace 1 día';
  return `hace ${dias} días`;
}
