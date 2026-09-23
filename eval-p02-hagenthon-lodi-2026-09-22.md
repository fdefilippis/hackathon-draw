# Hackathon Evaluation — https://github.com/michelelodi/hagenthon
**Data:** 2026-09-22 · **Score:** 72/100

> Disciplina di contesto notevole (memory versionata + catena ADR), diluita da uno sprawl di skill importate

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 67 | 24% | 16.1 |
| Instruction Quality | 80 | 19% | 15.2 |
| Idea Quality | 70 | 0% | 0 |
| Robustness | 72 | 15% | 10.8 |
| Code Quality | 78 | 12% | 9.4 |
| Tool Appropriateness | 62 | 11% | 6.8 |
| Token Efficiency | 65 | 12% | 7.8 |
| Documentation | 85 | 7% | 6.0 |
| **Overall** | | | **72** |

## Analisi per criterio

### Agentic Depth — 67/100
L'orchestrazione reale è una sola ma è fatta bene: `.claude/skills/discovery/SKILL.md` fa fan-out parallelo su `discovery-theme-explorer` (pinnato Opus+max) con contratto di ritorno e fase di riconciliazione, appoggiandosi a una memory versionata (`.claude/memory/`, un fatto per file + indice + link `[[slug]]`) e a una catena ADR in cui 0002 supera esplicitamente in parte 0001. Pesa però che dei 20+ skill in `.claude/skills/` solo `discovery` e `accenture-brand` siano scritti per questo problema, e che il runtime del prodotto sia agentico solo su due giunzioni (vision scontrini, report opzionale) per scelta dichiarata in ADR-0001.

### Instruction Quality — 80/100
`CLAUDE.md` si auto-limita ("Dettagli operativi → skill. Idea scelta e decisioni → memory. Tienilo minimale") e dichiara in testa quali propri confini sono stati superati dagli ADR, invece di restare disallineato — istruzioni oneste sulla propria deriva. `discovery-theme-explorer.md` è esemplare: rimanda la rubrica alla skill ("le definizioni stanno nella skill, non qui — niente duplicati"), fissa un default esplicito per `MODE` assente e vieta al worker di interpellare l'utente imponendo `FLAG-TRADEOFF` come canale di escalation.

### Idea Quality — 70/100
Webapp di finanze familiari ancorata a una persona concreta (Sara & Marco) e a una barriera precisa — l'onere dell'inserimento manuale — non a un "utente generico". Lo spazio è battuto, ma la mossa che chiude il loop (foto scontrino su Telegram → estrazione → auto-import senza click) attacca davvero quella barriera invece di aggiungere l'ennesima dashboard.

### Robustness — 72/100
`tools/askclaude/askclaude.mjs` è il punto forte: tassonomia d'errore tipizzata (`usage|spawn|timeout|cli|parse`), timeout con `child.kill()`, repair retry, contratto "never throws" e persino lo swallow di EPIPE su stdin. La degradazione è progettata — `report-server` spento lascia la webapp sugli insight deterministici, e lo stub `ASKCLAUDE_CLAUDE_BIN` rende la demo riproducibile offline — ma `.claude/settings.json` annulla ogni guardrail (`Bash(*)`, `skipDangerousModePermissionPrompt: true`, `defaultMode: auto`) e `pending-expenses.json` viene riscritto senza write atomica.

### Code Quality — 78/100
Per un progetto da ~5h la copertura di test di `askclaude` è fuori scala: 14 file fra e2e, payload, build-args, extract-json, stub-bin e uno smoke live opt-in, su un wrapper zero-dipendenze di 325 righe. I commenti spiegano il *perché* non ovvio — la nota sul CLI che non applica `--json-schema` agli input vision, con il workaround prompt+repair+normalizzazione, è esattamente il tipo di vincolo nascosto che merita una riga; restano però file di stato committati (`pending-expenses.json`, `settings.local.json`, `__pycache__/*.pyc`).

### Tool Appropriateness — 62/100
La scelta di tenere il core deterministico e client-side, mettendo l'LLM solo dove aggiunge valore reale (OCR scontrino, report in linguaggio naturale), è motivata in ADR-0002 e preserva la demo offline: giudizio maturo, resiste alla tentazione di LLM-izzare tutto. Il perimetro `.claude/` però è ridondante — una ventina di skill importate e inutilizzate qui (tdd, triage, wayfinder, to-tickets, resolving-merge-conflicts, setup-matt-pocock-skills…), il plugin `mattpocock-skills` abilitato *e* le stesse skill vendorizzate nel repo, con `ask-matt` che esiste come router sopra quello sprawl.

### Token Efficiency — 65/100
La regola anti-duplicazione è esplicita e ripetuta nei tre punti giusti: `CLAUDE.md` delega a skill/memory, l'indice memory vieta di duplicare ciò che è già in `CLAUDE.md` o nei `docs/`, e l'agent-def rimanda la rubrica alla skill. A pesare in negativo sono `CLAUDE_CODE_MAX_OUTPUT_TOKENS: 64000` e la superficie di discovery delle 20+ skill vendorizzate, con `accenture-brand/SKILL.md` a 6.6k caratteri più un albero `references/` e le `ui-*` che trasportano prose di installazione generiche (Figma/Penpot) estranee a questo flusso.

### Documentation — 85/100
Catena ADR con frontmatter `status`/`supersedes-in-part` e conseguenze scritte per esteso, README per componente (bot, report-server, askclaude) ciascuno con setup, percorso demo offline, tabella endpoint e variabili d'ambiente, più il contratto request/response di `askclaude` documentato con exit code e binding in tre linguaggi. Difetto concreto in una pratica per il resto rigorosa: due ADR portano lo stesso numero 0002 (`0002-report-ai-opzionale-via-askclaude.md` e `0002-scontrini-telegram-llm.md`).

## Commento globale

Il progetto vale soprattutto per come gestisce il *contesto*, non per quanti agenti mette in campo. La memory versionata nel repo con convenzione dichiarata, la catena ADR che ammette e traccia i cambi di rotta, e un `CLAUDE.md` che si tiene corto delegando altrove sono le tre cose che più raramente si vedono fatte bene in un hackathon, e qui ci sono tutte e tre. Sul piano dell'esecuzione `askclaude` è un confine LLM progettato da ingegnere — envelope tipizzato, timeout, retry, test veri — e la decisione di lasciare il core deterministico, argomentata in ADR-0002 invece che subita, protegge la demo dal rischio di rete. Quello che tiene il voto lontano dall'alto è la diluizione: una ventina di skill importate e non usate qui gonfiano il perimetro `.claude/` senza che il progetto le sappia difendere una per una, ed è proprio il criterio che il team si era dato in `CLAUDE.md` ("il `.claude/` è valutato: minimale, ordinato, spiegabile"). Con quel perimetro potato all'essenziale e i permessi riportati sotto controllo, lo stesso lavoro starebbe sensibilmente più in alto.
