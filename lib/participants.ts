export type Sede = "Milano" | "Roma" | "Remoto";

export type Participant = {
  name: string;
  sede: Sede;
  /** Licenza Claude Code attiva. */
  claudeCode: boolean;
};

/**
 * Anagrafica dei partecipanti alla formazione Claude Unipol: righe con
 * tipologia "Partecipante" (Executive e Project Lead) e "SI" su Partecipazione
 * nell'elenco partecipanti, con i nomi in formato Nome Cognome.
 * Sede (Milano, Roma o Remoto) e licenza Claude Code guidano la formazione
 * delle squadre; una licenza non indicata nell'elenco vale come assente.
 */
export const PARTICIPANTS: Participant[] = [
  { name: "Pierluigi Aconito", sede: "Milano", claudeCode: true },
  { name: "Caterina Beltrame", sede: "Milano", claudeCode: true },
  { name: "Gianmarco Borgese", sede: "Milano", claudeCode: true },
  { name: "Francesca Calafato", sede: "Milano", claudeCode: true },
  { name: "Rita Canu", sede: "Milano", claudeCode: false },
  { name: "Luigi Del Fuoco", sede: "Milano", claudeCode: true },
  { name: "Marco De Renzi", sede: "Roma", claudeCode: false },
  { name: "Alessandra De Simone", sede: "Milano", claudeCode: true },
  { name: "Raimondo Di Iorio", sede: "Milano", claudeCode: false },
  { name: "Antonio Esposito", sede: "Milano", claudeCode: true },
  { name: "Mariangela Fierro", sede: "Milano", claudeCode: true },
  { name: "Andrea Loris Gialain", sede: "Milano", claudeCode: true },
  { name: "Andrea Locane", sede: "Milano", claudeCode: true },
  { name: "Mauro Lunghi", sede: "Milano", claudeCode: true },
  { name: "Alessandro Magliola", sede: "Milano", claudeCode: true },
  { name: "Salvatore Mangano", sede: "Milano", claudeCode: true },
  { name: "Dario Marelli", sede: "Milano", claudeCode: true },
  { name: "Marco Marino", sede: "Milano", claudeCode: true },
  { name: "Palmita Mele", sede: "Milano", claudeCode: true },
  { name: "Francesco Meneghello", sede: "Milano", claudeCode: false },
  { name: "Mirko Milano", sede: "Milano", claudeCode: true },
  { name: "Antonella Pagano", sede: "Milano", claudeCode: true },
  { name: "Marco Palestra", sede: "Milano", claudeCode: true },
  { name: "Daniele Perri", sede: "Roma", claudeCode: true },
  { name: "Armando Pierri", sede: "Milano", claudeCode: true },
  { name: "Giuliano Puleo", sede: "Milano", claudeCode: true },
  { name: "Sara Rancati", sede: "Milano", claudeCode: true },
  { name: "Cinzia Rivara", sede: "Milano", claudeCode: false },
  { name: "Martina Sbaffi", sede: "Milano", claudeCode: true },
  { name: "Fabrizio Sebastiani", sede: "Roma", claudeCode: true },
  { name: "Iana Stamati", sede: "Milano", claudeCode: true },
  { name: "Asia Angelini", sede: "Milano", claudeCode: true },
  { name: "Matteo Artuso", sede: "Milano", claudeCode: true },
  { name: "Giacomo Bandini", sede: "Milano", claudeCode: true },
  { name: "Niccolò Boschetti", sede: "Milano", claudeCode: true },
  { name: "Enrico Catanea", sede: "Roma", claudeCode: true },
  { name: "Roberto Di Lorenzo", sede: "Roma", claudeCode: true },
  { name: "Giuseppe Maria Ingrà", sede: "Milano", claudeCode: true },
  { name: "Selene Liveri", sede: "Milano", claudeCode: true },
  { name: "Anna Maggioni", sede: "Milano", claudeCode: true },
  { name: "Giuseppe Mallano", sede: "Remoto", claudeCode: true },
  { name: "Angela Mastrandrea", sede: "Milano", claudeCode: true },
  { name: "Giorgia Pavin", sede: "Milano", claudeCode: true },
  { name: "Simone Rocchi", sede: "Roma", claudeCode: false },
  { name: "Ida Scardigno", sede: "Milano", claudeCode: false },
  { name: "Martina Valera", sede: "Milano", claudeCode: false },
];

/** Chiave di confronto: senza accenti, minuscola, spazi compattati. */
function nameKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const BY_NAME = new Map(PARTICIPANTS.map((p) => [nameKey(p.name), p]));

/** Cerca un partecipante in anagrafica; tollera maiuscole e accenti. */
export function findParticipant(name: string): Participant | undefined {
  return BY_NAME.get(nameKey(name));
}

/** Sede di una squadra: le squadre non mescolano sedi, basta il primo membro. */
export function teamSede(members: readonly string[]): Sede | undefined {
  return members.length > 0 ? findParticipant(members[0])?.sede : undefined;
}

export function hasClaudeCode(name: string): boolean {
  return findParticipant(name)?.claudeCode ?? false;
}
