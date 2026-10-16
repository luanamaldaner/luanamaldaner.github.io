// Reaction roulette: spin three reels (substrate, reagent, conditions), call the mechanism,
// then the follow-up (which alkene, does it rearrange). Or spin an alkene reagent and pick the
// product. Streaks and a 60-second speed round keep it game-like. All answers come from the same
// decide() table and reaction list the rest of the Orgo tab uses.

import { addMistake } from './mistakes.js?v=1';

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPEED_SEC = 60;
// substrates where Zaitsev vs Hofmann gives two different alkenes
const TWO_ALKENES = new Set(['secBuBr', 'rearr', 'meCyhexBr']);
const TWINS = { hydration: 'oxymerc', oxymerc: 'hydration' };

function load(k, fb) { try { const v = localStorage.getItem(`orgo.rl.${k}`); return v === null ? fb : JSON.parse(v); } catch { return fb; } }
function store(k, v) { try { localStorage.setItem(`orgo.rl.${k}`, JSON.stringify(v)); } catch {} }
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const rs = {
  mode: 'sn', // 'sn' | 'alkene'
  spin: null, // the current round
  spinning: false,
  streak: 0, best: load('best', 0),
  speed: null, // { ends, right, total } during a speed round
  timer: null,
};

function snRound(D) {
  const sub = pick(D.SUBSTRATES), r = pick(D.REAGENTS);
  const solvent = r.type === 'weak' ? 'protic' : Math.random() < 0.65 ? 'aprotic' : 'protic';
  const heat = r.type === 'nuc' ? false : Math.random() < 0.5;
  const d = D.decide({ cls: sub.cls, reagent: r.id, solvent, heat, rearr: sub.rearr });
  const solv = r.type === 'weak' ? `${r.f} (solvent)` : solvent === 'aprotic' ? (r.id === 'LDA' ? 'THF' : 'DMSO') : (r.id === 'NaOMe' ? 'CH₃OH' : 'EtOH');
  const qs = [{ prompt: 'Which mechanism(s)?', answer: d.label, options: shuffle([d.label, ...shuffle(D.OUTCOME_LABELS.filter(x => x !== d.label)).slice(0, 3)]) }];
  const eMajor = d.out[0] === 'E2' || d.out.join('+') === 'SN1+E1';
  if (eMajor && TWO_ALKENES.has(sub.id)) {
    const hof = d.out[0] === 'E2' && r.type === 'bulky';
    qs.push({ prompt: 'Which alkene is the major one?', answer: hof ? 'Hofmann (less substituted)' : 'Zaitsev (more substituted)', options: ['Zaitsev (more substituted)', 'Hofmann (less substituted)'] });
  }
  if (sub.rearr && (d.out.includes('SN1') || d.out.includes('E1'))) {
    qs.push({ prompt: 'Can the intermediate rearrange?', answer: 'Yes: 1,2-hydride shift to a 3° cation', options: shuffle(['Yes: 1,2-hydride shift to a 3° cation', 'Yes: 1,2-methyl shift to a 1° cation', 'No: there’s no carbocation']) });
  }
  return { kind: 'sn', reels: [sub.name, r.f, `${solv}${heat ? ' · heat' : ''}`], sub, qs, i: 0, picked: [], explain: [...d.why, ...d.result], watch: d.out };
}

function alkeneRound(D) {
  const r = pick(D.REACTIONS);
  const pool = shuffle(D.REACTIONS.filter(x => x.id !== r.id && x.id !== TWINS[r.id])).slice(0, 3);
  const opts = shuffle([r, ...pool]);
  return {
    kind: 'alkene', reels: [r.start ? '1,2-dimethylcyclopentene' : '1-methylcyclopentene', r.reagents.join(' '), 'Pick the product'], start: r.start || D.SM, r,
    qs: [{ prompt: 'Which product forms?', answer: r.id, options: opts.map(x => x.id), draw: Object.fromEntries(opts.map(x => [x.id, x])) }],
    i: 0, picked: [],
    explain: [`${r.reagents.join(' ')} adds ${r.adds}${r.regio !== '—' ? `, ${r.regio}` : ''}${r.stereo !== '—' ? `, ${r.stereo.toLowerCase()}` : ''} (via ${r.via.toLowerCase()}).`, r.note],
    mech: r.mech,
  };
}

