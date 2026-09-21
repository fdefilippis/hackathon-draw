import { SLIDES } from "./training";

function renderSlideHtml(slide: (typeof SLIDES)[number]): string {
  const header =
    slide.layout !== "cover" && slide.layout !== "closing"
      ? `<div class="slide-header">
          <span class="kicker">${slide.kicker}</span>
          <h2>${slide.title}</h2>
          ${slide.subtitle ? `<p class="subtitle">${slide.subtitle}</p>` : ""}
        </div>`
      : "";

  let body = "";

  if (slide.layout === "cover") {
    body = `<div class="cover-center">
      <span class="cover-badge"><span class="dot"></span>${slide.kicker}</span>
      <h2 class="cover-title"><span class="text-gradient">Claude Code</span>, oltre le basi</h2>
      ${slide.subtitle ? `<p class="cover-subtitle">${slide.subtitle}</p>` : ""}
      ${slide.chips ? `<div class="chips">${slide.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>` : ""}
    </div>`;
  } else if (slide.layout === "closing") {
    body = `<div class="cover-center">
      <span class="kicker">${slide.kicker}</span>
      <h2 class="closing-title"><span class="text-gradient">${slide.title}</span></h2>
      ${slide.subtitle ? `<p class="cover-subtitle">${slide.subtitle}</p>` : ""}
      ${slide.chips ? `<div class="chips">${slide.chips.map((c) => `<span class="chip chip-purple">${c}</span>`).join("")}</div>` : ""}
    </div>`;
  } else if (slide.layout === "bullets" && slide.bullets) {
    body = `<ul class="bullets">${slide.bullets.map((b, i) => `<li><span class="bullet-num">${i + 1}</span><span>${b}</span></li>`).join("")}</ul>`;
  } else if (slide.layout === "cards" && slide.cards) {
    body = `<div class="cards-grid">${slide.cards.map((c) => `<div class="card"><h3>${c.title}</h3><p>${c.desc}</p></div>`).join("")}</div>`;
  } else if (slide.layout === "steps" && slide.steps) {
    body = `<div class="steps">${slide.steps.map((s, i) => `<div class="step"><span class="step-num">${String(i + 1).padStart(2, "0")}</span><div class="step-body"><h3>${s.title}</h3><p>${s.desc}</p></div></div>`).join("")}</div>`;
  } else if (slide.layout === "doDont") {
    body = `<div class="dodont-grid">
      <div class="dont-col">
        <h3>✕ Da evitare</h3>
        <ul>${(slide.dontItems ?? []).map((d) => `<li><span class="x-mark">×</span><span>${d}</span></li>`).join("")}</ul>
      </div>
      <div class="do-col">
        <h3>✓ Da fare</h3>
        <ul>${(slide.doItems ?? []).map((d) => `<li><span class="check-mark">›</span><span>${d}</span></li>`).join("")}</ul>
      </div>
    </div>`;
  } else if (slide.layout === "checklist" && slide.chips) {
    body = `<div class="checklist-grid">${slide.chips.map((c) => `<div class="checklist-item"><span class="check-badge">✓</span><span>${c}</span></div>`).join("")}</div>`;
  }

  const notes = slide.notes
    ? `<div class="notes-panel" id="notes-${slide.id}">
        <div class="notes-label">Note relatore</div>
        <p>${slide.notes}</p>
       </div>`
    : "";

  return `<div class="slide" id="slide-${slide.id}" data-index="${SLIDES.findIndex((s) => s.id === slide.id)}">
    <div class="slide-stage">
      <div class="slide-content">
        ${header}${body}
      </div>
    </div>
    ${notes}
  </div>`;
}

function buildHtml(): string {
  const slidesHtml = SLIDES.map((slide) => renderSlideHtml(slide)).join("\n");

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Claude Code, oltre le basi — Training Deck</title>
<style>
  :root {
    --ink: #0A0014;
    --purple: #A100FF;
    --purple-deep: #7500C0;
    --purple-dark: #460073;
    --purple-light: #BE82FF;
    --purple-soft: #DCAFFF;
    --magenta: #FF50A0;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: var(--ink); color: #fff; font-family: system-ui, -apple-system, sans-serif; }
  body { display: flex; flex-direction: column; min-height: 100vh; padding: 24px 20px; }

  /* Progress + toolbar */
  #toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  #progress-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
  #progress-fill { height: 100%; background: linear-gradient(90deg, var(--purple), var(--purple-light), var(--magenta)); transition: width 0.4s ease; border-radius: 99px; }
  #counter { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45); white-space: nowrap; }
  #counter span { color: #fff; }
  .toolbar-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: transparent; color: rgba(255,255,255,0.6); cursor: pointer; transition: border-color .2s, color .2s; font-size: 13px; }
  .toolbar-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
  .toolbar-btn.active { border-color: rgba(161,0,255,0.6); background: rgba(161,0,255,0.15); color: var(--purple-light); }

  /* Deck area */
  #deck { display: flex; gap: 16px; width: 100%; flex: 1; }
  .slide { display: none; width: 100%; }
  .slide.active { display: flex; flex-direction: column; }
  .slide-stage { flex: 1; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(10,0,20,0.5); overflow: hidden; }
  .slide-content { padding: 48px 56px; height: 100%; display: flex; flex-direction: column; justify-content: center; }

  /* Notes panel */
  .notes-panel { display: none; min-height: 140px; margin-top: 12px; border-radius: 16px; border: 1px solid rgba(161,0,255,0.25); background: rgba(161,0,255,0.06); padding: 20px 24px; }
  .notes-panel.visible { display: block; }
  .notes-label { font-size: 11px; font-weight: 700; letter-spacing: .25em; text-transform: uppercase; color: var(--purple-light); margin-bottom: 10px; }
  .notes-panel p { font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.8); }

  /* Slide header */
  .slide-header { margin-bottom: 28px; }
  .kicker { font-size: 11px; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: var(--purple-light); }
  .slide-header h2 { margin-top: 8px; font-size: clamp(28px, 4vw, 42px); font-weight: 700; line-height: 1.1; }
  .subtitle { margin-top: 10px; font-size: 16px; color: rgba(255,255,255,0.6); max-width: 700px; }

  /* Cover */
  .cover-center { text-align: center; }
  .cover-badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); border-radius: 99px; padding: 6px 16px; font-size: 11px; font-weight: 600; letter-spacing: .25em; text-transform: uppercase; color: rgba(255,255,255,0.7); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--purple); display: inline-block; }
  .cover-title { font-size: clamp(32px, 5vw, 56px); font-weight: 700; line-height: 1.02; margin: 24px auto 0; max-width: 800px; }
  .closing-title { font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.1; margin: 20px auto 0; max-width: 800px; }
  .cover-subtitle { font-size: 16px; color: rgba(255,255,255,0.65); max-width: 480px; margin: 16px auto 0; }
  .text-gradient { background: linear-gradient(135deg, var(--purple-light), var(--purple), var(--magenta)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 28px; }
  .chip { border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); border-radius: 99px; padding: 6px 16px; font-size: 13px; color: rgba(255,255,255,0.75); }
  .chip-purple { border-color: rgba(161,0,255,0.4); background: rgba(161,0,255,0.1); font-weight: 600; color: rgba(255,255,255,0.9); }

  /* Bullets */
  .bullets { list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .bullets li { display: flex; align-items: flex-start; gap: 16px; }
  .bullet-num { flex-shrink: 0; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(161,0,255,0.15); font-size: 13px; font-weight: 700; color: var(--purple-light); margin-top: 2px; }
  .bullets span:last-child { font-size: 17px; line-height: 1.6; color: rgba(255,255,255,0.85); }

  /* Cards */
  .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .card { border-radius: 12px; border: 1px solid rgba(161,0,255,0.2); background: rgba(10,0,20,0.7); padding: 20px; }
  .card h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
  .card p { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.65); }

  /* Steps */
  .steps { display: flex; flex-direction: column; gap: 18px; }
  .step { display: flex; align-items: flex-start; gap: 20px; }
  .step-num { font-size: 28px; font-weight: 700; color: rgba(161,0,255,0.55); font-variant-numeric: tabular-nums; line-height: 1; flex-shrink: 0; }
  .step-body { flex: 1; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 20px; }
  .step-body h3 { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
  .step-body p { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.65); }

  /* Do / Don't */
  .dodont-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .dont-col, .do-col { border-radius: 12px; padding: 20px; }
  .dont-col { border: 1px solid rgba(251,113,133,0.25); background: rgba(251,113,133,0.05); }
  .do-col { border: 1px solid rgba(52,211,153,0.25); background: rgba(52,211,153,0.05); }
  .dont-col h3 { font-size: 16px; font-weight: 600; color: #fecdd3; margin-bottom: 16px; }
  .do-col h3 { font-size: 16px; font-weight: 600; color: #d1fae5; margin-bottom: 16px; }
  .dodont-grid ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .dodont-grid li { display: flex; gap: 12px; color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.5; }
  .x-mark { color: #f87171; font-weight: 700; flex-shrink: 0; }
  .check-mark { color: #34d399; font-weight: 700; flex-shrink: 0; }

  /* Checklist */
  .checklist-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .checklist-item { display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); border-radius: 12px; padding: 12px 16px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.85); }
  .check-badge { flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(52,211,153,0.15); font-size: 12px; font-weight: 700; color: #6ee7b7; }

  /* Navigation */
  #nav { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 20px; }
  #dots { display: flex; align-items: center; gap: 6px; flex: 1; justify-content: center; flex-wrap: wrap; }
  .dot-btn { width: 6px; height: 6px; border-radius: 99px; border: none; background: rgba(255,255,255,0.2); cursor: pointer; transition: width .3s, background .3s; padding: 0; }
  .dot-btn.active { width: 24px; background: var(--purple); }
  .btn-prev { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.15); background: transparent; border-radius: 99px; padding: 10px 20px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7); cursor: pointer; transition: border-color .2s, color .2s; }
  .btn-prev:hover:not(:disabled) { border-color: rgba(255,255,255,0.3); color: #fff; }
  .btn-prev:disabled { opacity: .3; cursor: not-allowed; }
  .btn-next { display: inline-flex; align-items: center; gap: 8px; border: none; background: var(--purple); border-radius: 99px; padding: 10px 24px; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; transition: transform .2s; box-shadow: 0 0 40px -8px rgba(161,0,255,0.6); }
  .btn-next:hover:not(:disabled) { transform: scale(1.03); }
  .btn-next:disabled { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); box-shadow: none; cursor: not-allowed; }
  #hint { text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 14px; }
</style>
</head>
<body>
<div id="toolbar">
  <div id="progress-bar"><div id="progress-fill"></div></div>
  <div id="counter"><span id="cur">01</span> / <span id="tot">${String(SLIDES.length).padStart(2, "0")}</span></div>
  <button class="toolbar-btn" id="notes-toggle" title="Mostra/nascondi note relatore (N)" aria-label="Note relatore">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M4 10h16M4 15h10M4 20h7"/></svg>
  </button>
</div>

<div id="deck">
${slidesHtml}
</div>

<div id="nav">
  <button class="btn-prev" id="btn-prev" disabled>← Indietro</button>
  <div id="dots">${SLIDES.map((_s, i) => `<button class="dot-btn${i === 0 ? " active" : ""}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>
  <button class="btn-next" id="btn-next">Avanti →</button>
</div>
<p id="hint">Frecce ← → o barra spaziatrice · N per le note</p>

<script>
(function(){
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot-btn');
  const fill = document.getElementById('progress-fill');
  const cur = document.getElementById('cur');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const notesToggle = document.getElementById('notes-toggle');
  const total = slides.length;
  let idx = 0;
  let notesVisible = false;

  function show(n) {
    n = Math.max(0, Math.min(total - 1, n));
    slides[idx].classList.remove('active');
    dots[idx].classList.remove('active');
    idx = n;
    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
    fill.style.width = ((idx + 1) / total * 100) + '%';
    cur.textContent = String(idx + 1).padStart(2, '0');
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === total - 1;
    // sync notes visibility
    document.querySelectorAll('.notes-panel').forEach(function(p){ p.classList.remove('visible'); });
    if (notesVisible) {
      var panel = slides[idx].querySelector('.notes-panel');
      if (panel) panel.classList.add('visible');
    }
  }

  slides[0].classList.add('active');
  fill.style.width = (1 / total * 100) + '%';

  btnPrev.addEventListener('click', function(){ show(idx - 1); });
  btnNext.addEventListener('click', function(){ show(idx + 1); });
  dots.forEach(function(d){ d.addEventListener('click', function(){ show(parseInt(d.dataset.i)); }); });

  notesToggle.addEventListener('click', function(){
    notesVisible = !notesVisible;
    notesToggle.classList.toggle('active', notesVisible);
    var panel = slides[idx].querySelector('.notes-panel');
    if (panel) panel.classList.toggle('visible', notesVisible);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' '){ e.preventDefault(); show(idx + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); show(idx - 1); }
    else if (e.key === 'Home'){ e.preventDefault(); show(0); }
    else if (e.key === 'End'){ e.preventDefault(); show(total - 1); }
    else if (e.key === 'n' || e.key === 'N'){ e.preventDefault(); notesToggle.click(); }
  });
})();
</script>
</body>
</html>`;
}

export function downloadTrainingHtml(): void {
  const html = buildHtml();
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "training-claude-code.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
