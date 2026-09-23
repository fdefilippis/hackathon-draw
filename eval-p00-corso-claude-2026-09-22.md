# Hackathon Evaluation — https://github.com/orasiu88/Corso-Claude
**Data:** 2026-09-22 · **Score:** 55/100

> Istruzioni agente scritte con cura, ma contraddette dal codice consegnato

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 52 | 24% | 12.5 |
| Instruction Quality | 58 | 19% | 11.0 |
| Idea Quality | 82 | 0% | 0 |
| Robustness | 45 | 15% | 6.8 |
| Code Quality | 60 | 12% | 7.2 |
| Tool Appropriateness | 63 | 11% | 6.9 |
| Token Efficiency | 58 | 12% | 7.0 |
| Documentation | 58 | 7% | 4.1 |
| **Overall** | | | **55** |

## Analisi per criterio

### Agentic Depth — 52/100
Quattro subagent dev-time con perimetri disgiunti (`agenti usati/design-agent.md`, `code-agent.md`, `accessibility-validator.md`, `test-agent.md`), ma senza orchestratore, handoff dichiarato o workflow multi-step con stato. A runtime il layer agentico si riduce a due prompt indipendenti one-shot in `App/src/services/agents/prompts.ts`, senza memoria persistente né log intermedi.

### Instruction Quality — 58/100
I singoli file agente sono scritti con cura notevole: scope esplicito, `description` per il routing, pattern vietati, checklist WCAG 2.1 AA completa e casi di test nominati (TC-01…TC-08). Penalità strutturale però, perché `App/CLAUDE.md` e `code-agent.md` impongono «single file `index.html`, no build step, no npm, solo `claude-sonnet-4-6`» mentre il repo consegnato è un'app React+Vite di circa 90 file che chiama Gemini.

### Idea Quality — 82/100
Problema reale e non artificioso: tradurre clausole contrattuali opache in linguaggio comprensibile a utenti con bassa alfabetizzazione finanziaria, con profilo utente target esplicitato in `accessibility-validator.md`. L'AI aggiunge valore genuino nell'estrazione strutturata di mora, penali di recesso e rinnovi automatici, non è un CRUD travestito.

### Robustness — 45/100
Presente il ramo di errore sul parsing (`parseAgentJson` con catch e messaggio utente in italiano) e il controllo di `parsed.error` in `useDocumentAnalysis.ts`. Mancano però try/catch su `readPdfAsBase64` e `callAnthropicAgent`: un errore HTTP o di lettura file lascia lo stato bloccato su `loading` senza feedback, e non esistono retry, timeout/abort né fallback.

### Code Quality — 60/100
Buona stratificazione (services/hooks/store/components, atomic design, alias di path, prompt come costanti tipizzate) e `parseAgentJson.ts` gestisce correttamente le code fence dell'LLM. Grave disallineamento di naming: `anthropic.service.ts` esporta `callAnthropicAgent` con tipi `AnthropicContent` ma chiama `gemini-flash-lite-latest` su endpoint Google, e la chiave vive in un env var `VITE_` quindi finisce nel bundle client.

### Tool Appropriateness — 63/100
I quattro subagent sono la primitiva giusta per specialisti di revisione, con `description` mirate, `model` pinnato e nessuna sovrapposizione di perimetro. Scelta debole su `test-agent.md`, che esegue i test «ragionando staticamente» pur trovandosi in un repo con npm e vite dove un runner reale è disponibile; assenti hook per automatizzare lint e test.

### Token Efficiency — 58/100
Pattern corretto sui subagent caricati on-demand e `CLAUDE.md` breve che *referenzia* `design-system.html` invece di inlinearlo. Pesa però la duplicazione: `design-agent.md` reinlinea l'intera tabella di token già presente in `App/src/styles/tokens.css`, e i vincoli su modello, header e single-file sono ripetuti tra `CLAUDE.md` e `code-agent.md`.

### Documentation — 58/100
Copertura ampia: README esteso con problema e architettura, `PLAN.md`, `design-system.html` interattivo e deck di pitch. Il difetto è che documenta un'app che non è quella consegnata, con file map, architettura single-file e provider AI dichiarati che non corrispondono al codice presente.

## Commento globale

FinanceScope mostra un livello di scrittura delle istruzioni sopra la media: i quattro file agente sono precisi, con scope disgiunti, pattern vietati e casi di test nominati, e i prompt runtime impongono uno schema JSON rigoroso con gestione esplicita del caso vuoto. Il progetto però paga un disallineamento sistematico tra ciò che le istruzioni descrivono e ciò che il repo contiene: `CLAUDE.md` e `code-agent.md` governano un'app single-file senza build che non esiste più, e il servizio chiamato `anthropic.service.ts` parla in realtà con Gemini. Sul piano agentico la profondità resta limitata a specialisti paralleli senza orchestratore, handoff o stato condiviso, con un runtime fatto di due chiamate one-shot indipendenti. La robustezza è il punto più fragile in esercizio, perché gli errori più probabili — risposta HTTP non-ok e fallimento di lettura del PDF — non sono intercettati e lasciano la UI in caricamento permanente. Allineare le istruzioni al codice reale e chiudere i due rami di errore mancanti alzerebbe il punteggio in modo significativo a parità di funzionalità.
