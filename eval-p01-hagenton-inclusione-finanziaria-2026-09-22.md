# Hackathon Evaluation — https://github.com/VeronicaFontana/hagenton-inclusione-finanziaria
**Data:** 2026-09-22 · **Score:** 69/100

> Layer agentico di qualità notevole, artefatto consegnato che non ne raccoglie i frutti

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 78 | 24% | 18.7 |
| Instruction Quality | 85 | 19% | 16.2 |
| Idea Quality | 80 | 0% | 0 |
| Robustness | 45 | 15% | 6.8 |
| Code Quality | 58 | 12% | 7.0 |
| Tool Appropriateness | 76 | 11% | 8.4 |
| Token Efficiency | 70 | 12% | 8.4 |
| Documentation | 55 | 7% | 3.9 |
| **Overall** | | | **69** |

## Analisi per criterio

### Agentic Depth — 78/100
Dieci agenti in `.claude/agents/` con perimetri disgiunti e dichiarati per negazione (ogni file elenca cosa *non* tocca e nomina l'agente proprietario), più un `orchestratore-agent.md` che possiede il tool `Agent` e scompone la richiesta per ambito prima di delegare; `compliance-reviewer-agent.md` è di sola lettura con mandato esplicito "identifichi, non correggi", una vera separazione dei poteri. Manca però il livello architetturale: nessuno stato esternalizzato tra agenti, nessun contratto di output strutturato negli handoff, model tiering piatto (tutti `sonnet`) e nessuna memoria persistente tra sessioni.

### Instruction Quality — 85/100
Le istruzioni sono il punto più forte del progetto: ogni `description` contiene trigger "Usare per QUALUNQUE… / Non usare per…", ogni corpo ha sezione "Ambito, stretto", procedura numerata in "Come lavorare" e "Output atteso". La distinzione fra `accessibilita-tecnica-agent` (WCAG, markup) e `ui-accessibilita-agent` (chiarezza cognitiva) è esplicitata in entrambi i file come non-sovrapposizione deliberata; resta una lieve duplicazione sul vincolo compliance, applicato sia "in mente" dagli autori sia dal reviewer finale.

### Idea Quality — 80/100
Problema reale e ben delimitato: simulare le rate di un mutuo per utenti con bassa alfabetizzazione finanziaria, con il vincolo forte di non comportarsi mai da consulente. Il vincolo di neutralità è trattato come requisito di dominio di prima classe, non come disclaimer, e questo dà al progetto un'identità che un template non avrebbe.

### Robustness — 45/100
La suite di test non esiste: `test-agent.md` e la skill `validazione-numerica` descrivono casi fissi, test di proprietà e tolleranza cumulata `n × 0,005 €`, ma nel repo non c'è alcun file eseguibile di test, e `casi-test.md` dichiara onestamente che nessuno dei 5 casi è stato confrontato con un simulatore bancario reale — il requisito "dati reali" resta quindi scoperto. Nel codice ci sono 3 soli `try/catch` su 128 KB; l'unico fallback davvero progettato è quello del widget di traduzione (retry con backoff, tetto ai tentativi, `MutationObserver` per la banner-bar), e il gate obbligatorio del compliance reviewer prima del merge è escalation intenzionale corretta.

### Code Quality — 58/100
`calcRata` (app/mutuo_educativo.html:1058) è numericamente corretto e allineato a `reference.py` (100.000 € / 3% / 20 anni → 554,60 €), e la struttura a `renderXxx` per step è leggibile. Il difetto grave è che la convenzione di conversione del tasso è cablata come `tasso_annuo/100/12` senza alcuna configurabilità: è esattamente l'errore silenzioso contro cui mette in guardia la skill `formule-mutuo` e che l'istruzione 3 di `calcolo-mutuo-agent` vieta ("mai implicita nel codice"), quindi il vincolo scritto non è stato rispettato dall'artefatto.

### Tool Appropriateness — 76/100
Le scelte sono ponderate: skill per la conoscenza stabile (formule, API Chart.js, regole del glossario) con `reference.py` e `reference-esempio.html` come verità eseguibile invece che prosa, e `tools:` ritagliato per agente — `compliance-reviewer-agent` ha solo `Read, Grep, Glob, Skill, ReportFindings`, coerente col mandato di non scrivere. Dieci agenti per un progetto che consegna una singola pagina HTML restano però sovradimensionati, con `traduzione-agent` che presidia un'integrazione di poche decine di righe.

### Token Efficiency — 70/100
Nessun CLAUDE.md, quindi zero contesto sempre caricato, e le skill sono invocate on-demand come primo passo esplicito di ogni agente: retrieval selettivo corretto. Buono anche il chunking, con la conoscenza spezzata fra `SKILL.md` e file satellite (`reference.py`, `frasi-vietate.md`, `casi-test.md`); pesa invece la ridondanza dell'orchestratore, che riepiloga il perimetro di tutti e dieci gli agenti già descritto nei rispettivi file, e l'assenza di qualunque strategia di prompt caching.

### Documentation — 55/100
Il README spiega bene il problema, l'avvio locale e il doppio server per app e presentazione, incluso il dettaglio non ovvio che la presentazione serve l'intera cartella per far funzionare il link finale. Il limite è che documenta solo *come eseguire*: dieci agenti e sette skill non sono mai nominati, così un giudice che legga solo il README non scoprirebbe l'esistenza del layer agentico, che è la parte migliore del lavoro.

## Commento globale

Il progetto mostra una comprensione della progettazione agentica sopra la media del campo: i perimetri fra i dieci agenti sono definiti per negazione e reggono alla lettura incrociata, l'orchestratore delega invece di eseguire, e il compliance reviewer di sola lettura traduce il vincolo regolatorio della traccia in un gate architetturale, non in un disclaimer. Le sette skill sono usate correttamente come conoscenza codificata e versionata, con `reference.py` come fonte di verità numerica anziché formule riscritte a memoria. Lo scarto sta fra questo impianto e ciò che è stato effettivamente consegnato: la suite di validazione che l'impianto prescrive non esiste, nessun caso è stato verificato contro un simulatore bancario, e il motore cabla proprio la convenzione di tasso che la skill impone di rendere esplicita — il progetto ha scritto ottime regole e poi non le ha fatte rispettare a se stesso. Con i test implementati e la convenzione resa configurabile il punteggio salirebbe sensibilmente, perché la parte difficile — pensare l'architettura — è già fatta bene.