function spin(C, D) {
  if (rs.spinning) return;
  const round = rs.mode === 'sn' ? snRound(D) : alkeneRound(D);
  rs.spin = round;
  if (REDUCED || rs.speed) { C.render(); return; }
  rs.spinning = true;
  C.render();
  // flicker each reel through random values, stopping one after another
  const reels = [...document.querySelectorAll('.rl-reel-v')];
  const pools = rs.mode === 'sn'
    ? [D.SUBSTRATES.map(s => s.name), D.REAGENTS.map(r => r.f), ['DMSO', 'EtOH', 'THF', 'CH₃OH · heat', 'DMSO · heat', 'H₂O (solvent)']]
    : [['1-methylcyclopentene'], D.REACTIONS.map(r => r.reagents.join(' ')), ['Pick the product']];
  const t0 = performance.now();
  const stopAt = [650, 1000, 1350];
  const tick = () => {
    const t = performance.now() - t0;
    reels.forEach((el, k) => {
      if (t < stopAt[k]) { el.textContent = pick(pools[k]); el.parentElement.classList.add('rolling'); }
      else if (el.parentElement.classList.contains('rolling')) { el.textContent = round.reels[k]; el.parentElement.classList.remove('rolling'); el.parentElement.classList.add('landed'); }
    });
    if (t < stopAt[2] + 50) requestAnimationFrame(tick);
    else { rs.spinning = false; C.render(); }
  };
  requestAnimationFrame(tick);
}

function answer(C, D, o) {
  const R = rs.spin, q = R.qs[R.i];
  if (R.picked[R.i] !== undefined) return;
  R.picked[R.i] = o;
  const ok = o === q.answer;
  if (!ok) {
    const right = R.kind === 'alkene' ? q.draw[q.answer].name : q.answer;
    const front = R.kind === 'alkene' ? `${R.reels[0]} + ${R.reels[1]} → which product?` : `${R.sub.name} + ${R.reels[1]}, ${R.reels[2]}: ${q.prompt.toLowerCase()}`;
    addMistake(front, `${right}
${R.explain.slice(0, 2).join(' ')}`);
  }
  if (rs.speed) {
    rs.speed.total++; if (ok) rs.speed.right++;
    if (!ok || R.i + 1 >= R.qs.length) { setTimeout(() => { if (rs.speed) spin(C, D); }, ok ? 250 : 900); }
    else R.i++;
    C.render();
    return;
  }
  if (!ok) rs.streak = 0;
  else if (R.i + 1 >= R.qs.length) { rs.streak++; if (rs.streak > rs.best) { rs.best = rs.streak; store('best', rs.best); } }
  C.render();
}

function startSpeed(C, D) {
  rs.speed = { ends: Date.now() + SPEED_SEC * 1000, right: 0, total: 0 };
  spin(C, D);
  clearInterval(rs.timer);
  rs.timer = setInterval(() => {
    const el = document.querySelector('.rl-clock');
    if (!rs.speed) { clearInterval(rs.timer); return; }
    const left = Math.max(0, Math.ceil((rs.speed.ends - Date.now()) / 1000));
    if (el) el.textContent = `${left}s`;
    if (left <= 0) {
      clearInterval(rs.timer);
      const res = { right: rs.speed.right, total: rs.speed.total, at: Date.now(), mode: rs.mode };
      const key = `speedBest_${rs.mode}`;
      const prev = load(key, 0);
      if (res.right > prev) store(key, res.right);
      rs.lastSpeed = { ...res, record: res.right > prev };
      rs.speed = null; rs.spin = null;
      C.render();
    }
  }, 250);
}

