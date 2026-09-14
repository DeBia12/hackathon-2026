import { statoIniziale } from "./archivio";
import type {
  LezioneId,
  ModuloId,
  Padronanza,
  RispostaData,
  Schermata,
  StatoApprendimento,
} from "../dominio/tipi";

export type Azione =
  | { tipo: "vai-a"; schermata: Schermata }
  | { tipo: "risposta-data"; risposta: RispostaData; padronanza: Padronanza }
  | { tipo: "lezione-vista"; lezione: LezioneId }
  | { tipo: "modulo-completato"; modulo: ModuloId }
  | { tipo: "assegna-xp"; punti: number }
  | { tipo: "azzera" };

export function riduttore(stato: StatoApprendimento, azione: Azione): StatoApprendimento {
  switch (azione.tipo) {
    case "vai-a":
      return { ...stato, schermata: azione.schermata };

    case "risposta-data": {
      const { risposta, padronanza } = azione;
      const nuovaPadronanza = {
        ...stato.padronanza,
        [risposta.concetto]: padronanza,
      };

      if (risposta.momento === "iniziale") {
        return {
          ...stato,
          risposteIniziali: [...stato.risposteIniziali, risposta],
          padronanza: nuovaPadronanza,
        };
      }
      if (risposta.momento === "finale") {
        return {
          ...stato,
          risposteFinali: [...stato.risposteFinali, risposta],
          padronanza: nuovaPadronanza,
        };
      }
      // "verifica" | "riverifica"
      return {
        ...stato,
        rispostePercorso: [...stato.rispostePercorso, risposta],
        padronanza: nuovaPadronanza,
      };
    }

    case "lezione-vista":
      if (stato.lezioniViste.includes(azione.lezione)) return stato;
      return { ...stato, lezioniViste: [...stato.lezioniViste, azione.lezione] };

    case "modulo-completato":
      if (stato.moduliCompletati.includes(azione.modulo)) return stato;
      return { ...stato, moduliCompletati: [...stato.moduliCompletati, azione.modulo] };

    case "assegna-xp":
      return { ...stato, xp: stato.xp + azione.punti };

    case "azzera":
      return statoIniziale();
  }
}
