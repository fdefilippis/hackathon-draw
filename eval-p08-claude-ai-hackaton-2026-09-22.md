# Hackathon Evaluation — https://github.com/alessandrogregoriniacn-tech/claude-ai-hackaton
**Data:** 2026-09-22 · **Score:** 79/100

> Ingegneria solida e verificabile, gate dichiarati ma non imposti

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 79 | 24% | 19.0 |
| Instruction Quality | 82 | 19% | 15.6 |
| Idea Quality | 76 | 0% | 0 |
| Robustness | 80 | 15% | 12.0 |
| Code Quality | 85 | 12% | 10.2 |
| Tool Appropriateness | 76 | 11% | 8.4 |
| Token Efficiency | 64 | 12% | 7.7 |
| Documentation | 86 | 7% | 6.0 |
| **Overall** | | | **79** |

## Analisi per criterio

### Agentic Depth — 79/100
Sei subagent con perimetri disgiunti e handoff dichiarati (`content-editor` → `ui-guardian`/`accessibility-auditor` prima del push; `figma-sync` READ → `ui-guardian`; la skill `test-coverage` delega i test finanziari a `finance-engine`), più due skill on-demand e MCP Figma. La separazione writer/reviewer è imposta a livello di capability nel frontmatter — `ui-guardian.md` non dichiara `Edit`/`Write` e quindi non *può* scrivere — ma nessun hook rende davvero obbligatori i gate marcati "OBBLIGATORIO", che restano affidati alla memoria del modello.

### Instruction Quality — 82/100
Ogni agente dichiara ambito in/out esplicito ("Restano fuori ambito: `lib/finance.ts` → `finance-engine`" in `content-editor.md`), trigger d'esempio nella `description` e output strutturato (blocco `DECISION NEEDED` con opzioni e raccomandazione); le skill hanno procedure numerate con stop espliciti ("NON tentare `firebase login` in autonomia"). Il vincolo bloccante del tema è però ribadito in `CLAUDE.md`, `content-editor.md`, `finance-engine.md` e nelle schede `agents/**/README.md`: enfasi voluta su una regola non negoziabile, ma resta duplicazione su quattro livelli.

### Idea Quality — 76/100
Simulatore retrospettivo del costo-opportunità con dataset storici reali e documentati (Banca d'Italia cubo `BOT0100`, Damodaran, MSCI World), inquadrato sul tema Inclusione Finanziaria. L'idea di base — calcolo di interesse composto — è comune; a distinguerla sono il framing retrospettivo e il divieto assoluto di consigli di investimento, tenuto con coerenza in tutto il progetto.

### Robustness — 80/100
La checklist di `finance-engine.md` è tradotta in test eseguibili: `finance.test.ts` copre date invertite, importi negativi, `MAX_SAFE_INTEGER`, strumento/periodicità sconosciuti e un fuzz test su ≥200 combinazioni che verifica assenza di throw/NaN/Infinity, con avvisi tipizzati (`SimulationWarningCode`) che impediscono clamp silenziosi. L'escalation umana è intenzionale e ben posizionata (report-prima-di-fixare, blocco del push con tre opzioni, `BLOCKED` con fallback documentato in `figma-sync.md`), ma senza hook nessuno di questi gate è realmente vincolante e nessun agente dichiara limiti di iterazione.

### Code Quality — 85/100
`finance.ts` espone funzioni pure con codici di avviso tipizzati, `dateMath.ts` documenta l'interpolazione geometrica e il contratto esplicito ("richiede una data già clampata: il clamp è responsabilità di chi chiama"), `validation.ts` motiva perché il throw a module-load non è raggiungibile da input utente. Copertura di test su `finance`/`format`/`storage`/`theme`/`faqSearch`/`dateMath`/`validation` e script di generazione che valida i CSV prima di emettere il dataset; unico neo, l'artefatto `.firebase/hosting.b3V0.cache` committato.

### Tool Appropriateness — 76/100
Il campo `tools` è usato come confine di capability reale (reviewer senza `Edit`/`Write`, `finance-engine` con), le skill coprono le due procedure ripetibili (deploy, coverage) invece di diventare agenti, e l'MCP è usato solo dove serve davvero (Figma). Penalizza il livello `agents/**/README.md`: sette file che riespongono in prosa quanto già in `.claude/agents/`, mitigati dal link alla fonte di verità ma pur sempre ridondanti.

### Token Efficiency — 64/100
Il dettaglio pesante vive nei singoli file agente, caricati solo quando quell'agente gira — selettività reale — e non ci sono `alwaysApply` proliferanti. Pesano però il `CLAUDE.md` monolitico senza `@import`, la ripetizione del vincolo di tema su quattro file, il livello duplicato `agents/**/README.md` e l'assenza di qualsiasi strategia di prompt caching sulle istruzioni stabili.

### Documentation — 86/100
`lib/data/raw/README.md` documenta per ogni fonte copertura, cadenza, provenienza e limiti noti (i buchi nelle aste BOT per singola scadenza sono dati mancanti legittimi, non errori di parsing) e `DESIGN_SYSTEM.md` riporta i rapporti di contrasto misurati per token su light e dark. Ogni agente ha la sua scheda con ruolo, ambito e trigger di invocazione; resta placeholder solo `presentation/README.md` ("i contenuti verranno aggiunti man mano").

## Commento globale

Progetto tra i più maturi del lotto sul piano dell'ingegneria: la catena vincolo → istruzione → test è chiusa e verificabile, con la checklist di `finance-engine.md` che diventa letteralmente `finance.test.ts`, fuzz test incluso. La separazione writer/reviewer imposta via `tools` nel frontmatter è la scelta architetturale migliore del repo, perché sposta una regola da prosa a capability. Il limite principale è che tutto ciò che è dichiarato "OBBLIGATORIO" — `code-reviewer` prima di ogni push, `ui-guardian` su ogni modifica visiva — non ha alcun supporto deterministico: basterebbero hook `PreToolUse` in un `settings.json` che qui non esiste. Sul fronte token, il doppio livello di documentazione degli agenti (`.claude/agents/` più `agents/**/README.md`) e la ripetizione del vincolo di tema su quattro file costano contesto senza aggiungere informazione. Con hook e un `CLAUDE.md` composto via `@import` questo repo salirebbe stabilmente sopra 85.
