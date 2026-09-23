# Hackathon Evaluation — https://github.com/RaffaelePacilio/hackton
**Data:** 2026-09-22 · **Score:** 80/100

> Architettura agentica rigorosa e contratti eccellenti, penalizzata da igiene del repo e duplicazione dei prompt

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 82 | 24% | 19.7 |
| Instruction Quality | 84 | 19% | 16.0 |
| Idea Quality | 90 | 0% | 0 |
| Robustness | 86 | 15% | 12.9 |
| Code Quality | 70 | 12% | 8.4 |
| Tool Appropriateness | 78 | 11% | 8.6 |
| Token Efficiency | 68 | 12% | 8.2 |
| Documentation | 84 | 7% | 5.9 |
| **Overall** | | | **80** |

## Analisi per criterio

### Agentic Depth — 82/100
`packages/agent-runtime/src/orchestrator.ts` implementa un guscio deterministico attorno a una singola chiamata LLM per Barrier, con provider chain a tre livelli (reale/stub/null) e uno Skill Registry chiuso di 22 skill versionate (`packages/skill-sdk/registry/`) che esclude per design la generazione di codice a runtime. Il layer Claude è però documentale — 20 prompt in `aua/docs/agent-prompts.md` da incollare a mano in agenti paralleli — senza primitive native configurate (`.claude/agents`, skills, hooks, MCP assenti).

### Instruction Quality — 84/100
I prompt sono tra i migliori del lotto: perimetri disgiunti espliciti ("Stay within packages/shared/", "non modificare quel file, un altro agente se ne occuperà"), lista di lettura preventiva in sola lettura, branch dedicato per agente e firme dei tipi da implementare al dettaglio. Penalizzano la convivenza di `agent-prompts.md` (v1, 20 prompt) e `agent-prompts-v2/` (14 prompt) senza indicazione di quale sia autoritativo, e i path assoluti Windows hardcoded divergenti tra le due versioni.

### Idea Quality — 90/100
Il problema è inquadrato con precisione non banale: il fallimento di accessibilità come *mismatch di modalità* tra ciò che il controllo richiede e ciò che l'utente può eseguire, su siti terzi non modificabili e in tempo reale. L'approccio agentico è genuinamente necessario — non decorativo — e l'`InteractionContract` dichiarato dall'utente mantiene il bootstrap deterministico e indipendente dall'LLM.

### Robustness — 86/100
L'orchestratore converte ogni eccezione del provider in un esito `decline` strutturato senza mai rilanciare, e valida che la skill scelta appartenga al registry rifiutando le allucinazioni del modello. Il contratto skill porta `errorModel` con flag `retryable`, `rollback`, `verificationStrategy` e classi di capability che isolano `PAYMENT`/`AUTHENTICATE`/`DESTRUCTIVE`, con HITL esplicito via `confirm-with-user` e precondizioni di acknowledgement su `WRITE_PERSONAL_DATA`.

### Code Quality — 70/100
Il codice TypeScript è pulito e tipizzato con onestà — `IntentResolutionResult` esiste proprio per non forzare la risoluzione di intent dentro `AgentDecision` — con test su orchestrator, semantic-model, page-bridge e storage. Grave debito di igiene: `.playwright-profile/` è committato con 176 file di profilo browser (Cache, History, LOG, Local Storage), insieme a `dist/` e `tsconfig.tsbuildinfo`, su 529 file totali di cui solo 353 pertinenti.

### Tool Appropriateness — 78/100
Le scelte di fondo sono corrette e motivate: ADR-005 rifiuta esplicitamente un framework di orchestrazione portando evidenze, l'LLM è confinato alla sola superficie di reasoning e il bootstrap resta deterministico. Resta però un mismatch: un workflow di 20 agenti paralleli su scope disgiunti è esattamente il caso d'uso dei subagenti configurati, e gestirlo via copia-incolla manuale di prompt è lo strumento più debole per quel task.

### Token Efficiency — 68/100
Positivo il retrieval selettivo: ogni prompt elenca i file da leggere in sola lettura invece di assumere l'intero repo in contesto, e i contratti congelati evitano che gli agenti li ri-derivino. Pesano invece la duplicazione sostanziale tra v1 e v2 degli stessi prompt, le firme dei tipi ripetute verbatim nei prompt quando esistono già in `packages/contracts`, e l'assenza di un indice sui 20 ADR per l'accesso mirato.

### Documentation — 84/100
Corredo documentale notevole: 20 ADR numerati, documenti di architettura (executive summary, system context, runtime flows), 4 contratti formali, 6 work package, DAG delle dipendenze e un deck Marp con diagrammi mermaid. Manca però un README di root: chi arriva sul repo non ha né punto d'ingresso né istruzioni di setup.

## Commento globale

È il progetto architetturalmente più maturo del lotto: la separazione tra decisione agentica e esecuzione è netta, lo Skill Registry chiuso e versionato elimina per costruzione la classe di rischi legata al codice generato al volo, e il tracciamento `determinedBy: "rule" | "inference"` rende ogni decisione attribuibile. La robustezza non è dichiarata ma codificata nei tipi — l'orchestratore che rifiuta una skill non registrata è il genere di guardrail che raramente si vede in un hackathon. I limiti sono di esecuzione più che di impianto: il profilo Playwright committato per errore gonfia il repo di un terzo, la coesistenza di due generazioni di prompt lascia ambiguità su cosa sia autoritativo, e l'orchestrazione multi-agente resta manuale dove le primitive native l'avrebbero resa riproducibile. Con un `.gitignore` corretto, il consolidamento dei prompt in un'unica versione e i 20 agenti portati su `.claude/agents/`, questo progetto starebbe stabilmente sopra 85.
