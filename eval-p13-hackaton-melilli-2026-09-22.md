# Hackathon Evaluation — https://github.com/marcomelilliaccenture/hackaton
**Data:** 2026-09-22 · **Score:** 85/100

> Orchestrazione matura e disciplina sui token esemplare; robustezza del loop e portabilità degli hook restano i punti deboli.

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 88 | 24% | 21.1 |
| Instruction Quality | 90 | 19% | 17.1 |
| Idea Quality | 88 | 0% | 0 |
| Robustness | 78 | 15% | 11.7 |
| Code Quality | 78 | 12% | 9.4 |
| Tool Appropriateness | 85 | 11% | 9.4 |
| Token Efficiency | 92 | 12% | 11.0 |
| Documentation | 82 | 7% | 5.7 |
| **Overall** | | | **85** |

## Analisi per criterio

### Agentic Depth — 88/100
Sette agenti con confini di scrittura disgiunti tabulati in `build-workflow.md` §1, model tiering deliberato (opus per `orchestrator`, `slice-planner` e `clarity-guard`; sonnet per i verificatori), tre gate e i sync point S1–S3. Stato esternalizzato in un solo file mutabile (`docs/specs/status.md`, aggiornato a una riga per volta con `Edit`), spec chiusi come contratti e regola anti-propagazione «non riassumere il lavoro di un agente per un altro»: 12-Factor applicato, non citato.

### Instruction Quality — 90/100
Ogni agente dichiara cosa fa, cosa **rifiuta** e in quali path può scrivere; l'orchestratore aggiunge nove regole numerate sui token e un return contract con esempio concreto (~15 righe, codice vietato). Sovrapposizioni solo lievi — la tabella agenti in `build-workflow.md` ripete le frontmatter ma funge da indice; l'unica ambiguità vera è il caveat «se l'harness non concede `Task`» in `orchestrator.md`, che lascia indefinito chi esegue davvero il ciclo.

### Idea Quality — 88/100
Problema reale e verificabile: guidare chi deve presentare il kit postale per il permesso di soggiorno, con persona esplicita (`docs/persona.md`) e ogni valore normativo tracciato alla fonte in `docs/sources.md`. Il rifiuto esplicito di dare consigli — «lo strumento spiega una procedura, non dice cosa conviene fare» in `clarity-guard.md` — è la scelta che lo distingue da un chatbot generico.

### Robustness — 78/100
Gate reali che hanno fermato cose reali: il registro documenta la casella 77 scambiata per la 76, errore che avrebbe fatto ricopiare il numero sbagliato allo sportello; più un `PreToolUse` che nega la scrittura del brief e un `PostToolUse` con timeout a 120s, `TimeoutExpired` gestito e no-op prima dello scaffold. Manca però un limite esplicito di iterazione sul rimbalzo spec↔agente a gate rosso, e il fallback per un report malformato si ferma a «chiedi il formato».

### Code Quality — 78/100
Dominio in funzioni pure con `today` e festività iniettati, tracciabilità R-01/R-02 alle fonti nei commenti, limiti dichiarati (festività patronali non gestite) e 68 test che asseriscono su codici e non su stringhe utente. Difetti concreti in `agents/hooks/run_tests.py`: `subprocess.run([...], shell=True)` su POSIX esegue il solo `npm` ignorando gli argomenti, il launcher `py` in `settings.json` è Windows-only e i path `.claude/hooks/` non combaciano con la posizione reale `agents/hooks/`.

### Tool Appropriateness — 85/100
Frontmatter `tools:` scoped per ruolo — `orchestrator` ha `Task` ma non `Bash`, `clarity-guard` non ha `Bash`, i verificatori sì — e Playwright confinato in `e2e/` con `package.json` separato, scelta motivata per non rallentare il gate 1. `PowerShell` affiancato a `Bash` in più agenti è poco portabile, e `frontend-design`/`skill-creator` sono skill di terze parti vendorizzate più che progettate per questo dominio.

### Token Efficiency — 92/100
Strategia esplicita e coerente: nove regole numerate in `orchestrator.md` — passa path e numeri non contenuto, nessun agente apre il dossier da 45 KB, l'orchestratore non legge mai `app/src/**` ma usa `Glob` per i soli nomi — return contract a ~15 righe con divieto di restituire codice, e stato ridotto a una riga di `status.md`. Non è dichiarato nulla sul prompt caching e le skill vendorizzate restano voluminose, ma sono caricate on-demand e `slide-index.md`/`slide-selection.md` mostrano retrieval selettivo.

### Documentation — 82/100
Metodologia documentata in modo esemplare: `build-workflow.md` con ruoli, confini e gate; `status.md` come registro con gli orari; `decision-log.md` e `ai-contributions.md`, che dichiara cosa è simulato e dove serve revisione umana. Manca però un README di root — chi clona non trova un punto d'ingresso unico per avviare l'app, e i comandi (`cd app && npm test`, `cd e2e && npm test`) sono sparsi nei file degli agenti.

## Commento globale

Il progetto tratta il *come è stato costruito* come deliverable valutabile, e lo dimostra con artefatti verificabili invece che con dichiarazioni: sette agenti che rifiutano esplicitamente qualcosa, confini di scrittura disgiunti, tre gate e un registro con gli orari in cui ciascuno ha bloccato il lavoro. La disciplina sui token è la più rigorosa del lotto — nove regole operative che vietano di propagare contenuto fra agenti e riducono lo stato a una riga — e la separazione `test-author`/`builder` (D-09) è una scelta architetturale con motivazione scritta, non un vezzo: quando lo stesso agente scrive test e implementazione, il test smette di essere una prova. La catena però non ha girato per intero: B8 è passato a «verifica manuale dell'utente» e `journey-verifier` resta da eseguire, mentre `orchestrator.md` ammette di poter degradare a playbook se l'harness non concede `Task`. Sul codice applicativo i tre difetti negli hook sono il genere di cosa che si scopre solo su una macchina diversa da quella di sviluppo. Con un README di root e un limite esplicito sul rimbalzo a gate rosso, questo sarebbe un riferimento.
