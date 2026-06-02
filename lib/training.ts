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
};

export const SLIDES: Slide[] = [
  {
    id: "cover",
    kicker: "Hagenthon · Training",
    title: "Usare Claude Code nel modo giusto",
    subtitle:
      "Guida pratica di livello intermedio all’agentic coding nel terminale. 21 slide, 10 minuti, zero fronzoli.",
    layout: "cover",
    chips: ["Mindset", "Workflow", "Contesto", "Sicurezza", "Buone pratiche"],
  },
  {
    id: "cos-e",
    kicker: "Le basi",
    title: "Che cos’è Claude Code",
    subtitle:
      "Un agente di coding che vive nel tuo terminale e lavora sul tuo repository.",
    layout: "bullets",
    bullets: [
      "Legge, cerca, scrive e modifica file, esegue comandi e lancia i test — sempre con il tuo permesso.",
      "Capisce il contesto dell’intero progetto, non solo del file aperto.",
      "Non è un autocomplete: è un collaboratore che pianifica ed esegue task multi-step.",
      "Tu resti il pilota: approvi, correggi e valuti il risultato.",
    ],
  },
  {
    id: "mindset",
    kicker: "Mindset",
    title: "Pensa “collega”, non “cerca e incolla”",
    subtitle: "Il cambio di mentalità che fa la differenza.",
    layout: "cards",
    cards: [
      {
        title: "Delega obiettivi",
        desc: "“Aggiungi la validazione al form X” invece di dettare riga per riga.",
      },
      {
        title: "Lascialo esplorare",
        desc: "Sa cercare nel codebase e capire il contesto prima di agire.",
      },
      {
        title: "Itera in conversazione",
        desc: "Raffina e correggi il tiro invece di ripartire da zero.",
      },
      {
        title: "Verifica sempre",
        desc: "Ogni output va letto, eseguito e validato. Sei tu il responsabile.",
      },
    ],
  },
  {
    id: "setup",
    kicker: "Setup",
    title: "Primo avvio in 3 passi",
    layout: "steps",
    steps: [
      {
        title: "Installa e autentica",
        desc: "Installa la CLI (npm install -g @anthropic-ai/claude-code) e accedi con il tuo account.",
      },
      {
        title: "Apri il progetto",
        desc: "Lancia il comando claude dentro la cartella del repository su cui vuoi lavorare.",
      },
      {
        title: "Inizializza la memoria",
        desc: "Usa /init per generare un CLAUDE.md di base con i comandi e le convenzioni del progetto.",
      },
    ],
  },
  {
    id: "claude-md",
    kicker: "Contesto persistente",
    title: "CLAUDE.md: la memoria del progetto",
    subtitle: "Un file che Claude legge automaticamente all’inizio di ogni sessione.",
    layout: "bullets",
    bullets: [
      "Comandi chiave del progetto: build, test, lint, avvio.",
      "Convenzioni di codice e di stile condivise dal team.",
      "Architettura, cartelle importanti e punti di ingresso.",
      "Vincoli e cose da NON fare.",
    ],
    callout:
      "Tienilo breve e aggiornato: è contesto operativo, non documentazione esaustiva.",
  },
  {
    id: "contesto",
    kicker: "Contesto",
    title: "Dai a Claude il contesto giusto",
    subtitle: "Più il contesto è chiaro, migliore è il risultato.",
    layout: "cards",
    cards: [
      {
        title: "Menziona i file",
        desc: "Usa @ per includere file e cartelle rilevanti nella richiesta.",
      },
      {
        title: "Incolla gli errori",
        desc: "Stack trace e log completi valgono più di una descrizione vaga.",
      },
      {
        title: "Mostra l’obiettivo",
        desc: "Spiega cosa deve succedere, non solo cosa non funziona.",
      },
      {
        title: "Riferisci esempi",
        desc: "“Fai come nel componente X” orienta lo stile e l’approccio.",
      },
    ],
  },
  {
    id: "prompt",
    kicker: "Prompt",
    title: "Anatomia di una buona richiesta",
    layout: "bullets",
    bullets: [
      "Obiettivo chiaro — cosa vuoi ottenere.",
      "Contesto — dove intervenire, quali file, quali vincoli.",
      "Criteri di “fatto” — test che passano, comportamento atteso.",
      "Un task alla volta — spezza i compiti grandi in passi.",
    ],
    example: {
      bad: "Sistema il login.",
      good: "Il login fallisce con le email in maiuscolo: normalizza l’email prima del confronto e aggiungi un test che lo verifichi.",
    },
  },
  {
    id: "plan-mode",
    kicker: "Pianificare",
    title: "Plan mode: pensa prima di agire",
    subtitle: "Claude analizza e propone un piano senza toccare i file.",
    layout: "bullets",
    bullets: [
      "Attivalo (Shift+Tab) per i task complessi, ampi o rischiosi.",
      "Rivedi e correggi il piano prima dell’esecuzione.",
      "Approvi il piano → si passa all’implementazione.",
      "Riduce sorprese, vicoli ciechi e rilavorazioni.",
    ],
  },
  {
    id: "workflow",
    kicker: "Metodo",
    title: "Il ciclo che funziona",
    subtitle: "Quattro fasi, da ripetere finché i criteri sono soddisfatti.",
    layout: "steps",
    steps: [
      {
        title: "Esplora",
        desc: "Fagli leggere e capire il codice esistente e il contesto.",
      },
      {
        title: "Pianifica",
        desc: "Concorda l’approccio, idealmente in plan mode.",
      },
      {
        title: "Implementa",
        desc: "Lascialo lavorare per passi piccoli e verificabili.",
      },
      {
        title: "Verifica",
        desc: "Test, esecuzione e revisione del diff prima di chiudere.",
      },
    ],
  },
  {
    id: "permessi",
    kicker: "Sicurezza",
    title: "Permessi: il controllo è tuo",
    layout: "bullets",
    bullets: [
      "Claude chiede conferma prima di modificare file o eseguire comandi.",
      "Le modalità vanno dal “chiedi sempre” all’“accetta le modifiche”.",
      "Concedi permessi ampi solo in ambienti sicuri: sandbox, branch dedicati.",
      "Leggi sempre cosa stai approvando, soprattutto i comandi distruttivi.",
    ],
  },
  {
    id: "strumenti",
    kicker: "Come lavora",
    title: "Legge e cerca prima di scrivere",
    subtitle: "Non improvvisa: raccoglie contesto, poi agisce.",
    layout: "cards",
    cards: [
      {
        title: "Cerca nel repo",
        desc: "Ricerca testuale e per pattern su tutto il codebase.",
      },
      {
        title: "Legge i file giusti",
        desc: "Apre i file pertinenti per capire prima di intervenire.",
      },
      {
        title: "Modifica chirurgica",
        desc: "Applica diff mirati invece di riscrivere interi file.",
      },
      {
        title: "Spiega le scelte",
        desc: "Racconta cosa cambia e perché, così puoi seguirlo.",
      },
    ],
  },
  {
    id: "testare",
    kicker: "Verifica",
    title: "Fagli provare il suo lavoro",
    subtitle: "La verifica empirica batte qualsiasi supposizione.",
    layout: "bullets",
    bullets: [
      "Chiedi esplicitamente di eseguire build, test e linter.",
      "Fornisci il comando corretto (o mettilo in CLAUDE.md).",
      "Regola d’oro: “non è fatto finché i test non passano”.",
      "Se qualcosa fallisce, vuoi saperlo subito — non in demo.",
    ],
  },
  {
    id: "git",
    kicker: "Versionamento",
    title: "Git: commit e PR puliti",
    layout: "bullets",
    bullets: [
      "Lavora su un branch dedicato, mai direttamente su main.",
      "Commit piccoli, frequenti e descrittivi.",
      "Fai scrivere a Claude i messaggi di commit e le descrizioni delle PR.",
      "Rivedi sempre il diff completo prima di fare push.",
    ],
  },
  {
    id: "commands",
    kicker: "Automazione",
    title: "Slash command e skill",
    subtitle: "Standardizzano e accelerano i flussi ricorrenti.",
    layout: "bullets",
    bullets: [
      "I comandi con / eseguono azioni rapide e ripetibili.",
      "Crea comandi personalizzati per i flussi tipici del team.",
      "Le skill aggiungono capacità specializzate, attivate su richiesta.",
      "Meno copia-incolla di istruzioni, più coerenza.",
    ],
  },
  {
    id: "subagenti",
    kicker: "Scalare",
    title: "Subagenti e lavoro in parallelo",
    layout: "bullets",
    bullets: [
      "Delega ricerche ampie o esplorazioni a subagenti dedicati.",
      "Più task indipendenti possono procedere in parallelo.",
      "L’agente principale resta focalizzato sull’obiettivo.",
      "Particolarmente utile su codebase grandi e poco familiari.",
    ],
  },
  {
    id: "contesto-sessioni",
    kicker: "Contesto",
    title: "Gestisci il contesto nelle sessioni lunghe",
    subtitle: "Il contesto è una risorsa finita: usalo bene.",
    layout: "bullets",
    bullets: [
      "Sessioni focalizzate su un task = risposte più precise.",
      "Usa /clear per ripartire puliti quando cambi attività.",
      "Evita di mescolare task scollegati nella stessa conversazione.",
      "Riassumi o ri-ancóra il contesto se la chat diventa molto lunga.",
    ],
  },
  {
    id: "iterare",
    kicker: "Qualità",
    title: "Itera e fai revisionare",
    layout: "bullets",
    bullets: [
      "Chiedi una code review del diff prima di considerarlo chiuso.",
      "Correggi in conversazione, non rifacendo tutto da capo.",
      "Fagli spiegare le scelte che non ti sono chiare.",
      "Procedi a piccoli passi, ognuno verificabile.",
    ],
  },
  {
    id: "antipattern",
    kicker: "Attenzione",
    title: "Errori comuni da evitare",
    layout: "doDont",
    dontItems: [
      "Prompt vaghi, senza obiettivo né criteri.",
      "Accettare le modifiche senza leggerle.",
      "Task enormi affrontati in un colpo solo.",
      "Permessi ampi su ambienti di produzione.",
      "Ignorare test ed errori.",
    ],
    doItems: [
      "Obiettivi chiari e criteri di “fatto”.",
      "Rivedere ogni diff prima di accettarlo.",
      "Spezzare i compiti in passi piccoli.",
      "Lavorare su branch dedicati.",
      "Validare sempre con i test.",
    ],
  },
  {
    id: "governance",
    kicker: "Uso responsabile",
    title: "AI con controllo umano",
    subtitle: "Velocità in più, responsabilità invariata.",
    layout: "bullets",
    bullets: [
      "Il responsabile del codice sei tu, non l’AI.",
      "Valida sempre output, qualità e sicurezza.",
      "Attenzione a dati sensibili, credenziali e segreti.",
      "Trasparenza: documenta dove e come l’AI ha contribuito.",
    ],
  },
  {
    id: "checklist",
    kicker: "In sintesi",
    title: "La checklist del buon uso",
    layout: "checklist",
    chips: [
      "Contesto chiaro: CLAUDE.md + @file",
      "Obiettivo + criteri di “fatto”",
      "Plan mode sui task complessi",
      "Esplora → pianifica → implementa → verifica",
      "Leggi i diff, valida con i test",
      "Branch dedicato e commit puliti",
      "Sessioni focalizzate, contesto pulito",
      "Controllo umano, sempre",
    ],
  },
  {
    id: "closing",
    kicker: "Buon Hagenthon",
    title: "Claude Code è un acceleratore. Tu sei l’ingegnere.",
    subtitle: "Usa l’AI con metodo: più velocità, stessa responsabilità.",
    layout: "closing",
    chips: ["/help in app", "CLAUDE.md", "Plan mode (Shift+Tab)", "docs.claude.com/claude-code"],
  },
];
