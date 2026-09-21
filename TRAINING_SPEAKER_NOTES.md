# Claude Code, oltre le basi — Note per l'oratore

Script parlato per le 14 slide. Tempo indicativo: ~10 minuti (≈40 secondi a slide).
Tono: colloquiale, come se parlassi a colleghi che Claude Code lo hanno già toccato.

---

## 1 · Cover — "Claude Code, oltre le basi"

"Buongiorno a tutti. Oggi non partiamo da zero: do per scontato che Claude Code
l'abbiate già aperto almeno una volta. L'obiettivo di questi dieci minuti è
alzare l'asticella — passare da 'gli scrivo cosa fare' a 'gli costruisco intorno
un ambiente in cui lavora bene'. Parleremo di come ragiona, di come dargli
memoria, di come estenderlo e automatizzarlo. Cinque temi: memoria, subagenti,
hooks, MCP e automazione."

## 2 · Il loop dell'agente

"Prima cosa, il modello mentale. Claude non è un autocomplete: lavora in un
loop. Raccoglie contesto, usa dei tool — legge file, cerca, modifica, esegue
comandi — poi verifica il risultato e ripete. Il punto chiave è questo: il collo
di bottiglia non è quanto è 'bravo', è il contesto. Quello che entra nella sua
finestra determina la qualità di quello che esce. Ogni azione ha un costo, e
l'agente sceglie quando cercare, quando leggere, quando delegare. Quindi il
vostro lavoro, a questo livello, non è scrivere il prompt perfetto: è progettare
il contesto e i guardrail. Tenete a mente questa idea, perché tutto il resto
discende da qui."

## 3 · CLAUDE.md: memoria a livelli

"Il primo strumento per governare il contesto è il CLAUDE.md. E qui l'errore
comune è pensare che sia un solo file. In realtà è una gerarchia. C'è quello di
progetto, nella root del repo, versionato: comandi, convenzioni, vincoli
condivisi dal team. C'è quello utente, in `~/.claude`, con le vostre preferenze
personali valide ovunque. Potete metterne uno anche in una sottocartella: viene
caricato solo quando lavorate lì. E soprattutto potete comporli con l'import
`@percorso/al/file`, così non duplicate lo stesso contesto in dieci posti. La
regola d'oro: breve e aggiornato. È contesto operativo, non documentazione."

## 4 · Le quattro primitive di estensione

"Quando volete plasmare Claude Code sul vostro modo di lavorare, avete quattro
mattoni. Gli slash command: file markdown in `.claude/commands`, per i flussi
che ripetete sempre, anche con argomenti. I subagenti: file in `.claude/agents`,
che girano in un contesto isolato con tool e modello dedicati. Le skill: dei
`SKILL.md` che aggiungono competenze specializzate, caricate solo quando
servono. E gli MCP: server esterni che portano dentro tool e dati — database,
browser, issue tracker. Nelle prossime slide entriamo nei due che fanno la
differenza più grande: subagenti e hooks."

## 5 · Subagenti: delega con contesto isolato

"I subagenti sono il modo pulito di affrontare codebase grandi. Quando li usate?
Per esplorazioni ampie, ricerche in parallelo, task che altrimenti vi
riempirebbero il contesto di rumore. Come li istruite? Gli date un obiettivo e
il formato di output che vi aspettate; loro lavorano in una finestra separata
dalla vostra. E qui sta il bello: nel vostro contesto torna solo la conclusione,
non tutti i dump intermedi. Potete lanciarne diversi in parallelo, indipendenti,
e coprire molto più terreno senza confondere la conversazione principale. Pensate
al subagente come a un collega a cui delegate un pezzo di indagine: vi riporta la
sintesi, non vi legge tutti i file uno per uno."

## 6 · Hooks: regole deterministiche

"Gli hooks sono la mia parte preferita, perché sono deterministici: non
dipendono dal modello, valgono sempre. Sono comandi shell che scattano su
eventi — prima di usare un tool, dopo, alla fine di una risposta, all'avvio
della sessione. L'uso classico: dopo ogni modifica lanci in automatico il
formatter, il linter, i test. Non devi ricordarglielo. Oppure, prima di
un'azione, puoi bloccarla: niente edit su file protetti, niente comandi vietati.
In pratica trasformate la disciplina in configurazione. Quello che prima
speravate che l'AI 'si ricordasse', adesso è una regola che non si può saltare."

## 7 · Permessi e settings.json

"Legato agli hooks c'è il tema dei permessi. In `settings.json` avete liste
allow e deny per tool e pattern di comando: così smettete di confermare
cinquanta volte le stesse azioni fidate. Ci sono le modalità — default,
acceptEdits, plan — e c'è il bypass, che però va usato solo in sandbox. Dal vivo
avete `/permissions` per ispezionare e correggere le regole al volo. Il
principio di fondo: date autonomia dove è sicuro — un branch dedicato, un
container, la CI — e tenete il controllo stretto dove serve. In produzione, mai
mano libera."

