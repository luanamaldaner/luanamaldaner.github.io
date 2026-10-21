// Orgo guided lectures (Ch 7, Ch 8): the same step-by-step format as the Bio tab.
// Steps can show an alkene-reaction card (rx), run the SN/E decider (decide) and open the 3D viewer (mech).

import CH7 from './walk-ch7.js?v=2';
import CH8 from './walk-ch8.js?v=2';

const CHAPTERS = [CH7, CH8];
const load = (k, fb) => { try { const v = localStorage.getItem(`orgo.g.${k}`); return v === null ? fb : JSON.parse(v); } catch { return fb; } };
const put = (k, v) => { try { localStorage.setItem(`orgo.g.${k}`, JSON.stringify(v)); } catch {} };
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const gs = { ch: load('ch', 7), pos: load('pos', { 7: 0, 8: 0 }), picked: null, opts: null, optsFor: '', reveal: new Set() };

const SOLV = { protic: 'polar protic solvent', aprotic: 'polar aprotic solvent' };
const CLS = { methyl: 'methyl', 1: '1°', 2: '2°', 3: '3°' };

// Pictures and worked examples for a step (step.figs), drawn with draw.js's skeletal():
//   { kind: 'scheme', rows: [[item, …], …], caption }   item = { mol: spec, label } | { arrow: { top, bottom } } | { plus: true } | { text, sub }
//   { kind: 'gallery', items: [{ mol, label, note }], caption }   side-by-side structures (e.g. 1°/2°/3°)
//   { kind: 'example', title, q, rows?, hint?, steps: [...], answer, answerRows? }   a try-it problem with a reveal
//   { kind: 'table', head: [...], rows: [[...]], caption }
function schemeRow(C, D, row) {
  const { h } = C;
  return h('div', { class: 'og-scheme-row' }, row.map(it => {
    if (it.mol) return h('figure', { class: 'og-mol' }, D.skeletal(it.mol, { scale: it.scale || 34 }), it.label ? h('figcaption', { text: it.label }) : null);
    if (it.arrow) return h('div', { class: 'og-arrow' }, h('span', { class: 'og-arrow-top', text: it.arrow.top || '' }), h('span', { class: 'arrow-line' }), h('span', { class: 'og-arrow-bot', text: it.arrow.bottom || '' }));
    if (it.plus) return h('span', { class: 'og-plus', text: '+' });
    if (it.text) return h('figure', { class: 'og-mol og-textmol' }, h('span', { class: 'og-formula', text: it.text }), it.sub ? h('figcaption', { text: it.sub }) : null);
    return null;
  }));
}

function figure(C, D, f, key) {
  const { h } = C;
  if (f.kind === 'scheme') {
    return h('div', { class: 'og-fig og-scheme' }, f.title ? h('p', { class: 'og-fig-title', text: f.title }) : null,
      (f.rows || []).map(r => schemeRow(C, D, r)), f.caption ? h('p', { class: 'og-fig-cap', text: f.caption }) : null);
  }
  if (f.kind === 'gallery') {
    return h('div', { class: 'og-fig og-gallery' }, f.title ? h('p', { class: 'og-fig-title', text: f.title }) : null,
      h('div', { class: 'og-gallery-row' }, f.items.map(it => h('figure', { class: 'og-mol' }, D.skeletal(it.mol, { scale: it.scale || 30 }),
        h('figcaption', null, h('strong', { text: it.label || '' }), it.note ? h('span', { text: it.note }) : null)))),
      f.caption ? h('p', { class: 'og-fig-cap', text: f.caption }) : null);
  }
  if (f.kind === 'table') {
    return h('div', { class: 'og-fig og-table-wrap' }, f.title ? h('p', { class: 'og-fig-title', text: f.title }) : null,
      h('table', { class: 'og-table' }, h('thead', null, h('tr', null, f.head.map(x => h('th', { text: x })))),
        h('tbody', null, f.rows.map(r => h('tr', null, r.map(x => h('td', { text: x })))))),
      f.caption ? h('p', { class: 'og-fig-cap', text: f.caption }) : null);
  }
  if (f.kind === 'example') {
    const open = gs.reveal.has(key);
    return h('div', { class: 'og-fig og-example' },
      h('p', { class: 'og-ex-kicker', text: f.title || 'Worked example' }),
      f.q ? h('p', { class: 'og-ex-q', text: f.q }) : null,
      (f.rows || []).map(r => schemeRow(C, D, r)),
      f.hint && !open ? h('p', { class: 'og-ex-hint small muted', text: `Hint: ${f.hint}` }) : null,
      open ? h('div', { class: 'og-ex-sol' },
        f.steps && f.steps.length ? h('ol', { class: 'og-ex-steps' }, f.steps.map(t => h('li', { text: t }))) : null,
        (f.answerRows || []).map(r => schemeRow(C, D, r)),
        f.answer ? h('p', { class: 'og-ex-ans' }, h('strong', { text: 'Answer: ' }), f.answer) : null)
        : h('button', { type: 'button', class: 'btn btn-small', text: 'Try it, then show the solution', onclick: () => { gs.reveal.add(key); C.render(); } }));
  }
  return null;
}

