<div align="center">

# Hagenthon&nbsp;<span>&gt;</span>

### Cerimonia di estrazione delle squadre

**Accenture Application Engineering**

Web app per estrarre **live** le coppie dell'hackathon *Hagenthon*.
Niente lista istantanea: un reveal progressivo, scenografico e pieno di suspense,
pensato per essere **proiettato su schermo** davanti ai partecipanti.

</div>

---

## ✨ Cosa fa

40 partecipanti, 20 squadre da 2 persone, un'unica estrazione spettacolare. L'app trasforma il sorteggio in una cerimonia da evento tech: nomi che si mischiano, tensione che cresce, coppie rivelate una alla volta con confetti e musica per gli occhi.

- **Estrazione equa e casuale** — algoritmo Fisher–Yates, ogni persona compare una sola volta.
- **Reveal progressivo** — le coppie sono calcolate subito ma svelate una per una; l'animazione è puramente scenica.
- **Privacy by design** — tutto gira *client-side*: i nomi dei partecipanti non lasciano mai il browser.
- **Pronta per la proiezione** — palette ad alto contrasto, tipografia forte, layout centrato e vignette per lo schermo grande.

## 🎬 Il flusso

| # | Schermata | Cosa succede |
|---|-----------|--------------|
| 1 | **Intro** | Branding *Hagenthon* + Accenture Application Engineering, titolo con gradiente animato. |
| 2 | **Input** | Si incolla la lista dei partecipanti, un nome per riga. Pulsante *Carica esempio (40)* per le prove. |
| 3 | **Validazione** | Conteggio live, numero pari obbligatorio, controllo duplicati, avviso se diverso dai 40 previsti. |
| 4 | **Estrazione** | *"Estrazione in corso…"* → nomi che si mischiano → *"La prossima coppia è…"* → reveal di una coppia alla volta con confetti e pausa tra una squadra e l'altra. Pulsante **Salta »** sempre disponibile. |
| 5 | **Risultati** | Tutte le squadre in griglia, leggibili e presentabili: *"Team completati. Che la sfida abbia inizio."* |
| 6 | **Rigenera / Ricomincia** | Nuova estrazione con gli stessi nomi, oppure ripartenza da zero. |

## 🧭 Sezioni dell'app

Oltre alla cerimonia di estrazione (home `/`), l'app include due sezioni di supporto all'evento, raggiungibili dalla schermata iniziale e via URL diretto (utile per i partecipanti sui propri dispositivi):

| Route | Sezione | Contenuto |
|-------|---------|-----------|
| `/` | **Estrazione** | La cerimonia di sorteggio delle coppie. |
| `/brief` | **Brief & Regolamento** | Brief completo dell'Hackathon Agentic Coding: obiettivi, regole, deliverable, i 3 temi (navigabili a tab) e criteri di valutazione. |
| `/training` | **Training Claude Code** | Slide deck interattivo di livello intermedio sull'uso corretto di Claude Code (navigazione da tastiera con le frecce). |

## 🚀 Avvio rapido

Requisiti: **Node.js 18.18+** (testato su Node 25).

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia in sviluppo
npm run dev
```

Apri **[http://localhost:3000](http://localhost:3000)**.

> Se la porta 3000 è occupata, Next sceglie automaticamente la successiva (es. 3001), oppure puoi forzarla: `npm run dev -- -p 3002`.

### Build di produzione

```bash
npm run build
npm start
```

## 🛠️ Stack tecnico

| Tecnologia | Ruolo |
|------------|-------|
| **Next.js 16** (App Router) | Framework e build |
| **React 19** + **TypeScript** | UI e type-safety |
| **Tailwind CSS** | Styling on-brand (nero / bianco / viola Accenture) |
| **Framer Motion** | Animazioni e transizioni tra le schermate |
| **canvas-confetti** | Effetto celebrativo sul reveal |

## 🎨 Personalizzazione

| Cosa | Dove |
|------|------|
| Ritmo della cerimonia (`SHUFFLE_MS`, `REVEAL_MS`, `INTRO_MS`) | `components/DrawingScreen.tsx` |
| Numero di partecipanti previsto e dimensione squadra | `lib/pairing.ts` (`TARGET_PARTICIPANTS`, `TEAM_SIZE`) |
| Palette colori e tipografia | `tailwind.config.ts`, `app/globals.css` |
| Lista di esempio (40 nomi) | `components/InputScreen.tsx` |

## 📁 Struttura del progetto

```
hackathon-draw/
├─ app/
│  ├─ layout.tsx          # Layout, font, metadata
│  ├─ page.tsx            # State machine: intro → input → drawing → results
│  └─ globals.css         # Stili e tema Accenture
├─ components/
│  ├─ Background.tsx      # Sfondo animato (canvas + griglia tech)
│  ├─ BrandHeader.tsx     # Wordmark Hagenthon + firma Accenture
│  ├─ IntroScreen.tsx     # Schermata di benvenuto
│  ├─ InputScreen.tsx     # Inserimento e validazione partecipanti
│  ├─ DrawingScreen.tsx   # La cerimonia di estrazione con suspense
│  └─ ResultsScreen.tsx   # Griglia finale delle squadre
└─ lib/
   └─ pairing.ts          # Parsing, validazione, shuffle e pairing
```

---

<div align="center">

**Hagenthon&nbsp;&gt;** · Accenture Application Engineering

</div>
