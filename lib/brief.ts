export type Theme = {
  id: string;
  number: string;
  title: string;
  objective: string;
  focus: string;
  challenge: string;
  examples: string[];
  constraints: string[];
  deliverables: { title: string; desc: string }[];
  avoid: string[];
};

export const DEMONSTRATE = [
  "utilità concreta",
  "qualità tecnica",
  "uso consapevole dell'AI",
  "controllo umano sul risultato",
  "evidenza di validazione",
];

export const GENERAL_RULES = [
  "I team sono composti da 2 persone.",
  "Il tempo di sviluppo è di 5 ore, distribuito in due blocchi separati dalla pausa pranzo.",
  "Il freeze è alle 15:20: dopo il freeze non sarà più possibile modificare il prototipo, ma solo preparare la demo a partire dal materiale già consegnato.",
  "Ogni team dovrà presentare una soluzione dimostrabile, anche in forma prototipale, ma non puramente teorica.",
  "La consegna finale dovrà essere effettuata tramite repository pubblico GitHub.",
];

export const AGENDA = [
  { time: "09:00", label: "Intro e kick-off", note: "20 min" },
  { time: "09:20", label: "Sviluppo + preparazione demo" },
  { time: "13:00", label: "Pausa pranzo", note: "1 ora" },
  { time: "14:00", label: "Sviluppo + preparazione demo (continua)" },
  { time: "15:20", label: "Freeze — stop sviluppo", freeze: true },
  { time: "15:20", label: "Presentazioni e demo finali", note: "30 min" },
  { time: "15:50", label: "Chiusura", note: "10 min" },
  { time: "16:00", label: "Aperitivo" },
];

export const SUBMISSION_RULES = [
  "La consegna deve avvenire tramite repository pubblico GitHub.",
  "Il repository deve essere organizzato in 3 cartelle principali: app/, agents/ e presentation/.",
  "app/ contiene la soluzione sviluppata (codice del prototipo).",
  "agents/ contiene la struttura agentica utilizzata: agenti, istruzioni, comandi, prompt, skills e workflow.",
  "presentation/ contiene la presentazione della soluzione e della struttura agentica.",
  "La presentazione deve essere realizzata in formato HTML, seguendo le brand guidelines Accenture.",
  "Entro il freeze devono essere pushati sia il progetto sia la presentazione.",
];

export const REPO_STRUCTURE = [
  "/",
  "├── app/            soluzione sviluppata",
  "├── agents/         struttura agentica",
  "├── presentation/   presentazione HTML (brand Accenture)",
  "└── README.md",
];

export const AGENTIC_CAPABILITIES = [
  "analisi automatica di un problema",
  "proposta di correzioni",
  "generazione di test",
  "validazione automatizzata",
  "adattamento dinamico a un profilo utente",
  "supporto guidato a un processo",
];

export const NOT_ALLOWED = [
  "una semplice presentazione",
  "un'idea puramente concettuale",
  "un output generato dall'AI senza revisione umana",
];

export type ExpectedItem = {
  title: string;
  desc: string;
  bullets?: string[];
};

export const EXPECTED_RESULTS: ExpectedItem[] = [
  {
    title: "Una soluzione funzionante",
    desc: "Un prototipo che mostri chiaramente il problema affrontato e il modo in cui la soluzione lo risolve o lo migliora. Non deve essere un prodotto finito, ma sufficientemente funzionante da dimostrare il valore dell'idea.",
  },
  {
    title: "Una demo finale",
    desc: "La demo dovrà mostrare:",
    bullets: [
      "il problema scelto",
      "l'utente o lo scenario di riferimento",
      "come funziona la soluzione",
      "dove interviene l'agente AI",
      "quale miglioramento viene prodotto",
      "quali limiti o rischi sono stati considerati",
    ],
  },
  {
    title: "Un'evidenza prima / dopo",
    desc: "Almeno un esempio concreto di miglioramento. Ad esempio:",
    bullets: [
      "uno snippet di codice corretto",
      "una schermata migliorata",
      "un testo semplificato",
      "un flusso reso più chiaro",
      "un test generato",
      "una checklist completata",
      "un confronto tra comportamento iniziale e finale",
    ],
  },
  {
    title: "Un'evidenza di validazione",
    desc: "Almeno una prova che il risultato funziona. Può consistere in:",
    bullets: [
      "test automatici",
      "checklist",
      "revisione manuale",
      "simulazione di casi d'uso",
      "confronto prima / dopo",
      "verifica su esempi reali o realistici",
    ],
  },
  {
    title: "Una breve nota sul processo",
    desc: "Il team dovrà spiegare:",
    bullets: [
      "come ha usato l'AI",
      "quali output sono stati rivisti o corretti da persone",
      "quali decisioni tecniche sono state prese",
      "quali limiti della soluzione sono stati identificati",
    ],
  },
];

