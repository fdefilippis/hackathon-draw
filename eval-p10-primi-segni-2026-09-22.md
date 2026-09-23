# Hackathon Evaluation — https://github.com/sigpio/primi-segni
**Data:** 2026-09-22 · **Score:** 79/100

> Pipeline agentica matura e disciplinata, penalizzata da fallback assenti e da una memoria disallineata

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 80 | 24% | 19.2 |
| Instruction Quality | 78 | 19% | 14.8 |
| Idea Quality | 88 | 0% | 0 |
| Robustness | 70 | 15% | 10.5 |
| Code Quality | 82 | 12% | 9.8 |
| Tool Appropriateness | 83 | 11% | 9.1 |
| Token Efficiency | 76 | 12% | 9.1 |
| Documentation | 87 | 7% | 6.1 |
| **Overall** | | | **79** |

## Analisi per criterio

### Agentic Depth — 80/100
La pipeline `/feature` orchestra planner→builder→pwa-verifier→reviewer con gate espliciti, e i quattro agenti in `.claude/agents/` hanno perimetri disgiunti con model tiering deliberato (opus per il giudizio, sonnet per l'esecuzione). Manca però qualsiasi MCP, memoria persistente tra sessioni o stato intermedio esternalizzato: la catena è lineare e si esaurisce nel singolo thread.

### Instruction Quality — 78/100
Istruzioni di ottimo livello: formati di output fissi a sei sezioni in `planner.md` e `builder.md`, gate di chiarimento con limite di 2-3 domande, e l'istruzione esplicita «non fidarti della memoria, ispeziona lo stato attuale». Pesa però una staleness reale in `CLAUDE.md`, che dichiara `better-sqlite3` mentre `apps/api/package.json` e il README usano `node:sqlite`: l'unico file che dovrebbe fare da ground truth contiene un dato falso.

### Idea Quality — 88/100
Alunni NAI di prima elementare senza alfabetizzazione né supporto a casa: problema reale, con profilo utente e metrica di miglioramento verificabile documentati in `doc/concept.md`. La scelta deliberata di NON usare LLM, motivata e imposta come vincolo architetturale controllato dal reviewer, è più matura dell'uso decorativo dell'AI.

### Robustness — 70/100
Escalation umana intenzionale e ben posizionata: gate di fattibilità in `/feature`, divieto di commit senza diff visto dall'utente, hook `format.sh` best-effort che esce sempre 0, e test in `engine.test.ts` che coprono i valori esatti di soglia (a soglia, soglia-1). Manca però ogni fallback nel caso un subagente fallisca o produca output malformato, e il loop «se rosso correggi e ripeti» non ha limite di iterazione.

### Code Quality — 82/100
TypeScript strict con contratto condiviso in `packages/shared/src/index.ts`, validazione zod e 404 espliciti in `apps/api/src/server.ts`, rule engine composto da funzioni pure testate, CI con typecheck+test+build. I mapper `toExercise`/`toChild` eseguono cast non verificati su `Record<string, unknown>`, unico punto debole rilevante.

### Tool Appropriateness — 83/100
Quattro agenti con tool ristretti alla sola lettura (Bash/Read/Grep/Glob), coerente con la scelta di far scrivere il codice solo al thread principale; slash command mappati su flussi realmente ricorrenti e hook usato correttamente per la formattazione. Lieve ridondanza tra `/verify`, che elenca i passi inline, e il subagente `pwa-verifier` che esegue la stessa procedura.

### Token Efficiency — 76/100
Pattern corretto: `CLAUDE.md` volutamente corto che rimanda al concept con `@doc/concept.md`, subagenti istruiti a riportare «solo la conclusione, non i dump», formati di output fissi e `/clear` documentato tra task scollegati. Il blocco dei vincoli è però ripetuto in quattro file e non c'è alcuna strategia di prompt caching sulle istruzioni stabili.

### Documentation — 87/100
README completo di architettura, prerequisiti Node 24, tabella degli script, percorsi della PWA e credenziali demo; `doc/concept.md` copre i deliverable dell'hackathon con la metrica di verifica esplicita. Il flusso agentico è documentato sia in `CLAUDE.md` sia nel frontmatter `description` di ogni agente e comando.

## Commento globale

Progetto tra i più solidi sul piano agentico: la pipeline `/feature` non è una lista di buoni propositi ma una macchina a stati con gate, ruoli disgiunti e model tiering motivato. La scelta architetturale più interessante è aver reso i quattro subagenti read-only, lasciando la scrittura al thread principale: il diff resta revisionabile e l'ingegnere non esce mai dal loop. Il vincolo «niente LLM/ML» è tenuto con disciplina e verificato attivamente dal reviewer, e il rule engine deterministico — l'unico componente critico — è coperto da test sui valori di soglia. I due limiti reali sono l'assenza di fallback quando un subagente fallisce e una staleness in `CLAUDE.md`, che indica una dipendenza (`better-sqlite3`) diversa da quella effettivamente usata (`node:sqlite`). Con un fallback esplicito sulla catena e l'allineamento del file di memoria, il punteggio salirebbe sensibilmente.
