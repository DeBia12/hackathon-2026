/** Unisce classi condizionali senza dipendenze esterne. */
export function cn(...parti: Array<string | false | null | undefined>): string {
  return parti.filter(Boolean).join(" ");
}
