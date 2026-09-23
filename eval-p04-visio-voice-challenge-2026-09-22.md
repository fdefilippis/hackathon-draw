# Hackathon Evaluation — https://github.com/giuseppe-maria-ingra-acn/visio-voice-challenge-hackathon
**Data:** 2026-09-22 · **Score:** 85/100

> Squadra agentica con perimetri disgiunti e un invariante verificabile a macchina: fra i lavori più maturi del lotto

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 87 | 24% | 20.9 |
| Instruction Quality | 88 | 19% | 16.7 |
| Idea Quality | 90 | 0% | 0 |
| Robustness | 80 | 15% | 12.0 |
| Code Quality | 85 | 12% | 10.2 |
| Tool Appropriateness | 88 | 11% | 9.7 |
| Token Efficiency | 72 | 12% | 8.6 |
| Documentation | 92 | 7% | 6.4 |
| **Overall** | | | **85** |

## Analisi per criterio

### Agentic Depth — 87/100
Otto agenti in `.claude/agents/` con perimetri di file disgiunti per costruzione, cinque skill di fase (`vv-kickoff` → `vv-build` → `vv-gate` → `vv-demo`) e quattro hook che coprono SessionStart, PostToolUse e SubagentStop, con tiering opus/sonnet motivato in `docs/AGENT-TEAM.md`. Lo stato è esternalizzato davvero — `SessionState` immutabile che evolve per copia, `AgentTrace` che conserva gli intermedi, `session-context.sh` che ricostruisce l'avanzamento leggendo il filesystem invece della memoria, e `docs/.agent-activity.log` append-only da cui `demo-director` genera la mappa del contributo AI.

### Instruction Quality — 88/100
Ogni agente dichiara ordine di consegna con degradazione esplicita ("se il tempo finisce consegna i primi"), perimetro di possesso, contratto con firme Java esatte e — cosa rara — il *perché* di ogni vincolo: in `fidelity-auditor.md` l'assenza di `Write` è argomentata come ragione d'essere, non come limite. `CLAUDE.md` è tenuto a 5 KB con la regola esplicita di rimandare a `docs/`; le sovrapposizioni residue sono lievi (la tabella perimetri in `docs/AGENT-TEAM.md` ripete i singoli agent, `vv-gate` ripete parte di `docs/COME-TESTARE.md`).

### Idea Quality — 90/100
Il problema è reale e tipizzato sui criteri WCAG più violati, non un caso inventato: la persona (`docs/PERSONA.md`) è precisa e il servizio è descritto come dati in `resources/scenarios/`, così il motore resta generico. Notevole l'onestà intellettuale di marcare la replica come `RICOSTRUITO` in `docs/EVIDENCE.md` invece di spacciarla per osservazione diretta.

### Robustness — 80/100
Fallback reali e non dichiarativi: `MockLlmClient` è `@Primary` così la demo gira offline, e una fixture mancante produce una risposta *dichiarata come dedotta* invece di inventata; `java-build-gate.sh` esce con codice 2 e risveglia l'agente sul build rotto, `invariant-guard.sh` blocca i dati di dominio ma si limita ad avvisare sull'euristica provenance — distinzione ragionata e scritta nel commento. Mancano però un retry esplicito sul client LLM reale e un limite di iterazione dichiarato nella catena degli agenti; il recupero da un builder che consegna test rossi è lasciato al giudizio dell'orchestratore umano.

### Code Quality — 85/100
`ProvenanceGate` è una `final class` con costruttore privato, regex precompilate e Javadoc che dichiara i propri limiti in `SEMANTIC_LIMIT_NOTE`, propagato in ogni `FidelityReport`; `IbanValidator` implementa mod-97-10 a blocchi anziché costruire un `BigInteger` da 30 cifre, con messaggi d'errore pronunciabili. I record usano `requireNonNull` e `List.copyOf` per un'immutabilità vera, e gli 11 file di test hanno nomi che descrivono il caso; resta un po' contorto il ramo IBAN estero, che commenta "il servizio INPS richiede IBAN italiano" ma poi valida comunque.

### Tool Appropriateness — 88/100
I tool sono calibrati per ruolo senza ridondanze: `fidelity-auditor` senza `Write`/`Edit` per costruzione, `scenario-researcher` con `WebSearch`/`WebFetch` che gli servono davvero, `demo-director` confinato a `docs/`. Gli hook usano i matcher corretti con timeout proporzionati (10s per il log, 20s per il guard, 180s per il build) e `asyncRewake` solo dove l'operazione è lenta.

### Token Efficiency — 72/100
La strategia selettiva è dichiarata e applicata: `CLAUDE.md` fermo a 5 KB con rimando esplicito a `docs/` "che gli agenti leggono su richiesta", documentazione spezzata per argomento e skill caricate per fase, nessun `alwaysApply` oltre al file di progetto. Il punto debole è `docs/ARCHITECTURE.md` a 37,8 KB dichiarato normativo per i builder, più la duplicazione della tabella perimetri fra `docs/AGENT-TEAM.md` e i singoli agent.

### Documentation — 92/100
README con le barriere tipizzate e i contesti d'applicazione in forma tabellare, nove documenti in `docs/` che coprono persona, prove, architettura, piano e strategia di test, e un diagramma dell'ordine di lancio degli agenti. `docs/COME-TESTARE.md` fa una cosa che quasi nessuno fa: dichiara quale livello di verifica **non** è automatizzabile e avverte di non rimandarlo.

## Commento globale

È il progetto in cui la struttura agentica non è decorativa ma porta il peso del prodotto: i perimetri disgiunti degli otto agenti sono la precondizione che rende possibile il parallelismo, e la separazione fra chi costruisce e chi verifica è imposta togliendo i tool di scrittura all'auditor invece che raccomandandola a parole. L'invariante di provenance è la scelta più forte, perché trasforma due requisiti vaghi — semplificare senza tradire, dichiarare dove ha lavorato l'AI — in qualcosa che `ProvenanceInvariantTest` verifica meccanicamente, e il gate dichiara i propri limiti semantici invece di nasconderli. La robustezza è buona ma non completa: mancano retry e limiti di iterazione espliciti, e il recupero da un builder fallito resta umano. Il costo maggiore è in efficienza di contesto, con un `ARCHITECTURE.md` da 37 KB dichiarato normativo che stride con la disciplina applicata altrove. Nel complesso un lavoro che regge la lettura ravvicinata e che un team potrebbe riprendere in mano senza spiegazioni a voce.
