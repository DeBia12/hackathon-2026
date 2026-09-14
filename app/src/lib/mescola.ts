/**
 * Fisher-Yates su una copia: l'array in ingresso non viene toccato.
 * Serve a non presentare sempre la risposta corretta nella stessa posizione.
 */
export function mescola<T>(elementi: readonly T[]): T[] {
  const copia = [...elementi];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = copia[i];
    const b = copia[j];
    if (a === undefined || b === undefined) continue;
    copia[i] = b;
    copia[j] = a;
  }
  return copia;
}
