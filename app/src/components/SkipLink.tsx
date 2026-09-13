/** Primo elemento focalizzabile della pagina: permette di saltare la navigazione. */
export function SkipLink() {
  return (
    <a
      href="#contenuto"
      className="sr-only-focusable absolute left-4 top-4 z-50 rounded-brand
                 bg-ink px-4 py-3 text-base font-semibold text-paper
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Vai al contenuto principale
    </a>
  );
}