## 8 · MCP: collega il mondo esterno

"Gli MCP portano Claude fuori dal codice. Con un server database interroga lo
schema e i dati reali, invece di indovinare com'è fatta la tabella. Con browser
o Figma legge il design o testa la UI end-to-end. Con l'issue tracker o il Git
host apre PR, legge i ticket, commenta — il ciclo di sviluppo entra dentro il
loop. La regola pratica: un server per capability, autenticazione sicura, e
scope ridotto all'essenziale. Non serve dare accesso a tutto: serve dare accesso
alla cosa giusta."

## 9 · Explore → Plan → Implement → Verify

"Adesso il metodo di lavoro, quello che regge anche sui task complessi. Quattro
fasi. Explore: fate mappare il codice esistente prima di decidere qualsiasi
cosa, magari con dei subagenti. Plan: attivate il plan mode con Shift+Tab, così
Claude propone un approccio senza toccare i file e voi lo correggete a costo
zero. Implement: passi piccoli e verificabili, e dove ha senso il TDD, con i
test scritti prima. Verify: build, test, review del diff — e se state lavorando
su UI, uno screenshot di conferma. La differenza tra un buon risultato e una
rilavorazione è quasi sempre nelle prime due fasi."

## 10 · Governa la finestra di contesto

"Torniamo sul contesto, perché è una risorsa finita e gestirla è una skill vera.
Tra due task che non c'entrano nulla, `/clear`: ripartite puliti, le risposte
diventano più precise. Su sessioni molto lunghe, `/compact`: riassume mantenendo
il filo. Tutto quello che genera rumore — log lunghissimi, ricerche,
esplorazioni — delegatelo ai subagenti, così non intasa la conversazione
principale. E date contesto in modo chirurgico: CLAUDE.md e `@file` mirati, solo
quello che serve, quando serve. Un contesto affollato non è un contesto ricco: è
un contesto confuso."

## 11 · Headless e automazione in CI

"Ultimo pezzo tecnico: Claude Code non vive solo nel terminale interattivo. Con
`claude -p` gli passate un task, lui lo esegue e stampa il risultato, senza
sessione. Con `--output-format json` quell'output lo infilate dentro script e
pipeline. Potete dargli in pipe un log, un diff, uno stack trace, e usarlo per
triage, review o fix automatici. E in CI diventa potente: code review su ogni
PR, generazione di changelog, controlli di qualità ripetibili. In pratica lo
stesso agente che usate a mano lo mettete a lavorare in automatico."

## 12 · Pattern e anti-pattern avanzati

"Facciamo il riassunto per contrasto. Da evitare: il megaprompt unico per un
task enorme; il CLAUDE.md gigante, che diventa rumore; il bypass dei permessi
fuori dalla sandbox; subagenti e comandi ridondanti che si pestano i piedi; e
accettare i diff senza leggerli. Da fare, specularmente: task spezzati, ognuno
con un criterio di 'fatto'; memoria breve, richiamata con `@file`; hooks per
lint e test invece di ricordarveli; subagenti per isolare il contesto ed
esplorare in parallelo; e sempre review del diff con i test verdi prima del
commit. Se vi ricordate solo questa slide, avete già l'80% del valore."

## 13 · Checklist del setup avanzato

"Questa tenetela come promemoria operativo per quando tornate al vostro repo.
CLAUDE.md di progetto e utente, con gli import. Slash command per i flussi
ricorrenti. Subagenti con tool e contesto dedicati. Hooks per format, lint e
test automatici. Permessi in `settings.json` più sandbox per il resto. MCP per
database, browser e issue tracker. Plan mode sui task ampi o rischiosi. E
`/clear` e `/compact` per tenere pulito il contesto. Non serve fare tutto oggi:
partite da CLAUDE.md e da un hook per i test, il resto viene da sé."

## 14 · Closing

"Chiudo con il concetto che vorrei vi portaste a casa: Claude Code non è solo uno
strumento da usare, è una piattaforma da progettare. Contesto, estensioni,
automazione — l'AI vi dà velocità, ma l'ingegnere restate voi: la responsabilità
del codice non si delega. Qui sotto avete i comandi da cui ripartire — `/agents`,
`/hooks`, la cartella `.claude/commands`, `claude -p` — e la documentazione
ufficiale. Buon Hagenthon, e buon divertimento."

---

### Suggerimenti di consegna

- **Ritmo**: ~40 secondi a slide. Se siete lunghi, tagliate le slide 7 e 10.
- **Interazione**: alla slide 6 (hooks) chiedete "chi di voi ha già un hook di test?" per svegliare la sala.
- **Enfasi**: il messaggio portante è la slide 2 ("il contesto è il collo di
  bottiglia") e la slide 12 (do/don't). Ripetetelo alla chiusura.
