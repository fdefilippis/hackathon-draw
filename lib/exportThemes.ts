import type { Theme } from "./brief";

/** Escape del testo per inserimento sicuro in HTML. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function list(items: string[], cls = ""): string {
  return `<ul class="bullets ${cls}">${items
    .map((i) => `<li>${esc(i)}</li>`)
    .join("")}</ul>`;
}

function themeSection(t: Theme): string {
  return `
  <article class="theme">
    <header class="theme-head">
      <span class="theme-num">Tema ${esc(t.number)}</span>
      <h2>${esc(t.title)}</h2>
    </header>

    <p class="objective">${esc(t.objective)}</p>
    <p class="focus">${esc(t.focus)}</p>

    <div class="challenge">
      <h3>La challenge</h3>
      <p>${esc(t.challenge)}</p>
    </div>

    <div class="cols">
      <div>
        <h4>Esempi di soluzioni possibili</h4>
        ${list(t.examples)}
      </div>
      <div>
        <h4>Vincoli specifici</h4>
        ${list(t.constraints)}
      </div>
    </div>

    <div>
      <h4>Deliverable specifici</h4>
      <div class="deliverables">
        ${t.deliverables
          .map(
            (d, i) => `
        <div class="deliverable">
          <span class="d-num">${String(i + 1).padStart(2, "0")}</span>
          <h5>${esc(d.title)}</h5>
          <p>${esc(d.desc)}</p>
        </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="avoid">
      <h4>Cosa evitare</h4>
      ${list(t.avoid, "avoid-list")}
    </div>
  </article>`;
}

/** Genera un documento HTML standalone (CSS inline, nessuna dipendenza) con i temi della sfida. */
export function buildThemesHtml(themes: Theme[]): string {
  const generated = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hagenthon · Temi della sfida</title>
<style>
  :root {
    --purple: #A100FF;
    --purple-light: #BE82FF;
    --purple-dark: #460073;
    --ink: #0A0014;
    --rose: #FF50A0;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #050008;
    color: #fff;
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 880px; margin: 0 auto; padding: 48px 24px 80px; }
  .brand {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; margin-bottom: 40px;
  }
  .brand .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
  .brand .logo .mark { color: var(--purple); }
  .brand .org { text-align: right; font-size: 10px; line-height: 1.4; }
  .brand .org .a { color: var(--purple-light); text-transform: uppercase; letter-spacing: 0.25em; font-weight: 600; }
  .brand .org .b { color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.2em; }
  .hero { text-align: center; margin-bottom: 56px; }
  .hero .eyebrow {
    display: inline-block; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.05); border-radius: 999px;
    padding: 6px 16px; font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.25em; color: rgba(255,255,255,0.7);
  }
  .hero h1 { font-size: 40px; font-weight: 700; letter-spacing: -0.02em; margin: 20px 0 12px; }
  .hero h1 .grad {
    background: linear-gradient(90deg, var(--purple-light), var(--purple));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .hero p { max-width: 620px; margin: 0 auto; color: rgba(255,255,255,0.65); }
  .theme {
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    background: rgba(255,255,255,0.02);
    padding: 32px;
    margin-bottom: 40px;
  }
  .theme-head { border-bottom: 1px solid rgba(161,0,255,0.25); padding-bottom: 16px; margin-bottom: 20px; }
  .theme-num { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; color: var(--purple-light); }
  .theme-head h2 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin: 6px 0 0; }
  .objective { font-size: 17px; color: rgba(255,255,255,0.85); }
  .focus { font-style: italic; color: rgba(255,255,255,0.5); font-size: 14px; }
  .challenge {
    border: 1px solid rgba(161,0,255,0.25);
    background: rgba(161,0,255,0.06);
    border-radius: 12px; padding: 18px 20px; margin: 22px 0;
  }
  h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--purple-light); margin: 0 0 8px; }
  h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); margin: 24px 0 12px; }
  .challenge p { margin: 0; color: rgba(255,255,255,0.85); }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  .bullets { list-style: none; padding: 0; margin: 0; }
  .bullets li { position: relative; padding-left: 20px; color: rgba(255,255,255,0.72); margin-bottom: 8px; }
  .bullets li::before { content: "›"; position: absolute; left: 0; color: var(--purple); font-weight: 700; }
  .avoid-list li::before { content: "×"; color: var(--rose); }
  .deliverables { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .deliverable { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px; }
  .d-num { font-size: 13px; font-weight: 700; color: var(--purple-light); }
  .deliverable h5 { font-size: 14px; font-weight: 600; margin: 6px 0 6px; }
  .deliverable p { font-size: 13px; color: rgba(255,255,255,0.55); margin: 0; }
  .avoid {
    border: 1px solid rgba(255,80,160,0.2);
    background: rgba(255,80,160,0.05);
    border-radius: 12px; padding: 18px 20px; margin-top: 24px;
  }
  .avoid h4 { color: rgba(255,80,160,0.8); margin-top: 0; }
  footer { text-align: center; margin-top: 40px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.25); }
  footer .mark { color: var(--purple); }
  @media (max-width: 640px) {
    .cols, .deliverables { grid-template-columns: 1fr; }
    .hero h1 { font-size: 30px; }
  }
  @media print {
    body { background: #fff; color: #111; }
    .theme { break-inside: avoid; border-color: #ddd; background: #fff; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="brand">
      <span class="logo">Hagenthon<span class="mark">&gt;</span></span>
      <span class="org">
        <span class="a">Accenture</span><br />
        <span class="b">Application Engineering</span>
      </span>
    </div>

    <div class="hero">
      <span class="eyebrow">Temi della sfida</span>
      <h1>Hackathon <span class="grad">Agentic Coding</span></h1>
      <p>Scegliete uno dei tre temi, definite un problema specifico, costruite un prototipo e preparate la demo finale.</p>
    </div>

    ${themes.map(themeSection).join("\n")}

    <footer>
      Hagenthon <span class="mark">&gt;</span> Accenture Application Engineering &middot; generato il ${esc(generated)}
    </footer>
  </div>
</body>
</html>`;
}
