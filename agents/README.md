# agents/

Agenti Claude usati **dall'applicazione a runtime**.

> Da non confondere con `.claude/agents/`, che contiene i subagent usati **durante lo
> sviluppo** dentro Claude Code. Qui sta il codice che gira nel prototipo.

## Configurazione

```bash
cp ../.env.example ../.env     # poi inserisci ANTHROPIC_API_KEY
npm install
```

## Uso

```bash
node --env-file=../.env --experimental-strip-types src/cli.ts lezione "interesse composto"
node --env-file=../.env --experimental-strip-types src/cli.ts semplifica "Il tasso di interesse nominale annuo..."
```

## Struttura

| File | Ruolo |
|---|---|
| `src/client.ts` | Client condiviso: un solo punto per modello, log e gestione errori |
| `src/agenti/semplificatore.ts` | Riscrive testi in linguaggio semplice; valuta la leggibilità |
| `src/catene/lezione.ts` | Prompt chaining a 3 passaggi: struttura → contenuto → semplificazione |
| `src/cli.ts` | Interfaccia a riga di comando |

## Perché il prompt chaining

`generaLezione` usa tre chiamate invece di una. Una singola chiamata che fa tutto
produce risultati più generici, e quando sbaglia non si capisce quale parte del prompt
correggere. Con la catena, ogni passaggio ha un compito solo: se l'esempio numerico è
debole si corregge il passaggio 2, se il linguaggio è complesso il passaggio 3.

Costo: ~3x token e latenza. In un prototipo va bene; in produzione si valuterebbe
se unire i passaggi 1 e 2.

## Sicurezza

`ANTHROPIC_API_KEY` non deve **mai** finire nel frontend: nessuna variabile con
prefisso `VITE_` deve contenerla. Le chiamate partono da qui o da un endpoint server.
