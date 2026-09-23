# Hackathon Evaluation — https://github.com/sofiaiacopinelli/hackathon_2209_financing_teams
**Data:** 2026-09-22 · **Score:** 68/100

> Separazione skill deterministiche / layer LLM esemplare, ma l'orchestrazione resta dispatch single-shot

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 62 | 24% | 14.9 |
| Instruction Quality | 74 | 19% | 14.1 |
| Idea Quality | 78 | 0% | 0 |
| Robustness | 64 | 15% | 9.6 |
| Code Quality | 72 | 12% | 8.6 |
| Tool Appropriateness | 70 | 11% | 7.7 |
| Token Efficiency | 68 | 12% | 8.2 |
| Documentation | 76 | 7% | 5.3 |
| **Overall** | | | **68** |

## Analisi per criterio

### Agentic Depth — 62/100
Sette agenti registrati in `agents/orchestrator.js` con `dispatch()` a doppia modalità (routing deterministico + `autoRoute` via Claude con validazione e fallback), affiancati da un registry di sei skill pure in `app/server/skills/index.js` che calcolano i numeri prima che il modello li narri. Manca però qualsiasi multi-step: nessun handoff fra agenti, nessuno stato fra chiamate, nessuna memoria persistente, nessun MCP — ogni agente è un prompt-builder single-shot e l'unico vero subagente Claude Code è `agents/prompts/test-generator.md`.

### Instruction Quality — 74/100
`CLAUDE.md` rimanda a `agents/prompts/CODEBASE.md` come prima lettura e i template in `agents/prompts/` sono rigorosi: regole numerate obbligatorie, range contestuali concreti e formato di output esplicito (`expense-suggester.md` chiude con lo schema JSON su una riga, "nessun markdown"), più `LEVEL_STYLE` che vincola il registro con liste di termini ammessi e vietati per livello. Penalizzato perché `TASKS.md` è obsoleto — cita `app/js/app.js` e `agents/financial_agent.py` che non esistono più — e perché l'inventario dei moduli è duplicato fra `CLAUDE.md` e `CODEBASE.md`.

### Idea Quality — 78/100
Alfabetizzazione finanziaria e affordability mutuo per utenti italiani: problema reale, con l'adattamento del registro per livello (principiante/intermedio/esperto) come valore aggiunto genuino dell'AI. L'integrazione dei tassi BCE live via SDMX in `app/js/market-data.js` aggiunge concretezza rispetto al tipico progetto template.

### Robustness — 64/100
Guardrail reali sull'output del modello: `validateExpenses` in `expense-suggester.js` clampa i negativi, ripristina i valori inseriti dall'utente come verità assoluta e riscala proporzionalmente se il totale supera il 90% del reddito; `autoRoute` valida il nome dell'agente contro la mappa e fa fallback su `analyze` sia su risposta invalida sia su eccezione; `market-data.js` usa `Promise.allSettled` con default hardcoded e badge "Dati stimati" visibile. Manca però qualsiasi timeout su `callClaude` — se `claude --print` si blocca la richiesta resta appesa per sempre — non c'è retry, e `mortgage-comparator.js` invoca `compare_mortgage_offer`, skill mai registrata in `skills/index.js`, con conseguente TypeError su `cmp.comparisons`.

### Code Quality — 72/100
JSDoc coerente su ogni modulo, matematica finanziaria corretta con guardia `r === 0` (ammortamento alla francese e sua inversa in `skills/mortgage.js`), 115 test `node:test` verdi documentati in `tests/REPORT.md` con tanto di moduli esclusi e motivazione, e dipendenza circolare `navigation↔quiz` risolta deliberatamente via callback e documentata. Pesano la skill `compare_mortgage_offer` non registrata, `@anthropic-ai/sdk` e `dotenv` dichiarati in `app/server/package.json` ma mai usati (il transport è il subprocess `claude --print`), e `__dirname` calcolato e inutilizzato in tre file agente.

### Tool Appropriateness — 70/100
La scelta di tenere il calcolo finanziario in skill JS pure e lasciare al modello solo la prosa è la decisione architetturale migliore del repo, e `claude --print` come transport senza API key è pragmatico e motivato esplicitamente nel README. Sottrae punti la ridondanza fra `mortgage-advisor`, `mortgage-comparator` e `mortgage-coach` — tre agenti mutuo con input e framing largamente sovrapposti — e il router LLM `autoRoute`, che costa una chiamata Claude intera ma non viene mai esercitato perché `app/js/ai.js` chiama sempre gli endpoint deterministici.

### Token Efficiency — 68/100
Buone pratiche diffuse: template esterni caricati uno alla volta da `loadPrompt`, cap espliciti sull'output in ogni prompt ("max 280 parole", "max 2 frasi"), anti-preambolo sul JSON, troncamento del payload di routing a 800 char, sezioni opzionali costruite come stringa vuota quando non pertinenti e `ALREADY_SHOWN` in `tip-explainer` per non ripetere concetti già mostrati. Nessuna strategia di caching però — `LEVEL_STYLE` e l'intero template vengono rispediti inline a ogni chiamata, limite intrinseco del transport scelto — e l'istruzione "leggi prima CODEBASE.md" carica una seconda copia dell'inventario moduli già presente in `CLAUDE.md`.

### Documentation — 76/100
README con avvio in due comandi, prerequisiti e albero annotato file per file; `CLAUDE.md` con i diagrammi di architettura frontend e server incluse le sette route; `CODEBASE.md` con tabella modulo → responsabilità → export reali e guida "dove metto X?"; `tests/REPORT.md` che dichiara anche cosa non è testato e perché. Il difetto serio è la contraddizione sull'avvio: `TASKS.md` indica `python3 -m http.server 8080` e `.claude/launch.json` lancia un http.server Python sulla 8081, mentre il server vero è Express sulla 3000.

## Commento globale

Il progetto centra la decisione architetturale che più conta in un'app finanziaria assistita da AI: i numeri li calcola codice deterministico e testato, il modello si limita a spiegarli, con i template di prompt esterni e un `LEVEL_STYLE` che adatta il registro in modo verificabile. Il layer di validazione dell'output — `validateExpenses` che riafferma i valori utente come verità e il fallback di `autoRoute` — dimostra che gli autori hanno pensato a cosa succede quando il modello sbaglia, cosa rara a questo livello. Il limite è che l'impianto resta un dispatcher di prompt: nessun handoff fra agenti, nessuno stato condiviso, nessuna memoria, e il router LLM costruito con cura non viene mai realmente usato dal frontend. A questo si somma un debito concreto — la skill `compare_mortgage_offer` mai registrata rende `mortgage-comparator` non funzionante, e tre file contraddicono il README sulle istruzioni di avvio. Con un timeout su `callClaude` e la registrazione della skill mancante il progetto guadagnerebbe subito diversi punti in robustezza.
