/**
 * Registro delle visualizzazioni educative interattive.
 *
 * Contratto verso il ticket 07:
 * - INTERATTIVI mappa ogni InterattivoId al componente corrispondente
 * - Ogni componente funziona senza prop (valori predefiniti sensati)
 * - PropsInterattivo è l'unica interfaccia di cui il ticket 07 ha bisogno
 *
 * Il ticket 07 può rendere qualsiasi interattivo senza sapere quale è:
 *   const Componente = INTERATTIVI[id];
 *   <Componente strumento={opzionale} />
 */

import type { ComponentType } from "react";
import type { InterattivoId, TipoStrumento } from "@/dominio/tipi";
import { PotereAcquisto } from "./PotereAcquisto";
import { Diversificazione } from "./Diversificazione";
import { ProprietaOPrestito } from "./ProprietaOPrestito";
import { AnatomiaStrumento } from "./AnatomiaStrumento";

export interface PropsInterattivo {
  /** Presente solo su AnatomiaStrumento: quale strumento mostrare. */
  strumento?: TipoStrumento;
}

export const INTERATTIVI: Readonly<
  Record<InterattivoId, ComponentType<PropsInterattivo>>
> = {
  "potere-acquisto": PotereAcquisto,
  "diversificazione": Diversificazione,
  "proprieta-o-prestito": ProprietaOPrestito,
  "anatomia-strumento": AnatomiaStrumento,
};