export function roulettePage(C, D) {
  const { h, card } = C;
  const R = rs.spin;
  const modeChip = (id, label) => h('button', { type: 'button', class: `chip chip-btn${rs.mode === id ? ' on' : ''}`, disabled: !!rs.speed, onclick: () => { rs.mode = id; rs.spin = null; rs.streak = 0; C.render(); } }, label);
  const reel = (label, v) => h('div', { class: 'rl-reel' }, h('span', { class: 'rl-reel-l', text: label }), h('span', { class: 'rl-reel-v', text: v || '?' }));
  const labels = rs.mode === 'sn' ? ['Substrate', 'Reagent', 'Conditions'] : ['Alkene', 'Reagents', 'Your job'];

  const machine = h('section', { class: `card rl-machine${rs.spinning ? ' is-spinning' : ''}` },
    h('div', { class: 'rl-top' },
      h('div', { class: 'chips' }, modeChip('sn', 'SN1 / SN2 / E1 / E2'), modeChip('alkene', 'Alkene reactions')),
      rs.speed ? h('span', { class: 'rl-speed' }, '⚡ ', h('strong', { class: 'rl-clock', text: `${Math.max(0, Math.ceil((rs.speed.ends - Date.now()) / 1000))}s` }), ` · ${rs.speed.right} right`)
        : h('span', { class: 'rl-streak', text: `🔥 ${rs.streak} streak · best ${rs.best}` })),
    h('div', { class: 'rl-reels' }, labels.map((l, k) => reel(l, R ? R.reels[k] : null))),
    !R ? h('div', { class: 'rl-start' },
      h('button', { type: 'button', class: 'btn btn-primary rl-spin', onclick: () => spin(C, D) }, '🎰 Spin'),
      h('button', { type: 'button', class: 'btn', onclick: () => startSpeed(C, D) }, `⚡ ${SPEED_SEC}-second speed round`)) : null);

  let body = null;
  if (R && !rs.spinning) {
    const q = R.qs[R.i];
    const done = R.picked[R.i] !== undefined;
    const ok = done && R.picked[R.i] === q.answer;
    const finished = done && (!ok || R.i + 1 >= R.qs.length);
    const struct = R.kind === 'sn'
      ? h('div', { class: 'q-struct' }, D.skeletal(R.sub.spec, { scale: 30 }), h('div', { class: 'q-cond' }, h('span', { text: `${R.reels[1]}, ${R.reels[2]}` }), h('span', { class: 'arrow-line' })))
      : h('div', { class: 'q-struct' }, D.skeletal(R.start, { scale: 26 }), h('div', { class: 'q-cond' }, h('span', { text: R.reels[1] }), h('span', { class: 'arrow-line' })));
    const opts = R.kind === 'alkene'
      ? h('div', { class: 'rl-prods' }, q.options.map(id => {
        const x = q.draw[id];
        let cls = 'rl-prod';
        if (done && id === q.answer) cls += ' right'; else if (done && id === R.picked[R.i]) cls += ' wrong';
        return h('button', { type: 'button', class: cls, disabled: done, 'aria-label': done ? x.name : 'Product option', onclick: () => answer(C, D, id) },
          D.skeletal(x.product, { scale: x.wide ? 16 : 20 }), done ? h('span', { class: 'rl-prod-n', text: x.name }) : null);
      }))
      : h('div', { class: 'q-options' }, q.options.map(o => {
        let cls = 'q-opt';
        if (done && o === q.answer) cls += ' right'; else if (done && o === R.picked[R.i]) cls += ' wrong';
        return h('button', { type: 'button', class: cls, disabled: done, onclick: () => answer(C, D, o) }, o);
      }));
    const shown = R.qs.length > 1 ? h('p', { class: 'muted small', text: `Part ${R.i + 1} of ${R.qs.length}` }) : null;
    body = h('section', { class: 'card rl-q' }, shown, struct, h('p', { class: 'q-prompt', text: q.prompt }), opts,
      done && !rs.speed ? h('div', { class: `q-feedback ${ok ? 'ok' : 'no'}` },
        h('strong', { text: ok ? (finished ? (rs.streak > 2 ? `Yes ✿ ${rs.streak} in a row!` : 'Yes ✿') : 'Yes ✿ One more part…') : 'Not quite.' }),
        finished ? h('ul', { class: 'bullets' }, R.explain.map(t => h('li', { text: t }))) : null,
        h('div', { class: 'row' },
          finished
            ? h('button', { type: 'button', class: 'btn btn-primary', text: '🎰 Spin again', onclick: () => spin(C, D) })
            : h('button', { type: 'button', class: 'btn btn-primary', text: 'Next part →', onclick: () => { R.i++; C.render(); } }),
          finished && R.kind === 'sn' ? R.watch.filter(o => D.MECH_FOR[o]).map(o => h('button', { type: 'button', class: 'btn btn-small', onclick: () => D.selectMech(D.MECH_FOR[o]) }, `Watch ${o}`)) : null,
          finished && R.mech ? h('button', { type: 'button', class: 'btn btn-small', onclick: () => D.selectMech(R.mech) }, 'Watch it in 3D') : null)) : null);
  }

  const last = rs.lastSpeed;
  const side = h('div', { class: 'col col-narrow' },
    last ? card('Speed round', null,
      h('p', { class: 'bio-score', text: `${last.right} right` }),
      h('p', { class: 'muted small', text: `${last.total} answered in ${SPEED_SEC} s${last.record ? ' · new record ✿' : ''}` })) : null,
    card('Records', null, h('ul', { class: 'bullets small' },
      h('li', { text: `Best streak: ${rs.best}` }),
      h('li', { text: `Speed round, SN/E: ${load('speedBest_sn', 0)} right` }),
      h('li', { text: `Speed round, alkenes: ${load('speedBest_alkene', 0)} right` }))),
    card('How it works', null, h('ul', { class: 'bullets small' },
      h('li', { text: 'Spin, then call it. Some spins have a follow-up: which alkene wins, or whether the cation shifts.' }),
      h('li', { text: 'A wrong part ends the round and resets your streak; the explanation shows why.' }),
      h('li', { text: `Speed round: as many as you can in ${SPEED_SEC} seconds, no explanations.` }))));

  return h('div', { class: 'grid orgo-grid' }, h('div', { class: 'col' }, machine, body), side);
}
