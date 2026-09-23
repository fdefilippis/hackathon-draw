# Hackathon Evaluation — https://github.com/ChiaraParente2/hackaton
**Data:** 2026-09-22 · **Score:** 70/100

> Disciplina del contesto eccellente, ma il layer agentico si ferma a contratto + due skill

## Score breakdown

| Criterio | Score | Peso | Contributo |
|---|---|---|---|
| Agentic Depth | 48 | 24% | 11.5 |
| Instruction Quality | 88 | 19% | 16.7 |
| Idea Quality | 68 | 0% | 0 |
| Robustness | 62 | 15% | 9.3 |
| Code Quality | 76 | 12% | 9.1 |
| Tool Appropriateness | 70 | 11% | 7.7 |
| Token Efficiency | 88 | 12% | 10.6 |
| Documentation | 74 | 7% | 5.2 |
| **Overall** | | | **70** |

## Analisi per criterio

### Agentic Depth — 48/100
Due skill genuinamente eseguibili (`skills/verifica-economia/verifica.mjs` con 7 invarianti ed exit code, `skills/sprite-pipeline/sprites.py` con flood fill e crop), ma nessun sub-agente, nessun MCP, nessun hook e nessun workflow con stato: `agents/workflows/sprint-2h.md` descrive un processo umano, non un'orchestrazione. La parallelizzazione è tra due persone con due sessioni separate, non tra agenti con handoff, quindi manca del tutto il livello orchestratore/esecutori.

### Instruction Quality — 88/100
I prompt in `agents/prompts/` sono il pezzo migliore del repo: ognuno elenca il contesto da caricare in ordine, i vincoli non negoziabili e una DEFINITION OF DONE con comandi verificabili, e `review-scena.md` arriva a dare esempio positivo e negativo dell'output atteso. Ogni regola in `agents/README.md` è motivata dal bug concreto che l'ha generata, e le sovrapposizioni sono state attivamente rimosse (la forma di `gameState` duplicata tra `AGENTS.md` e `GAME_INFO.md` è documentata come eliminata).

### Idea Quality — 68/100
Simulatore educativo del primo stipendio per 13-18 anni: problema reale e centrato sul tema inclusione finanziaria, con conseguenze numeriche immediate invece che nozionismo. Resta però un serious game abbastanza convenzionale e senza alcuna componente AI a runtime — l'agentico vive solo nel processo di sviluppo.

### Robustness — 62/100
L'escalation umana è intenzionale e ben posizionata: `review-scena.md` impone "non correggere nulla finché non te lo dico", `nuova-scena.md` chiede un piano di 3 righe prima del codice e `modifica-economia.md` vieta di dichiarare finito senza aver incollato l'output di `verifica.mjs`. Manca però qualsiasi fallback se una skill fallisce o produce output malformato, non ci sono limiti di iterazione né rami di errore, e il gate di verifica resta affidato alla disciplina perché non è cablato in un hook.

### Code Quality — 76/100
`app/src/utils/finance.js` è una fonte di verità pulita: valori derivati fuori dallo stato, `Intl.NumberFormat` per gli importi, guardia su divisione per zero in `pct()` e commenti che spiegano il perché e non il cosa. `verifica.mjs` è senza dipendenze e copre 309 combinazioni in modo esaustivo; resta qualche incoerenza minore, come l'uso di `|| 0` in `speseMensiliStimate()` proprio nel repo che documenta la trappola `||` contro `??`.

### Tool Appropriateness — 70/100
Le skill sono usate esattamente dove serve — task ripetibili e deterministici come la pipeline sprite e la verifica economica — senza ridondanza tra le due e senza agenti sovradimensionati per uno sprint di 2 ore. Il difetto è la mancata chiusura del cerchio: i 4 prompt riusabili sarebbero slash command naturali invece che `.md` da copiaincollare, e `verifica.mjs` è dichiarato "utilizzabile in CI o in un hook pre-commit" in `skills/verifica-economia/SKILL.md` ma poi non è mai stato cablato come hook.

### Token Efficiency — 88/100
`agents/TOKENOMICS.md` riporta numeri misurati e non stimati: rimozione di 1.036 tile ridondanti (da ~15-20k a ~200 token per listing), una singola riga di `AGENTS.md` che imponeva 7k token a ogni task sostituita con la lettura selettiva per scena (-90% sul costo fisso), più la regola "grep prima di read" e un ordine di lettura annotato con i costi in `agents/README.md`. Mancano una strategia esplicita di prompt caching e un ulteriore sfoltimento di `AGENTS.md`, che a 367 righe resta un pedaggio fisso di ~4k token per ogni task.

### Documentation — 74/100
Il livello `agents/` è documentato molto bene: indice con ordine di lettura, contratto, design document diviso per scena, e ogni SKILL.md con problema, uso, funzionamento e limiti espliciti. Il `README.md` di root però è solo "hackaton project": chi apre il repo non trova setup, demo né spiegazione del flusso agentico, e deve indovinare di scendere in `agents/`.

## Commento globale

Il progetto è un caso quasi didattico di context engineering: `TOKENOMICS.md` misura gli sprechi invece di stimarli, i prompt dichiarano cosa caricare e quando fermarsi, e ogni regola è tracciata al bug che l'ha resa necessaria. Le due skill sono reali e non decorative — `verifica-economia` in particolare trasforma una classe intera di bug economici in un controllo deterministico con exit code. Il limite è che tutto questo resta un layer di istruzioni e utility: non esistono sub-agenti, MCP, hook né orchestrazione con stato, quindi la profondità agentica è bassa rispetto alla qualità di ciò che è stato scritto. Il gap più facile da colmare era proprio il più dichiarato: `verifica.mjs` è descritto come hook-ready ma non è mai stato agganciato, e i quattro prompt sarebbero diventati slash command con pochi minuti di lavoro. Prodotto solido e onesto, con un impianto agentico maturo nel pensiero ma incompleto nell'esecuzione.
