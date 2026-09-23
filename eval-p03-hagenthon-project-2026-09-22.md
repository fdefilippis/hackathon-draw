# Hackathon Evaluation — https://github.com/MWNemesis/hagenthon-project
**Data:** 2026-09-22 · **Score:** 72/100

> Orchestrazione skill/agenti ben separata e documentata, penalizzata da duplicazione del codice e tool dichiarati incoerenti con il compito

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 78 | 24% | 18.7 |
| Instruction Quality | 82 | 19% | 15.6 |
| Idea Quality | 80 | 0% | 0 |
| Robustness | 68 | 15% | 10.2 |
| Code Quality | 62 | 12% | 7.4 |
| Tool Appropriateness | 62 | 11% | 6.8 |
| Token Efficiency | 64 | 12% | 7.7 |
| Documentation | 84 | 7% | 5.9 |
| **Overall** | | | **72** |

## Analisi per criterio

### Agentic Depth — 78/100
Architettura a due livelli con separazione netta: 7 skill invocabili (`agents/skills/`) e 5 agenti specializzati delegati (`agents/agents/`), con orchestratore esplicito in `generate-mission.md` che gestisce un flusso a 6 fasi con checkpoint. Lo stato è esternalizzato in `app/missions/_catalog.json` con campo `status: ready|incomplete` che fa da vero handoff tra `portal-analyzer` e `batch-generate`; manca però memoria persistente tra sessioni e qualsiasi limite di iterazione.

### Instruction Quality — 82/100
Istruzioni notevolmente precise: `create-mission.md` fissa soglie numeriche (base ≤5 step, medio 6–10, avanzato >10), enum chiusi per `action` e convenzioni camelCase per i `target`, mentre `validate-mission.md` usa tabelle di check con severità Critico/Warning distinta. Spicca il vincolo motivato in `validate-mission.md` Fase 3 — saltare il test browser se ci sono errori bloccanti perché "inaffidabile e costoso" — e l'ottimizzazione in `simulator-builder.md` che impone un'analisi globale degli screenshot prima di generare HTML.

### Idea Quality — 80/100
Problema reale e concreto: formare i neoassunti sulle procedure del portale aziendale, con missioni timesheet plausibili e non inventate. La scelta di confinare l'AI alla sola fase di generazione, lasciando l'app runtime a zero chiamate esterne e offline-capable, è una decisione di design sensata e non un limite.

### Robustness — 68/100
HITL intenzionale e ben posizionato: quattro checkpoint espliciti in `generate-mission.md` con opzioni approva/modifica/annulla, esclusione automatica delle missioni `incomplete` in `batch-generate.md`, e `mission-tester.md` che testa anche il path negativo saltando volutamente uno step. Manca però qualsiasi fallback se un agente fallisce o restituisce output malformato, e nel codice non c'è un solo `try/catch`: `JSON.parse(sessionStorage.getItem(...))` in `tracker.js:complete()` esplode su dati corrotti.

### Code Quality — 62/100
Difetto concreto: la funzione `evaluate()` è duplicata verbatim in `app/js/tracker.js` e `app/js/evaluator.js`, entrambe in scope globale — se le due pagine caricassero entrambi gli script si avrebbe una ridefinizione silenziosa. Il modulo `Tracker` è per il resto pulito (IIFE con closure, `getLog()` che ritorna una copia, event delegation via `closest()`), ma la valutazione con `log.some()` ignora l'ordine degli step, il che è discutibile in uno strumento che insegna procedure sequenziali.

### Tool Appropriateness — 62/100
La distinzione skill/agente è ragionata e tabellata in `agents/README.md`, e gli agenti che servono il browser (`mission-tester.md`, `test-runner.md`) dichiarano correttamente i tool MCP `Claude_Browser`. Il problema è che `portal-analyzer.md` e `simulator-builder.md` — i due agenti il cui compito dichiarato è analizzare screenshot, con input `SCREENSHOTS: [<immagine>, ...]` — espongono nel frontmatter solo `Read`/`Write`/`Bash`, senza alcun tool di visione.

### Token Efficiency — 64/100
Il caricamento è selettivo per costruzione: le skill si attivano su invocazione `/nome-skill` e `agents/README.md` funziona da indice che rimanda ai singoli file, senza alcun CLAUDE.md monolitico sempre attivo. Pesa però la duplicazione tra livelli: il template HTML completo compare quasi identico sia in `generate-simulator.md` sia in `simulator-builder.md`, e lo schema JSON della missione è ridescritto tra `create-mission.md`, `validate-mission.md` e `portal-analyzer.md` — contenuto che viene caricato due volte a ogni delega.

### Documentation — 84/100
Doppio livello di documentazione efficace: il `README.md` di root copre architettura, split generazione/fruizione, albero del progetto e diagramma del flusso di creazione, mentre `agents/README.md` fornisce il catalogo completo con tabelle file/invocazione/output e una tabella decisionale skill-vs-agente. Ogni file di skill e agente è poi autodocumentato con Scopo, Come invocarla e Processo; resta poco chiaro come la cartella `agents/` vada mappata sulla configurazione reale di Claude Code.

## Commento globale

Il progetto è uno dei più ordinati sul piano dell'organizzazione agentica: la separazione tra skill invocabili e agenti delegati non è nominale ma sostanziata da criteri espliciti, e il passaggio di stato via `_catalog.json` con flag di completezza è un handoff vero tra componenti, non una semplice catena di prompt. Le istruzioni sono sopra la media per densità di vincoli verificabili — soglie numeriche, enum chiusi, tabelle di check con severità — e in più punti spiegano il perché di una regola invece di limitarsi a imporla. Il divario si apre scendendo verso l'implementazione: `evaluate()` duplicata in due file globali è debito tecnico immediato, l'assenza totale di error handling nel JavaScript contraddice la cura riposta nella validazione a monte, e i due agenti che devono leggere screenshot non dichiarano tool di visione. Manca inoltre qualsiasi strategia per il caso in cui un agente fallisca: tutti i checkpoint previsti presuppongono un output ben formato. Con la deduplicazione del codice, un allineamento dei tool dichiarati e un fallback esplicito sugli agenti, il progetto salirebbe agevolmente sopra l'80.
