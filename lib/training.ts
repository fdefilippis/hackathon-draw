export type Slide = {
  id: string;
  kicker: string;
  title: string;
  subtitle?: string;
  layout: "cover" | "bullets" | "cards" | "steps" | "doDont" | "checklist" | "closing";
  bullets?: string[];
  cards?: { title: string; desc: string }[];
  steps?: { title: string; desc: string }[];
  callout?: string;
  example?: { bad: string; good: string };
  doItems?: string[];
  dontItems?: string[];
  chips?: string[];
  /** Testo parlato per il relatore (mostrato con il toggle "Note relatore"). */
  notes?: string;
};

export const SLIDES: Slide[] = [
  {
    id: "cover",
    kicker: "Hagenthon · Training",
    title: "Claude Code, oltre le basi",
    subtitle:
      "Agentic coding di livello avanzato: contesto, estensioni e automazione. 14 slide, 10 minuti, dritti al sodo.",
    layout: "cover",
    chips: ["Memoria", "Subagenti", "Hooks", "MCP", "Automazione"],
    notes:
      "Buongiorno a tutti. Oggi non partiamo da zero: do per scontato che Claude Code l'abbiate già aperto almeno una volta. L'obiettivo di questi dieci minuti è alzare l'asticella — passare da 'gli scrivo cosa fare' a 'gli costruisco intorno un ambiente in cui lavora bene'. Parleremo di come ragiona, di come dargli memoria, di come estenderlo e automatizzarlo. Cinque temi: memoria, subagenti, hooks, MCP e automazione.",
  },
  {
    id: "loop",
    kicker: "Modello mentale",
    title: "Claude lavora in un loop",
    subtitle:
      "Capire il ciclo agente è ciò che separa l’uso base da quello avanzato.",
    layout: "bullets",
    bullets: [
      "Raccoglie contesto → usa i tool (leggi, cerca, modifica, esegui) → verifica → itera.",
      "Il collo di bottiglia è il contesto: ciò che entra nella finestra decide la qualità.",
      "Ogni azione ha un costo — l’agente sceglie quando cercare, leggere o delegare.",
      "Il tuo lavoro avanzato è progettare contesto e guardrail, non dettare i prompt.",
    ],
    notes:
      "Prima cosa, il modello mentale. Claude non è un autocomplete: lavora in un loop. Raccoglie contesto, usa dei tool — legge file, cerca, modifica, esegue comandi — poi verifica il risultato e ripete. Il punto chiave è questo: il collo di bottiglia non è quanto è 'bravo', è il contesto. Quello che entra nella sua finestra determina la qualità di quello che esce. Ogni azione ha un costo, e l'agente sceglie quando cercare, quando leggere, quando delegare. Quindi il vostro lavoro, a questo livello, non è scrivere il prompt perfetto: è progettare il contesto e i guardrail. Tenete a mente questa idea, perché tutto il resto discende da qui.",
  },
  {
    id: "memoria",
    kicker: "Contesto persistente",
    title: "CLAUDE.md: memoria a livelli",
    subtitle: "Non un solo file: una gerarchia che componi con precisione.",
    layout: "cards",
    cards: [
      {
        title: "Progetto",
        desc: "CLAUDE.md nella root del repo: comandi, convenzioni e vincoli condivisi dal team.",
      },
      {
        title: "Utente",
        desc: "~/.claude/CLAUDE.md per le tue preferenze, valide in ogni progetto.",
      },
      {
        title: "Sottocartelle",
        desc: "Un CLAUDE.md locale caricato solo quando lavori in quella parte del codebase.",
      },
      {
        title: "Import con @",
        desc: "@percorso/al/file per riusare contesto senza duplicarlo tra i file.",
      },
    ],
    notes:
      "Il primo strumento per governare il contesto è il CLAUDE.md. E qui l'errore comune è pensare che sia un solo file. In realtà è una gerarchia. C'è quello di progetto, nella root del repo, versionato: comandi, convenzioni, vincoli condivisi dal team. C'è quello utente, in ~/.claude, con le vostre preferenze personali valide ovunque. Potete metterne uno anche in una sottocartella: viene caricato solo quando lavorate lì. E soprattutto potete comporli con l'import @percorso/al/file, così non duplicate lo stesso contesto in dieci posti. La regola d'oro: breve e aggiornato. È contesto operativo, non documentazione.",
  },
  {
    id: "primitive",
    kicker: "Estendere Claude",
    title: "Le quattro primitive di estensione",
    subtitle: "I mattoni con cui trasformi Claude Code in uno strumento su misura.",
    layout: "cards",
    cards: [
      {
        title: "Slash command",
        desc: ".claude/commands/*.md: flussi ripetibili e parametrici con $ARGUMENTS.",
      },
      {
        title: "Subagenti",
        desc: ".claude/agents/*.md: contesto isolato, con tool e modello dedicati.",
      },
      {
        title: "Skill",
        desc: "SKILL.md: competenze specializzate caricate on-demand quando servono.",
      },
      {
        title: "MCP",
        desc: "Server esterni che aggiungono tool e risorse: DB, browser, issue tracker.",
      },
    ],
    notes:
      "Quando volete plasmare Claude Code sul vostro modo di lavorare, avete quattro mattoni. Gli slash command: file markdown in .claude/commands, per i flussi che ripetete sempre, anche con argomenti. I subagenti: file in .claude/agents, che girano in un contesto isolato con tool e modello dedicati. Le skill: dei SKILL.md che aggiungono competenze specializzate, caricate solo quando servono. E gli MCP: server esterni che portano dentro tool e dati — database, browser, issue tracker. Nelle prossime slide entriamo nei due che fanno la differenza più grande: subagenti e hooks.",
  },
  {
    id: "subagenti",
    kicker: "Scalare",
    title: "Subagenti: delega con contesto isolato",
    subtitle: "Il modo pulito di affrontare codebase grandi e task rumorosi.",
    layout: "steps",
    steps: [
      {
        title: "Quando usarli",
        desc: "Esplorazioni ampie, ricerche parallele, task che altrimenti riempirebbero il contesto.",
      },
      {
        title: "Come istruirli",
        desc: "Dai obiettivo e formato di output atteso: lavorano in una finestra separata dalla tua.",
      },
      {
        title: "Cosa torna",
        desc: "Solo la conclusione rientra nel contesto principale, non i dump intermedi.",
      },
      {
        title: "In parallelo",
        desc: "Più subagenti indipendenti in contemporanea: coprono più terreno senza confondersi.",
      },
    ],
    notes:
      "I subagenti sono il modo pulito di affrontare codebase grandi. Quando li usate? Per esplorazioni ampie, ricerche in parallelo, task che altrimenti vi riempirebbero il contesto di rumore. Come li istruite? Gli date un obiettivo e il formato di output che vi aspettate; loro lavorano in una finestra separata dalla vostra. E qui sta il bello: nel vostro contesto torna solo la conclusione, non tutti i dump intermedi. Potete lanciarne diversi in parallelo, indipendenti, e coprire molto più terreno senza confondere la conversazione principale. Pensate al subagente come a un collega a cui delegate un pezzo di indagine: vi riporta la sintesi, non vi legge tutti i file uno per uno.",
  },
  {
    id: "hooks",
    kicker: "Automazione",
    title: "Hooks: regole deterministiche",
    subtitle: "Comportamenti che non dipendono dal modello — valgono sempre.",
    layout: "bullets",
    bullets: [
      "Comandi shell eseguiti su eventi: PreToolUse, PostToolUse, Stop, SessionStart.",
      "PostToolUse: lancia formatter, linter o test dopo ogni modifica, in automatico.",
      "PreToolUse: può bloccare azioni — edit su file protetti o comandi vietati.",
      "Guardrail affidabili: la disciplina diventa configurazione, non memoria umana.",
    ],
    notes:
      "Gli hooks sono la mia parte preferita, perché sono deterministici: non dipendono dal modello, valgono sempre. Sono comandi shell che scattano su eventi — prima di usare un tool, dopo, alla fine di una risposta, all'avvio della sessione. L'uso classico: dopo ogni modifica lanci in automatico il formatter, il linter, i test. Non devi ricordarglielo. Oppure, prima di un'azione, puoi bloccarla: niente edit su file protetti, niente comandi vietati. In pratica trasformate la disciplina in configurazione. Quello che prima speravate che l'AI 'si ricordasse', adesso è una regola che non si può saltare.",
  },
  {
    id: "permessi",
    kicker: "Sicurezza",
    title: "Permessi e settings.json",
    subtitle: "Più autonomia dove è sicuro, controllo stretto dove serve.",
    layout: "bullets",
    bullets: [
      "allow/deny per tool e pattern di comando: meno richieste ripetitive sulle azioni fidate.",
      "Modalità: default, acceptEdits, plan — e bypass solo in ambienti sandbox.",
      "/permissions per ispezionare e correggere le regole al volo.",
      "Concedi ampiezza solo su branch dedicati, container o CI: mai in produzione.",
    ],
    notes:
      "Legato agli hooks c'è il tema dei permessi. In settings.json avete liste allow e deny per tool e pattern di comando: così smettete di confermare cinquanta volte le stesse azioni fidate. Ci sono le modalità — default, acceptEdits, plan — e c'è il bypass, che però va usato solo in sandbox. Dal vivo avete /permissions per ispezionare e correggere le regole al volo. Il principio di fondo: date autonomia dove è sicuro — un branch dedicato, un container, la CI — e tenete il controllo stretto dove serve. In produzione, mai mano libera.",
  },
  {
    id: "mcp",
    kicker: "Integrazioni",
    title: "MCP: collega il mondo esterno",
    subtitle: "Dai a Claude accesso a dati e sistemi reali, non solo al codice.",
    layout: "cards",
    cards: [
      {
        title: "Database",
        desc: "Interroga schema e dati reali invece di indovinare la struttura.",
      },
      {
        title: "Browser & Figma",
        desc: "Leggi il design o testa la UI end-to-end direttamente dall’agente.",
      },
      {
        title: "Issue & Git host",
        desc: "Apri PR, leggi ticket, commenta: il ciclo di sviluppo nel loop.",
      },
      {
        title: "Scope minimo",
        desc: "Un server per capability, con auth sicura e permessi ridotti all’essenziale.",
      },
    ],
    notes:
      "Gli MCP portano Claude fuori dal codice. Con un server database interroga lo schema e i dati reali, invece di indovinare com'è fatta la tabella. Con browser o Figma legge il design o testa la UI end-to-end. Con l'issue tracker o il Git host apre PR, legge i ticket, commenta — il ciclo di sviluppo entra dentro il loop. La regola pratica: un server per capability, autenticazione sicura, e scope ridotto all'essenziale. Non serve dare accesso a tutto: serve dare accesso alla cosa giusta.",
  },
  {
    id: "workflow",
    kicker: "Metodo",
    title: "Explore → Plan → Implement → Verify",
    subtitle: "Il ciclo che regge anche sui task complessi.",
    layout: "steps",
    steps: [
      {
        title: "Explore",
        desc: "Fai mappare il codice esistente — anche con subagenti — prima di decidere.",
      },
      {
        title: "Plan",
        desc: "Plan mode (Shift+Tab): concordi l’approccio senza toccare i file.",
      },
      {
        title: "Implement",
        desc: "Passi piccoli e verificabili; TDD dove ha senso, con i test scritti prima.",
      },
      {
        title: "Verify",
        desc: "Build, test e review del diff — e per la UI, uno screenshot di conferma.",
      },
    ],
    notes:
      "Adesso il metodo di lavoro, quello che regge anche sui task complessi. Quattro fasi. Explore: fate mappare il codice esistente prima di decidere qualsiasi cosa, magari con dei subagenti. Plan: attivate il plan mode con Shift+Tab, così Claude propone un approccio senza toccare i file e voi lo correggete a costo zero. Implement: passi piccoli e verificabili, e dove ha senso il TDD, con i test scritti prima. Verify: build, test, review del diff — e se state lavorando su UI, uno screenshot di conferma. La differenza tra un buon risultato e una rilavorazione è quasi sempre nelle prime due fasi.",
  },
  {
    id: "contesto",
    kicker: "Contesto",
    title: "Governa la finestra di contesto",
    subtitle: "È una risorsa finita: gestirla bene è una skill avanzata.",
    layout: "bullets",
    bullets: [
      "/clear tra task scollegati: contesto pulito significa risposte più precise.",
      "/compact per riassumere le sessioni lunghe mantenendo il filo del lavoro.",
      "Delega ai subagenti ciò che genera rumore: log estesi, ricerche, esplorazioni.",
      "CLAUDE.md e @file mirati: fornisci solo il contesto che serve, quando serve.",
    ],
    notes:
      "Torniamo sul contesto, perché è una risorsa finita e gestirla è una skill vera. Tra due task che non c'entrano nulla, /clear: ripartite puliti, le risposte diventano più precise. Su sessioni molto lunghe, /compact: riassume mantenendo il filo. Tutto quello che genera rumore — log lunghissimi, ricerche, esplorazioni — delegatelo ai subagenti, così non intasa la conversazione principale. E date contesto in modo chirurgico: CLAUDE.md e @file mirati, solo quello che serve, quando serve. Un contesto affollato non è un contesto ricco: è un contesto confuso.",
  },
  {
    id: "antipattern",
    kicker: "Attenzione",
    title: "Pattern e anti-pattern avanzati",
    layout: "doDont",
    dontItems: [
      "Un unico megaprompt per un task enorme.",
      "CLAUDE.md gigante: diventa rumore, non contesto.",
      "Bypass dei permessi fuori dalla sandbox.",
      "Subagenti e comandi ridondanti che si sovrappongono.",
      "Accettare i diff senza leggerli.",
    ],
    doItems: [
      "Task spezzati, ognuno con criteri di “fatto”.",
      "Memoria breve, referenziata con @file.",
      "Hooks per lint e test invece di ricordarlo a mano.",
      "Subagenti per isolare il contesto ed esplorare in parallelo.",
      "Review del diff e test verdi prima del commit.",
    ],
    notes:
      "Facciamo il riassunto per contrasto. Da evitare: il megaprompt unico per un task enorme; il CLAUDE.md gigante, che diventa rumore; il bypass dei permessi fuori dalla sandbox; subagenti e comandi ridondanti che si pestano i piedi; e accettare i diff senza leggerli. Da fare, specularmente: task spezzati, ognuno con un criterio di 'fatto'; memoria breve, richiamata con @file; hooks per lint e test invece di ricordarveli; subagenti per isolare il contesto ed esplorare in parallelo; e sempre review del diff con i test verdi prima del commit. Se vi ricordate solo questa slide, avete già l'80% del valore.",
  },
  {
    id: "checklist",
    kicker: "In sintesi",
    title: "Checklist del setup avanzato",
    layout: "checklist",
    chips: [
      "CLAUDE.md progetto + utente, con @import",
      "Slash command per i flussi ricorrenti",
      "Subagenti con tool e contesto dedicati",
      "Hooks: format, lint e test automatici",
      "Permessi in settings.json + sandbox",
      "MCP per DB, browser e issue tracker",
      "Plan mode sui task ampi o rischiosi",
      "/clear e /compact per il contesto",
    ],
    notes:
      "Questa tenetela come promemoria operativo per quando tornate al vostro repo. CLAUDE.md di progetto e utente, con gli import. Slash command per i flussi ricorrenti. Subagenti con tool e contesto dedicati. Hooks per format, lint e test automatici. Permessi in settings.json più sandbox per il resto. MCP per database, browser e issue tracker. Plan mode sui task ampi o rischiosi. E /clear e /compact per tenere pulito il contesto. Non serve fare tutto oggi: partite da CLAUDE.md e da un hook per i test, il resto viene da sé.",
  },
  {
    id: "closing",
    kicker: "Buon Hagenthon",
    title: "Claude Code è una piattaforma: progettala, non solo usarla.",
    subtitle:
      "Contesto, estensioni e automazione: l’AI accelera, tu resti l’ingegnere.",
    layout: "closing",
    chips: ["/agents", "/hooks", ".claude/commands", "claude -p", "docs.claude.com/claude-code"],
    notes:
      "Chiudo con il concetto che vorrei vi portaste a casa: Claude Code non è solo uno strumento da usare, è una piattaforma da progettare. Contesto, estensioni, automazione — l'AI vi dà velocità, ma l'ingegnere restate voi: la responsabilità del codice non si delega. Qui sotto avete i comandi da cui ripartire — /agents, /hooks, la cartella .claude/commands, claude -p — e la documentazione ufficiale. Buon Hagenthon, e buon divertimento.",
  },
];

export const FINAL_MESSAGE = [
  "quale problema affronta",
  "perché è importante",
  "come usa l'agentic coding",
  "quale risultato produce",
  "come è stato verificato",
];