export const THEMES: Theme[] = [
  {
    id: "accessibilita",
    number: "01",
    title: "Accessibilità Digitale",
    objective:
      "Usare strumenti di agentic coding per rendere prodotti e servizi digitali più accessibili a persone con disabilità, bisogni specifici o difficoltà nell'uso di interfacce digitali.",
    focus:
      "Il focus non è creare un'interfaccia “più bella”, ma supportare il processo di sviluppo, test o manutenzione di servizi digitali più accessibili.",
    challenge:
      "In team da 2 persone, avete 5 ore di sviluppo per progettare e realizzare una soluzione che utilizzi strumenti di agentic coding per identificare, correggere o prevenire problemi di accessibilità in un prodotto o servizio digitale.",
    examples: [
      "un reviewer automatico per componenti frontend",
      "uno strumento che rileva label mancanti, problemi di contrasto, alt text assenti o navigazione da tastiera non corretta",
      "un assistant che propone fix HTML, ARIA o messaggi di errore più chiari",
      "un generatore di test di accessibilità",
      "un validatore per form digitali",
      "un copilot che trasforma requisiti o mockup in checklist di accessibilità",
    ],
    constraints: [
      "Scegliere un problema preciso di accessibilità.",
      "Lavorare su un contesto chiaro: una pagina web, un form, un componente UI, un design system, una pipeline di test o un contenuto digitale.",
      "Mostrare almeno un esempio prima / dopo e almeno una prova di validazione.",
      "Indicare dove l'AI ha contribuito e dove è stata necessaria revisione umana.",
    ],
    deliverables: [
      {
        title: "Accessibility Problem Definition",
        desc: "Quale barriera viene affrontata, chi impatta e in quale scenario.",
      },
      {
        title: "Before / After Evidence",
        desc: "Una prova concreta del miglioramento: screenshot, snippet, log, test o confronto.",
      },
      {
        title: "Validation Evidence",
        desc: "Una checklist, un test, una simulazione o una revisione che dimostri che il miglioramento è reale.",
      },
    ],
    avoid: [
      "demo generiche senza un problema preciso",
      "soluzioni solo teoriche",
      "progetti focalizzati solo sulla grafica",
      "analisi senza proposta di correzione o validazione",
      "uso dell'AI non spiegabile dal team",
    ],
  },
  {
    id: "finanziaria",
    number: "02",
    title: "Inclusione Finanziaria",
    objective:
      "Usare strumenti di agentic coding per rendere servizi finanziari digitali più chiari, comprensibili e accessibili, soprattutto per persone con bassa alfabetizzazione finanziaria o difficoltà digitali.",
    focus:
      "Il focus non è creare un consulente finanziario AI, ma migliorare l'accesso ai servizi, la comprensione delle informazioni e la chiarezza dei processi.",
    challenge:
      "In team da 2 persone, avete 5 ore di sviluppo per progettare e realizzare una soluzione che utilizzi strumenti di agentic coding per semplificare l'accesso, la comprensione o l'utilizzo di un servizio finanziario digitale.",
    examples: [
      "uno strumento che semplifica il linguaggio di condizioni, costi o commissioni",
      "un checker per form e journey finanziari",
      "un assistant per onboarding a servizi digitali",
      "uno strumento che spiega termini, costi o vincoli in linguaggio semplice",
      "un copilot che previene errori utente in processi finanziari",
      "un validatore della chiarezza di documenti o schermate",
    ],
    constraints: [
      "Selezionare uno scenario preciso: apertura conto, attivazione di un servizio, comprensione di costi o commissioni, compilazione di un form, verifica documentale o lettura di termini e condizioni.",
      "Dimostrare un miglioramento tangibile di chiarezza, comprensibilità o usabilità.",
      "Vietato fornire raccomandazioni di investimento, consulenza finanziaria personalizzata o indicazioni su cosa comprare, vendere o scegliere.",
      "Includere una capability software concreta, non solo una riscrittura di testi.",
    ],
    deliverables: [
      {
        title: "User Difficulty Statement",
        desc: "Quale difficoltà ha l'utente, in quale processo e perché è rilevante.",
      },
      {
        title: "Before / After Simplicity Evidence",
        desc: "Un esempio di testo, flusso, schermata o istruzione resa più chiara.",
      },
      {
        title: "Risk & Clarity Note",
        desc: "Cosa è stato semplificato, cosa non è stato alterato e come è stata evitata ambiguità.",
      },
    ],
    avoid: [
      "chatbot generici",
      "pura riscrittura di testi senza logica applicativa",
      "soluzioni che danno consigli finanziari",
      "semplificazioni che cambiano il significato originale",
      "demo non collegate a un processo reale",
    ],
  },
  {
    id: "educazione",
    number: "03",
    title: "Educazione Digitale Inclusiva",
    objective:
      "Usare strumenti di agentic coding per abbassare le barriere di accesso all'apprendimento digitale, aiutando persone che partono da una situazione di svantaggio.",
    focus:
      "Riguarda utenti con bassa alfabetizzazione digitale, difficoltà cognitive o linguistiche, DSA, anziani, lavoratori in riqualificazione o persone che devono imparare a usare strumenti digitali essenziali. Il focus non è creare contenuti formativi generici, ma supportare un percorso di apprendimento inclusivo in uno scenario concreto.",
    challenge:
      "In team da 2 persone, avete 5 ore di sviluppo per progettare e realizzare una soluzione che utilizzi strumenti di agentic coding per rendere più accessibile, comprensibile o personalizzato un percorso di apprendimento digitale per utenti con difficoltà.",
    examples: [
      "un generatore di micro-lezioni adattate al livello dell'utente",
      "una guida passo-passo per usare uno strumento digitale reale",
      "un helper per lettura, comprensione, glossario o sintesi",
      "un motore di quiz con feedback personalizzato",
      "un coach che rileva dove l'utente si blocca",
      "uno strumento multilingua per spiegare termini digitali o istituzionali",
    ],
    constraints: [
      "Scegliere un profilo utente preciso: una persona anziana, con bassa alfabetizzazione digitale, con difficoltà linguistiche, con DSA, un lavoratore in riqualificazione o un nuovo utente di un processo digitale.",
      "Lavorare su uno scenario di apprendimento concreto, non astratto.",
      "Dimostrare un miglioramento misurabile in almeno uno tra: comprensione, autonomia, completamento del task, riduzione degli errori, capacità di ripetere un'azione.",
      "Vietato presentare temi sensibili (sanità clinica, fiscalità personalizzata, ambito legale) come consigli professionali.",
      "Includere almeno una capability agentica concreta: adattamento dinamico, valutazione della comprensione, percorso personalizzato, rilevamento del blocco o feedback mirato sugli errori.",
    ],
    deliverables: [
      {
        title: "Learner Profile Statement",
        desc: "Chi è l'utente target, quale difficoltà ha e in quale scenario.",
      },
      {
        title: "Adaptive Evidence",
        desc: "Un esempio concreto di come la soluzione cambia in base al livello o al bisogno dell'utente.",
      },
      {
        title: "Learning Outcome Note",
        desc: "Cosa l'utente sa fare alla fine che prima non sapeva fare, e come è stato verificato.",
      },
    ],
    avoid: [
      "generatori generici di lezioni",
      "tutor conversazionali aperti senza percorso strutturato",
      "pura traduzione automatica",
      "soluzioni non collegate a un utente fragile specifico",
      "contenuti sensibili trattati come consulenza",
    ],
  },
];

