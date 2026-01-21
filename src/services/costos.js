export const COSTO_HORA = 62;

export function calcularHoras(inicio, fin) {
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);

  return (h2 + m2 / 60) - (h1 + m1 / 60);
}

export function calcularCosto(inicio, fin) {
  const horas = calcularHoras(inicio, fin);
  return horas * COSTO_HORA;
}
