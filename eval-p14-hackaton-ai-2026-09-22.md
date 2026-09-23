# Hackathon Evaluation — https://github.com/CazzanigaGianluca/hackaton-ai
**Data:** 2026-09-22 · **Score:** 76/100

> Disciplina di contesto eccellente e fallback deterministici ovunque, zavorrata da skill vendorizzate estranee e nessun retry LLM

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 78 | 24% | 18.7 |
| Instruction Quality | 88 | 19% | 16.7 |
| Idea Quality | 82 | 0% | 0 |
| Robustness | 68 | 15% | 10.2 |
| Code Quality | 82 | 12% | 9.8 |
| Tool Appropriateness | 64 | 11% | 7.0 |
| Token Efficiency | 62 | 12% | 7.4 |
| Documentation | 88 | 7% | 6.2 |
| **Overall** | | | **76** |

## Analisi per criterio

### Agentic Depth — 78/100
Orchestrator esplicito (`app/backend/agents/orchestrator.py`) guida 5 agenti con injection di `llm_client` ed eventi SSE per stage, affiancato da 3 skill di progetto e hook PostToolUse/Stop in `.claude/settings.json`. L'astrazione `ClaudeCliClient` in `app/backend/llm.py` — adapter su `claude -p` con interfaccia identica all'SDK — è una scelta architetturale non banale, ma la pipeline resta strettamente lineare: nessuna delega tra agenti, nessun loop di iterazione, e tre agenti su cinque sono deterministici con LLM solo in fallback.

### Instruction Quality — 88/100
`CLAUDE.md` è di qualità rara: comandi esatti, pattern agente obbligatorio con template di codice, convenzioni di test specifiche (stub LLM inline, non `unittest.mock`) e un vincolo di sicurezza con divieto esplicito di indebolire la guardia deterministica. `CONTEXT.md` aggiunge un glossario di dominio con anti-termini (`_Evita_`) e una sezione "Ambiguità risolte"; unico eccesso è l'obbligo di invocare generate+test+review in quest'ordine per *qualsiasi* modifica, sproporzionato sugli edit banali.

### Idea Quality — 82/100
Inclusione finanziaria per famiglie italiane con benchmark ISTAT e un vincolo esplicito "assistente educativo, mai consulente" che permea system prompt, guardia deterministica e glossario. Problema reale con consapevolezza regolamentare concreta, non un template riadattato.

### Robustness — 68/100
Ogni agente ha un fallback deterministico quando `llm_client is None` (pattern imposto in `CLAUDE.md` e testato separatamente), la risoluzione del client è a tre livelli in `llm.py`, e `is_investment_advice_request` scatta prima di ogni chiamata LLM ammettendo onestamente nel docstring di non essere esaustiva. Manca però qualsiasi retry sulle chiamate LLM: un errore transitorio dell'API risale al `except Exception` di `routes/upload.py` e fa fallire l'intera Sessione invece di degradare sul fallback deterministico già scritto, e il subprocess `claude` non ha timeout.

### Code Quality — 82/100
Typing pulito, modelli Pydantic, `model_copy(update=...)` invece di mutazione, ruff imposto via hook, test co-locati per ogni agente, e commenti che spiegano il *perché* (le regex in `educational_coach.py` documentano perché solo il plurale "azioni" e perché `investir[eaoiò]` non matcha "investigazione"). Difetti: `str(exc)` inoltrato al client in `routes/upload.py` può esporre interni, il subprocess CLI è senza timeout, e `_load_keyword_map()` eseguito a livello di modulo fa crashare l'import se `data/categories.json` manca.

### Tool Appropriateness — 64/100
Le 3 skill di progetto sono ben separate per scopo, gli hook coprono correttamente lint/format deterministici, e lo split Haiku/Sonnet è deliberato e motivato in `docs/adr/0005-haiku-sonnet-split-per-agenti.md`. Pesa però il vendoring di ~10 alberi di skill claudekit (brand, design, slides, banner-design, ui-styling: oltre 160 file su logo design e template PowerPoint) irrilevanti per un analizzatore di estratti conto, e l'ADR 0005 dichiara DataAnalyzer su Sonnet mentre l'orchestrator lo istanzia senza `llm_client`.

### Token Efficiency — 62/100
`CLAUDE.md` è denso senza essere gonfio, `CONTEXT.md` è referenziato e non inlinato, le skill usano `references/` con progressive disclosure, e il design deterministico-first evita del tutto la chiamata LLM sulla maggior parte delle Transazioni. In negativo, le descrizioni di ~10 skill vendorizzate restano sempre in contesto, e la regola "sempre generate+test+review in quest'ordine" impone un costo strutturale fisso anche sulle modifiche minime.

### Documentation — 88/100
README con setup per entrambi gli stack, 5 ADR, glossario di dominio, e soprattutto una sezione "Verifiche end-to-end effettuate" che dichiara esplicitamente **Non verificato** l'interazione reale in browser — onestà intellettuale rara in un hackathon. Sporcano il quadro due disallineamenti: l'ADR 0005 contraddice il codice su DataAnalyzer, e la struttura in README indica `agents/` a top level invece di `app/backend/agents/`.

## Commento globale

Progetto solido e maturo, con la disciplina di contesto come tratto distintivo: `CLAUDE.md` e `CONTEXT.md` formano una coppia istruzioni-glossario di qualità superiore alla media, e il pattern "ogni agente deve funzionare con `llm_client=None`" è imposto, documentato e testato separatamente. L'astrazione a tre livelli in `llm.py` — SDK, adapter su `claude -p`, nessun client — mostra comprensione reale del problema di far girare una demo senza API key. I due limiti veri sono l'assenza di retry sulle chiamate LLM, che rende inutile in caso di errore API il fallback deterministico già scritto, e il vendoring di oltre 160 file di skill claudekit su branding e presentazioni, estranee al dominio e costose in contesto. La pipeline resta lineare e priva di delega tra agenti, quindi la profondità agentica a runtime è inferiore a quanto il conteggio "5 agenti" suggerisca. Nota metodologica: una valutazione precedente su questo repo si era fermata a 60 avendo letto quasi solo le skill vendorizzate — l'analisi del layer Python effettivo porta il punteggio a 76.