export const CRITERIA = [
  {
    title: "Profondità agentica",
    desc: "Il sistema agentico è strutturato? Orchestrazione, sub-agenti, workflow multi-step, skills, stato esternalizzato, output strutturati.",
    weight: "20%",
  },
  {
    title: "Qualità delle istruzioni",
    desc: "Le istruzioni sono ben scritte? Scope chiaro, output format definito, step-by-step, vincoli espliciti, coerenza tra file, no sovrapposizioni.",
    weight: "20%",
  },
  {
    title: "Qualità dell'idea",
    desc: "Il problema è reale e rilevante? L'approccio agentico è adeguato al problema, non forzato. L'AI aggiunge valore concreto.",
    weight: "16%",
  },
  {
    title: "Robustezza",
    desc: "Il sistema è resiliente? Fallback, gestione degli errori, escalation umana intenzionale (HITL), limiti di iterazione.",
    weight: "13%",
  },
  {
    title: "Qualità tecnica",
    desc: "Il codice è solido? Error handling, timeout, retry, configurazione sicura (secrets, env), model tiering.",
    weight: "10%",
  },
  {
    title: "Adeguatezza degli strumenti",
    desc: "Tools e agenti sono scelti correttamente per il task? Né troppo pochi né ridondanti tra loro.",
    weight: "9%",
  },
  {
    title: "Efficienza dei token",
    desc: "La soluzione è ottimizzata per ridurre il consumo di token?",
    weight: "6%",
  },
  {
    title: "Documentazione",
    desc: "Il repository è documentato? README chiaro, flusso agentico spiegato, setup, prerequisiti, tool/MCP/skill documentati.",
    weight: "6%",
  },
];

export const FINAL_MESSAGE = [
  "quale problema affronta",
  "perché è importante",
  "come usa l'agentic coding",
  "quale risultato produce",
  "come è stato verificato",
];
