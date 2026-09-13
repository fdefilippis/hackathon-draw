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
  { time: "17:30", label: "Aperitivo" },
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
      "Usare strumenti di agentic coding per costruire qualcosa che aiuti davvero una persona con una disabilità, una fragilità o una difficoltà a usare un servizio digitale che oggi, da sola, non riesce a usare bene.",
    focus:
      "Il focus non è l’audit tecnico del codice né la conformità formale alle linee guida: è la persona. La soluzione deve mettersi accanto a chi ha la difficoltà e aiutarlo a capire, orientarsi, compilare, decidere e portare a termine ciò che stava provando a fare.",
    challenge:
      "In team da 2 persone, avete 5 ore di sviluppo per progettare e realizzare uno strumento che affianchi una persona con una difficoltà precisa mentre usa un servizio digitale reale, e le permetta di arrivare fino in fondo al suo obiettivo.",
    examples: [
      "un assistente che riscrive una pagina o un documento complesso nel linguaggio e nel formato di cui quella persona ha bisogno",
      "una guida che accompagna passo passo la compilazione di un modulo online, un campo alla volta, spiegando cosa serve davvero",
      "uno strumento che racconta a parole il contenuto di una schermata, di un’immagine o di un grafico a chi non può vederlo",
      "un aiuto che traduce un messaggio di errore o una richiesta burocratica in parole semplici e indica qual è il passo successivo",
      "un’interfaccia alternativa e semplificata di un servizio esistente, adattata a chi ha difficoltà motorie, visive o cognitive",
      "un supporto che alleggerisce il carico di lettura: sintesi, evidenziazione dell’essenziale, suddivisione in passi brevi",
      "un compagno che si accorge quando l’utente si blocca o sbaglia e interviene con un suggerimento mirato",
    ],
    constraints: [
      "Partire da una persona concreta e da una difficoltà precisa: chi è, cosa sta cercando di fare, dove si blocca oggi.",
      "Lavorare su un servizio o un contenuto digitale reale o realistico: un sito pubblico, un modulo, una bolletta, un’app, una procedura online.",
      "La soluzione deve poter essere usata dalla persona stessa, non solo da uno sviluppatore o da un tecnico.",
      "Semplificare senza tradire: il significato delle informazioni originali non deve cambiare.",
      "Mostrare in demo il percorso dell’utente prima e dopo: cosa non riusciva a fare e cosa riesce a fare adesso.",
      "Indicare dove l’AI ha contribuito e dove è stata necessaria revisione umana.",
    ],
    deliverables: [
      {
        title: "Persona & Barriera",
        desc: "Chi state aiutando, quale barriera incontra e in quale momento esatto del suo percorso si ferma.",
      },
      {
        title: "Percorso Assistito",
        desc: "La demo del percorso completo: dal punto in cui la persona si bloccava fino al task portato a termine con il supporto della soluzione.",
      },
      {
        title: "Autonomia & Limiti",
        desc: "Quanta autonomia guadagna la persona, cosa è stato semplificato senza alterarne il senso e quali limiti restano.",
      },
    ],
    avoid: [
      "strumenti pensati per gli sviluppatori invece che per la persona con la difficoltà",
      "checker di conformità che producono solo report tecnici",
      "soluzioni che si fermano alla diagnosi del problema senza aiutare nessuno a superarlo",
      "restyling grafici che non fanno guadagnare autonomia",
      "profili utente generici: “un utente disabile” non è un profilo",
      "uso dell’AI non spiegabile dal team",
    ],
  },
  {
    id: "finanziaria",
    number: "02",
    title: "Inclusione Finanziaria",
    objective:
      "Usare strumenti di agentic coding per supportare l'educazione alla finanza personale di base, aiutando le persone con bassa alfabetizzazione finanziaria a comprendere concetti e gestire meglio le proprie finanze quotidiane.",
    focus:
      "Il focus non è creare un consulente finanziario AI, ma supportare l'educazione alla finanza personale di base: aiutare le persone a comprendere concetti, gestire le proprie finanze quotidiane e prendere decisioni informate.",
    challenge:
      "In team da 2 persone, avete 5 ore di sviluppo per progettare e realizzare una soluzione che utilizzi strumenti di agentic coding per supportare l'educazione alla finanza personale di base, rendendo concetti e gestione del denaro più comprensibili e accessibili.",
    examples: [
      "uno strumento che spiega in linguaggio semplice concetti finanziari di base (interesse, tasso, inflazione, rata, TAEG)",
      "un coach che aiuta a costruire e capire un budget personale o a tenere traccia delle spese",
      "un simulatore che mostra l'impatto di scelte quotidiane (risparmio, spese ricorrenti, rate) nel tempo",
      "un assistant che traduce il gergo di estratti conto, bollette o documenti finanziari in concetti chiari",
      "un percorso di micro-lezioni adattate al livello di alfabetizzazione finanziaria dell'utente",
      "un quiz interattivo con feedback che rafforza la comprensione di concetti finanziari di base",
    ],
    constraints: [
      "Selezionare uno scenario educativo preciso: comprensione di un concetto finanziario di base, gestione del budget personale, lettura di un estratto conto o di una bolletta, comprensione di costi e commissioni o simulazione di una scelta quotidiana di risparmio.",
      "Dimostrare un miglioramento tangibile nella comprensione o nella capacità dell'utente di gestire le proprie finanze.",
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
    weight: "24%",
  },
  {
    title: "Qualità delle istruzioni",
    desc: "Le istruzioni sono ben scritte? Scope chiaro, output format definito, step-by-step, vincoli espliciti, coerenza tra file, no sovrapposizioni.",
    weight: "19%",
  },
  {
    title: "Robustezza",
    desc: "Il sistema è resiliente? Fallback, gestione degli errori, escalation umana intenzionale (HITL), limiti di iterazione.",
    weight: "15%",
  },
  {
    title: "Efficienza dei token",
    desc: "La soluzione è ottimizzata per ridurre il consumo di token?",
    weight: "12%",
  },
  {
    title: "Qualità tecnica",
    desc: "Il codice è solido? Error handling, timeout, retry, configurazione sicura (secrets, env), model tiering.",
    weight: "12%",
  },
  {
    title: "Adeguatezza degli strumenti",
    desc: "Tools e agenti sono scelti correttamente per il task? Né troppo pochi né ridondanti tra loro.",
    weight: "11%",
  },
  {
    title: "Documentazione",
    desc: "Il repository è documentato? README chiaro, flusso agentico spiegato, setup, prerequisiti, tool/MCP/skill documentati.",
    weight: "7%",
  },
  {
    title: "Qualità dell'idea",
    desc: "Il problema è reale e rilevante? L'approccio agentico è adeguato al problema, non forzato. L'AI aggiunge valore concreto.",
    weight: "0%",
  },
];

export type Prize = {
  rank: number;
  label: string;
  amount: string;
  note: string;
};

export const PRIZES: Prize[] = [
  { rank: 1, label: "1° posto", amount: "500 €", note: "per coppia · punti perf." },
  { rank: 2, label: "2° posto", amount: "300 €", note: "per coppia · punti perf." },
  { rank: 3, label: "3° posto", amount: "200 €", note: "per coppia · punti perf." },
];

export const FINAL_MESSAGE = [
  "quale problema affronta",
  "perché è importante",
  "come usa l'agentic coding",
  "quale risultato produce",
  "come è stato verificato",
];