export function guidedPage(C, D) {
  const { h } = C;
  const chap = CHAPTERS.find(c => c.ch === gs.ch) || CHAPTERS[0];
  const steps = chap.steps;
  let i = Math.min(gs.pos[chap.ch] || 0, steps.length - 1);
  const step = steps[i];
  const go = k => { gs.pos[chap.ch] = Math.max(0, Math.min(steps.length - 1, k)); put('pos', gs.pos); gs.picked = null; C.render(); document.querySelector('.og-walk')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  // reaction card
  let rx = null;
  if (step.rx) {
    const r = D.REACTIONS.find(x => x.id === step.rx);
    if (r) rx = h('div', { class: 'og-rx' },
      h('div', { class: 'og-rx-row' },
        D.skeletal(r.start || D.SM, { scale: 24 }),
        h('div', { class: 'q-cond' }, h('span', { text: r.reagents.join(' ') }), h('span', { class: 'arrow-line' })),
        D.skeletal(r.product, { scale: r.wide ? 20 : 24 })),
      h('p', { class: 'small og-rx-tags' }, h('strong', { text: r.name }), ` · adds ${r.adds}${r.regio !== '—' ? ` · ${r.regio}` : ''}${r.stereo !== '—' ? ` · ${r.stereo}` : ''} · via ${r.via}`));
  }
  // decider box
  let dec = null;
  if (step.decide) {
    const x = step.decide;
    const res = D.decide({ cls: x.cls, reagent: x.reagent, solvent: x.solvent, heat: x.heat, rearr: x.rearr });
    dec = h('div', { class: 'og-dec' },
      h('p', { class: 'small og-dec-in' }, `${CLS[x.cls] || x.cls} substrate + ${res.reagent.f} in a ${SOLV[x.solvent] || x.solvent}${x.heat ? ', heat' : ''}`),
      h('details', null, h('summary', null, 'Reveal what the decider says'),
        h('p', { class: 'og-dec-out' }, h('strong', { text: res.label })),
        h('ul', { class: 'bullets small' }, [...res.why, ...res.result].map(t => h('li', { text: t })))));
  }
  // quick check
  let check = null;
  const ck = step.check;
  if (ck) {
    const key = `${chap.ch}:${i}`;
    if (gs.optsFor !== key) { gs.opts = shuffle([ck.a, ...ck.o]); gs.optsFor = key; gs.picked = null; }
    const answered = gs.picked !== null;
    check = h('div', { class: 'bio-walk-check' },
      h('p', { class: 'bio-walk-q', text: `Quick check: ${ck.q}` }),
      h('div', { class: 'q-options' }, gs.opts.map(o => {
        let cls = 'q-opt';
        if (answered && o === ck.a) cls += ' right'; else if (answered && o === gs.picked) cls += ' wrong';
        return h('button', { type: 'button', class: cls, disabled: answered, onclick: () => { gs.picked = o; if (o === ck.a && D.addCorrect) D.addCorrect(); C.render(); } }, o);
      })),
      answered ? h('p', { class: `bio-walk-why ${gs.picked === ck.a ? 'ok' : 'no'}`, text: `${gs.picked === ck.a ? 'Yes ✿ ' : `It's “${ck.a}”. `}${ck.why}` }) : null);
  }

  const chips = h('div', { class: 'chips og-chaps' }, CHAPTERS.map(c => h('button', {
    type: 'button', class: `chip chip-btn${c.ch === chap.ch ? ' on' : ''}`,
    onclick: () => { gs.ch = c.ch; put('ch', c.ch); gs.picked = null; C.render(); },
  }, `Ch ${c.ch} · ${c.title}`)));

  return h('div', { class: 'grid orgo-grid' },
    h('div', { class: 'col' },
      chips,
      h('section', { class: 'card bio-walk og-walk', style: '--lc: #c0661e' },
        h('div', { class: 'bio-walk-top' }, h('p', { class: 'bio-kicker', text: `Chapter ${chap.ch} · section ${step.sec} · step ${i + 1} of ${steps.length}` })),
        h('div', { class: 'bio-walk-bar' }, h('span', { style: `width:${(100 * (i + 1) / steps.length).toFixed(1)}%` })),
        h('h2', { class: 'bio-walk-title', text: step.title }),
        h('div', { class: 'bio-walk-say' }, (step.say || []).map(t => h('p', { text: t }))),
        (step.figs || []).map((f, k) => figure(C, D, f, `${chap.ch}:${i}:${k}`)),
        rx, dec,
        step.mech ? h('button', { type: 'button', class: 'btn btn-small og-mech', onclick: () => D.selectMech(step.mech) }, '▶ Watch it in 3D') : null,
        step.takeaway ? h('p', { class: 'bio-walk-take' }, h('strong', { text: 'Takeaway: ' }), step.takeaway) : null,
        check,
        h('div', { class: 'bio-walk-nav' },
          h('button', { type: 'button', class: 'btn', text: '← Back', disabled: i === 0, onclick: () => go(i - 1) }),
          h('div', { class: 'bio-walk-dots' }, steps.map((s, k) => h('button', { type: 'button', class: `bio-walk-dot${k === i ? ' on' : k < i ? ' past' : ''}`, title: `${s.sec} ${s.title}`, 'aria-label': `Step ${k + 1}: ${s.title}`, onclick: () => go(k) }))),
          i + 1 < steps.length ? h('button', { type: 'button', class: 'btn btn-primary', text: 'Next →', onclick: () => go(i + 1) })
            : h('button', { type: 'button', class: 'btn btn-primary', text: chap.ch === 7 ? 'On to Ch 8 →' : 'Start over', onclick: () => { if (chap.ch === 7) { gs.ch = 8; put('ch', 8); gs.picked = null; C.render(); } else go(0); } })))),
    h('div', { class: 'col col-narrow' }, C.card('Steps', h('span', { class: 'card-meta', text: `Ch ${chap.ch}` }),
      h('ol', { class: 'og-toc' }, steps.map((s, k) => h('li', null, h('button', { type: 'button', class: `link small${k === i ? ' on' : ''}`, onclick: () => go(k) }, `${s.sec} ${s.title}`)))))));
}
