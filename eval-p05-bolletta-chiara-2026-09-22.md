# Hackathon Evaluation — https://github.com/piercarmine-de-marco/bolletta-chiara
**Data:** 2026-09-22 · **Score:** 66/100

> Orchestrazione e prompt eccellenti, runtime dev-only ne limita la maturità

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 70 | 24% | 16.8 |
| Instruction Quality | 85 | 19% | 16.2 |
| Idea Quality | 85 | 0% | 0 |
| Robustness | 55 | 15% | 8.3 |
| Code Quality | 52 | 12% | 6.2 |
| Tool Appropriateness | 60 | 11% | 6.6 |
| Token Efficiency | 60 | 12% | 7.2 |
| Documentation | 62 | 7% | 4.3 |
| **Overall** | | | **66** |

## Analisi per criterio

### Agentic Depth — 70/100
Orchestratore a eventi reale (`src/agents/orchestratore.js`) che instrada `BOLLETTA_CARICATA` / `RECLAMO_AVVIATO` / `UTENTE_BLOCCATO` verso sei agenti a scope disgiunto, con stato esternalizzato nel context documentato come contratto immutabile in `CLAUDE.md` e log per ogni transizione evento→agente→esito. La profondità è però limitata da agenti sottili — wrapper di prompt più chiamata CLI, senza pianificazione né iterazione — e da un runtime che vive unicamente nel middleware dev di `vite.config.js`.

### Instruction Quality — 85/100
I sei file in `src/prompts/` dichiarano schema JSON esatto, regole di mappatura campo per campo, tipi, limiti di lunghezza e vincoli negativi espliciti ("non suggerire quale opzione scegliere"), con anti-preamble sistematico su ogni prompt. `CLAUDE.md` separa contratto dati immutabile, tabella eventi→agenti, regole UI misurabili (18px minimi, bottoni 48px) e priorità MUST/NICE/TAGLIA; unico neo l'istruzione di incollare l'intero file a ogni sessione.

### Idea Quality — 85/100
Problema concreto e ben circoscritto — una persona anziana bloccata davanti a un form burocratico — con l'AI che porta valore reale su estrazione PDF, autocompilazione e semplificazione del linguaggio. La scelta etica di vietare al tool ogni interpretazione o consiglio (sezione "Il tool non deve mai") è matura per un'utenza vulnerabile.

### Robustness — 55/100
Ogni ramo dell'orchestratore ha try/catch con log dell'esito, gli agenti traducono gli errori tecnici in messaggi semplici, i timeout CLI sono espliciti (60s) e `parseClaudeResponse` difende dal fence markdown; l'HITL è intenzionale e strutturale, non un ripiego. Mancano però retry, validazione a runtime dello schema e soprattutto un percorso degradato: se `estratto-agent.js` fallisce Maria resta senza alternativa, e `CLAUDE.md` colloca esplicitamente la gestione errori sotto "TAGLIA SUBITO".

### Code Quality — 52/100
`CLAUDE_BIN` è un path assoluto alla home di uno sviluppatore, duplicato in quattro file, e il bridge `/api/claude` vive in `configureServer` di `vite.config.js`: il progetto non è eseguibile da altri né deployabile, nonostante `@anthropic-ai/sdk` sia già in dipendenza e mai usato. Pesano anche le funzioni di test con auto-invocazione a module scope dentro gli agenti di produzione e il reducer duplicato tra `BollettaContext.jsx` e `scripts/test-orchestratore.mjs`, già divergenti nei campi.

### Tool Appropriateness — 60/100
La decomposizione è corretta e senza ridondanze: sei agenti per sei trasformazioni distinte, con Soccorso e Reclamo giustamente marcati opzionali in `CLAUDE.md`. Sbagliato invece il meccanismo di integrazione — `spawnSync` sulla CLI da un middleware Vite al posto dell'SDK già installato, scelta che trascina con sé path hardcoded, chiamate bloccanti e impossibilità di deploy.

### Token Efficiency — 60/100
Buona disciplina a runtime: prompt come costanti stabili separate dal payload variabile, contesto selettivo per agente e anti-preamble sistematico con tetti di lunghezza espliciti (150 parole, 2 frasi, 3 opzioni da 10 parole). Penalizzano l'assenza di prompt caching — ogni `claude -p` è un processo nuovo che ri-invia il system prompt — l'istruzione di incollare tutto `CLAUDE.md` a ogni sessione e lo storico non limitato passato a `soccorso-agent.js`.

### Documentation — 62/100
`CLAUDE.md` documenta in modo esemplare flusso agentico, diagramma dell'architettura, tabelle eventi/action e struttura delle cartelle. Il `README.md` è però una sola riga e manca qualsiasi istruzione di setup, lacuna critica qui perché l'esecuzione richiede la CLI Claude installata in un path specifico.

## Commento globale

BollettaChiara è il caso in cui il layer di progettazione agentica vale più dell'implementazione: l'orchestratore a eventi, i sei agenti a scope disgiunto e il contratto JSON dichiarato immutabile compongono un'architettura leggibile e coerente, e i prompt in `src/prompts/` sono tra i più rigorosi visti per schema e vincoli negativi. La debolezza sta nel runtime: l'integrazione via `spawnSync` sulla CLI dentro il middleware dev di Vite, con il binario hardcoded sulla home di uno sviluppatore, rende il progetto non eseguibile da terzi e non deployabile, mentre `@anthropic-ai/sdk` resta installato e inutilizzato. Sul fronte affidabilità mancano retry e percorso degradato, e per un tool di accessibilità il fallimento dell'estrazione lascia proprio l'utente target senza alternative — un rischio che `CLAUDE.md` accetta esplicitamente mettendo la gestione errori tra le cose da tagliare. Con il README ridotto a una riga, il progetto documenta benissimo come è pensato e per niente come si esegue.
