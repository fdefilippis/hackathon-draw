# Hackathon Evaluation — https://github.com/bigpea/voiceform
**Data:** 2026-09-22 · **Score:** 55/100

> Workflow di sviluppo ben tagliato, ma prodotto senza agenticità a runtime e failure silenziosi sul path PDF

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 42 | 24% | 10.1 |
| Instruction Quality | 62 | 19% | 11.8 |
| Idea Quality | 72 | 0% | 0 |
| Robustness | 33 | 15% | 5.0 |
| Code Quality | 64 | 12% | 7.7 |
| Tool Appropriateness | 66 | 11% | 7.3 |
| Token Efficiency | 66 | 12% | 7.9 |
| Documentation | 78 | 7% | 5.5 |
| **Overall** | | | **55** |

## Analisi per criterio

### Agentic Depth — 42/100
`app/.claude/commands/orchestratore.md` coordina un fan-out parallelo esplicito verso tre sub-agenti con scope disgiunti (`dev.md`, `readme_agent.md`, `presentazione_agent.md`) e chiude con un gate di verifica su `npm run build`, ma manca qualsiasi stato esternalizzato, contratto di output fra agenti o memoria tra sessioni. Il layer agentico è puro scaffolding di sviluppo: il prodotto consegnato non contiene agenticità a runtime, e la "capability agentica" dichiarata in `requirements/requirements.md` è in realtà regex deterministica in `api/understand/route.ts`.

### Instruction Quality — 62/100
`dev.md` è il pezzo migliore, con vincoli verificabili e non negoziabili (TypeScript strict, zero API key, WCAG 2.1 AA con soglia esplicita font-size ≥ 18px) e convenzioni di path dichiarate, mentre `readme_agent.md` specifica un output in 10 sezioni numerate. `presentazione_agent.md` si contraddice invece internamente: elenca prima 5 slide, poi ne rinumera altre saltando da 3 a 6 a 7 a 11, lasciando ambiguo il deliverable atteso; in nessun file compaiono few-shot example.

### Idea Quality — 72/100
Il problema è reale e ben circoscritto — persone con tremore essenziale o emiplegia che non completano moduli PA in autonomia — con persona utente concreta e outcome misurabile (0% → 100% di completamento autonomo) documentati nel README. Il valore aggiunto dell'AI resta però sottile: la comprensione del parlato è pattern matching scritto a mano, quindi l'idea regge sull'accessibilità più che sull'intelligenza del sistema.

### Robustness — 33/100
`VoiceRecorder.tsx` gestisce correttamente il boundary voce, con branch distinti e messaggi utente in italiano per `no-speech`, `not-allowed`, browser non supportato ed errore generico. Sul path PDF invece `fill-pdf/route.ts` inghiotte in silenzio il fallimento di ogni singolo campo (`catch {}` con commento "skip silently"), restituendo un PDF incompleto senza segnalare cosa manca, e non esiste alcun fallback quando l'estrazione non produce campi né gating sui `confidence` calcolati.

### Code Quality — 64/100
`api/understand/route.ts` è curato: normalizzazione `è→e`, tre strategie di estrazione del codice fiscale con confidence decrescente, deduplica che tiene il match più affidabile, whitelist `availableFields` che impedisce di inventare campi e una guardia esplicita per non confondere la data di dichiarazione con quella di nascita. Pesano però l'assenza totale di test su logica interamente regex-based, i `catch {}` silenziosi e l'hardcoding `19${yy}` che sbaglia ogni anno a due cifre post-2000.

### Tool Appropriateness — 66/100
Le allowlist per agente applicano least privilege in modo corretto: `readme_agent` ha solo Read/Glob/Write e non può eseguire comandi, `presentazione_agent` solo Read/Write, mentre `dev` riceve Bash ed Edit perché gli servono davvero. Generazione di README e slide sono però task ripetibili da skill, implementati invece come agenti, e non è impiegato alcun MCP.

### Token Efficiency — 66/100
I quattro file agentici sono asciutti e non esiste alcun CLAUDE.md, quindi nessun contesto viene caricato sempre; l'orchestratore chiede inoltre la lettura parallela di tre file nominati invece di un'esplorazione aperta. Il vincolo di stack (zero API key, Next.js/Tailwind/pdf-lib) è però ripetuto in `dev.md`, `orchestratore.md` e `requirements.md`, e `presentazione_agent.md` incorpora nelle istruzioni la prosa integrale delle slide invece di referenziarla.

### Documentation — 78/100
Il README è fra i più completi del lotto: problema, persona, tabella "adaptive evidence" che mappa frase pronunciata su campi compilati, learning outcome con metodo di verifica, stack, avvio e struttura cartelle; `requirements/requirements.md` aggiunge una specifica funzionale e non funzionale ordinata. Manca però una pagina che spieghi a un nuovo arrivato come si usa `/orchestratore` e quale sia il flusso agentico complessivo.

## Commento globale

VoiceForm risolve un problema di accessibilità concreto con un prodotto che funziona end-to-end e lo racconta con una documentazione sopra la media. Il layer agentico esiste ed è correttamente disegnato — orchestratore, tre agenti a scope disgiunto, tool allowlist per ruolo, gate di build finale — ma vive interamente in fase di sviluppo e si esaurisce alla prima generazione, senza stato, handoff strutturati o memoria. Il divario più serio è fra ciò che il progetto dichiara e ciò che implementa: `requirements.md` promette rilevamento di campo, parsing multi-campo e gestione dell'ambiguità come capacità agentiche, mentre il codice le realizza con regex il cui confidence score viene calcolato e poi mai usato per decidere. Sul piano della robustezza il silenzio di `fill-pdf/route.ts` è il difetto da correggere per primo, perché produce un output plausibile ma incompleto proprio per l'utente meno in grado di accorgersene. Con confidence gating, propagazione degli errori di compilazione e qualche test sulle regex, il progetto salirebbe in modo netto.
