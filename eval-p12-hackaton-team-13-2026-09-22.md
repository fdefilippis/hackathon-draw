# Hackathon Evaluation — https://github.com/contug/hackaton-team-13
**Data:** 2026-09-22 · **Score:** 64/100

> Ingegneria del contesto e disciplina di verifica eccellenti, ma privo di un vero strato di orchestrazione

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 38 | 24% | 9.1 |
| Instruction Quality | 88 | 19% | 16.7 |
| Idea Quality | 85 | 0% | 0 |
| Robustness | 72 | 15% | 10.8 |
| Code Quality | 84 | 12% | 10.1 |
| Tool Appropriateness | 55 | 11% | 6.1 |
| Token Efficiency | 42 | 12% | 5.0 |
| Documentation | 86 | 7% | 6.0 |
| **Overall** | | | **64** |

## Analisi per criterio

### Agentic Depth — 38/100
Nessun sub-agente, nessun MCP, nessuna skill scritta dal team e nessun workflow multi-step con handoff: il lavoro è svolto da un singolo agente nel thread principale con un solo hook `PostToolUse` (`agents/.claude/settings.json`). Riconosciuto invece il pattern di memoria persistente realmente ingegnerizzato — `claude-changelog.md` append-only con `.gitattributes merge=union`, che rende lo stato condivisibile tra worktree paralleli (due merge di feature branch nella history) senza conflitti.

### Instruction Quality — 88/100
`app/CLAUDE.md` è di qualità rara: vincoli di prodotto dichiarati come design non negoziabile ("It is not a chat"), sezione *Out of scope* esplicita, formato d'ingresso del changelog imposto con campo `Verify:` che deve nominare il test, e motivazione tecnica per ogni divieto (perché non `ResizeObserver`, perché non `wxt:locationchange`, perché il native value setter). Limite: file monolitico che mescola regole sempre valide e narrativa implementativa profonda, senza separazione tra parte stabile e parte variabile.

### Idea Quality — 85/100
Ridurre il carico cognitivo su pagine dense con un walkthrough guidato che sopravvive alla navigazione, ancorato a elementi reali del DOM e con autofill, è un problema autentico con una forte angolazione di accessibilità. La visione di prodotto è netta e difesa architetturalmente: una sola risposta a schermo, nessuno scrollback.

### Robustness — 72/100
Degradazione a tre stadi sulle risposte strutturate (schema → retry con JSON inlined nel prompt → testo grezzo) che non lancia mai un parse error non gestito, `friendlyError` che mappa ogni status HTTP, e un gate di autofill solido — solo su azione dell'utente, con blocklist su `password`, `cc-number`, `cc-csc`, `cc-exp`, `one-time-code`, `disabled`, `readOnly`. Buco concreto: **nessun timeout sulle chiamate LLM** — `signal?: AbortSignal` è cablato nelle firme di `summarizePage`/`askAboutPage`/`nextSteps` ma `lib/handlers.ts` non lo passa mai, quindi una richiesta appesa non rientra.

### Code Quality — 84/100
16 file di test (Vitest + jsdom) più Playwright end-to-end sull'estensione realmente buildata, con `npm run check` come gate dichiarato. La disciplina di purezza è architettura vera, non stile: `lib/spotlight.ts` e `lib/journey.ts` sono funzioni pure su rect e JSON proprio perché jsdom non implementa layout, quindi la geometria resta dimostrabile. `lib/openrouter.ts` — API AI esterna, valutata qui — è curato (classe d'errore tipizzata, schemi `strict` con workaround documentati, clamp client-side); resta il difetto del parametro `signal` cablato ma mai fornito.

### Tool Appropriateness — 55/100
Le scelte del team sono azzeccate: hook per i test con allowlist di path, così una modifica a `CLAUDE.md` o al changelog non innesca una run; worktree paralleli per le feature. Penalizzato però l'inserimento di 37 skill BMAD di terze parti in `agents/global-claude-settings/skills/` nel commit "global claude setup" delle 13:30, due minuti prima dell'ultimo commit e dopo che tutte le feature erano già mergiate: materiale ridondante e mai usato per costruire il progetto.

### Token Efficiency — 42/100
Lo strato agentici sempre attivo è ampio e senza alcuna strategia: `CLAUDE.md` pesa ~17.8 KB (~4.4k token) in un unico blocco, senza `@import` né separazione tra regole stabili e narrativa implementativa. A questo si somma `claude-changelog.md` a ~37 KB (~9.3k token) in crescita monotona e scritto a ogni turno per mandato, più le 37 skill vendored che restano nella superficie globale pur essendo estranee al progetto. Nessun prompt caching dichiarato, nessun chunking, nessun pattern index-first; il contenuto però non è ridondante, il che evita il cap pieno.

### Documentation — 86/100
`README.md` è asciutto e corretto — layout del repo, getting started, tabella comandi, stack, e il rimando esplicito a `CLAUDE.md` come documento autoritativo. Il changelog fornisce un audit trail completo di 24 entry e l'ultima registra con onestà non comune i limiti noti: race del poll URL non asserita, click invisibili dentro shadow DOM e iframe, controlli duplicati non indirizzabili, e "the one leak by design". Manca però una spiegazione del flusso agentici per il lettore e nulla segnala che l'albero BMAD è di terze parti e inutilizzato.

## Commento globale

Il progetto è forte dove conta di più per un prodotto reale e debole proprio sull'asse agentici che pesa di più in questa valutazione. La qualità di `CLAUDE.md`, la disciplina del changelog append-only reso mergiabile tra worktree e l'hook `PostToolUse` con allowlist mostrano una comprensione matura di come si governa un agente: regole deterministiche invece di speranze, e memoria esternalizzata invece di contesto trattenuto. Manca però qualunque orchestrazione — nessun sub-agente, nessun handoff, nessun MCP — e le 37 skill BMAD aggiunte a lavoro finito non colmano quel vuoto, anzi pesano come ridondanza. Sul piano applicativo la degradazione a tre stadi dell'output strutturato e il gate di autofill sono robustezza autentica, ma l'assenza di timeout sulle chiamate LLM è una falla concreta e facilmente chiudibile, resa più evidente dal fatto che il parametro `signal` è già cablato e attende solo di essere passato. Con un layer di deleghe e un chunking di `CLAUDE.md` questo sarebbe un progetto di fascia alta.
