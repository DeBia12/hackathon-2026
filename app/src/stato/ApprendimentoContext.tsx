import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactElement, ReactNode } from "react";
import { riduttore, type Azione } from "./riduttore";
import { caricaStato, salvaStato } from "./archivio";
import type { StatoApprendimento } from "../dominio/tipi";

type CtxValore = { stato: StatoApprendimento; invia: (a: Azione) => void };

const Ctx = createContext<CtxValore | null>(null);

export function FornitoreApprendimento({ children }: { children: ReactNode }): ReactElement {
  const [stato, invia] = useReducer(riduttore, null, () => caricaStato());

  useEffect(() => {
    salvaStato(stato);
  }, [stato]);

  return <Ctx.Provider value={{ stato, invia }}>{children}</Ctx.Provider>;
}

export function useApprendimento(): CtxValore {
  const ctx = useContext(Ctx);
  if (ctx === null) {
    throw new Error(
      "useApprendimento deve essere usato dentro FornitoreApprendimento"
    );
  }
  return ctx;
}
