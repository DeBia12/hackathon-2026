import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabaseAttivo } from "@/lib/supabase";

const tematiche = [
  {
    titolo: "Accessibilità digitale",
    testo: "Rendere i servizi online usabili da chiunque, senza barriere.",
  },
  {
    titolo: "Educazione finanziaria",
    testo: "Spiegare i soldi con parole semplici e esempi concreti.",
  },
  {
    titolo: "Educazione digitale inclusiva",
    testo: "Insegnare gli strumenti digitali a chi parte da zero.",
  },
];

export function App() {
  return (
    <>
      <SkipLink />

      <header className="border-b border-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <p className="text-lg font-semibold">
            <span aria-hidden="true" className="text-accent">&gt;</span> Hackathon
          </p>
          <nav aria-label="Principale">
            <ul className="flex gap-6">
              <li><a href="#tematiche" className="text-accent-text underline underline-offset-4">Tematiche</a></li>
              <li><a href="#stato" className="text-accent-text underline underline-offset-4">Stato</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="contenuto" className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="max-w-2xl text-5xl font-semibold">
          Il prototipo parte da qui
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Ambiente pronto: componenti accessibili, agenti configurati, brand applicato.
          Sostituisci questa pagina con la vostra idea.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button>Inizia a costruire</Button>
          <Button variante="secondario">Guarda la documentazione</Button>
        </div>

        <section id="tematiche" aria-labelledby="titolo-tematiche" className="mt-20">
          <h2 id="titolo-tematiche" className="text-3xl font-semibold">
            <span aria-hidden="true" className="text-accent">&gt;</span> Tematiche
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {tematiche.map((t) => (
              <li key={t.titolo}>
                <Card titolo={t.titolo} livello={3} className="h-full">
                  {t.testo}
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section id="stato" aria-labelledby="titolo-stato" className="mt-20">
          <h2 id="titolo-stato" className="text-3xl font-semibold">
            <span aria-hidden="true" className="text-accent">&gt;</span> Stato dell'ambiente
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-brand border-2 border-surface p-5">
              <dt className="font-semibold">Persistenza Supabase</dt>
              <dd className="mt-1 text-muted">
                {/* lo stato non è veicolato dal solo colore: c'è anche il testo */}
                {supabaseAttivo ? "Configurata e attiva" : "Non configurata — l'app gira senza database"}
              </dd>
            </div>
            <div className="rounded-brand border-2 border-surface p-5">
              <dt className="font-semibold">Accessibilità</dt>
              <dd className="mt-1 text-muted">
                Componenti conformi WCAG 2.2 AA per costruzione
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="mt-20 border-t border-surface">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted">
          Prototipo realizzato durante l'hackathon.
        </div>
      </footer>
    </>
  );
}
