/* Balance harness.  node tools/sim.js
 *
 * Loads the REAL index.html script with a stubbed DOM, then fast-forwards
 * strategies to see where the curve actually goes. This is not a unit test —
 * it's a telescope. An idle game's balance is invisible until you run it for
 * 30 simulated minutes.
 *
 * This harness earned its keep on day one: the first build looked completely
 * reasonable and was mathematically unwinnable (unbounded defect debt drove
 * production to zero while burn stayed flat — you went bankrupt from defects
 * and could never afford the Reviewer that fixes defects). No amount of
 * reading the code showed that. 30 seconds of simulation did.
 *
 * RUN THIS AFTER ANY BALANCE CHANGE. If both strategies don't survive and
 * disciplined doesn't clearly beat spam, the change is wrong.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.match(/<script>([\s\S]*?)<\/script>/)[1];

const makeEl = () => ({
  textContent: '', innerHTML: '', className: '', disabled: false,
  style: {}, onclick: null, classList: { toggle() {} }
});

function boot() {
  const els = {};
  const ctx = {
    document: { getElementById: id => (els[id] = els[id] || makeEl()) },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    performance: { now: () => 0 },
    setInterval: () => 0,
    window: { addEventListener() {} },
    confirm: () => false,
    Date, Math, JSON, isFinite, console
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(
    src + '\n;globalThis.__T = {state,step,doWork,doReview,buy,buyUp,costOf,upCostOf,' +
    'prodPerSec,burnPerSec,defectsPerSec,clearsPerSec,integrity,mods,unlocked,has,SEATS,UPGRADES,CFG};',
    ctx
  );
  return ctx.__T;
}

const seat = (T, id) => T.SEATS.find(s => s.id === id);
const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toFixed(1);

function run(label, secs, cps, policy, marks) {
  const T = boot();
  const rows = [];
  for (let t = 1; t <= secs; t++) {
    for (let i = 0; i < cps; i++) T.doWork();
    T.step(1, true);
    policy(T);
    if (marks.includes(t)) rows.push({
      t, tok: T.state.tokens, debt: T.state.debt, integ: T.integrity(),
      net: T.prodPerSec() - T.burnPerSec(),
      seats: T.SEATS.map(s => s.name + ':' + T.state.counts[s.id]).join(' ')
    });
  }
  console.log('\n=== ' + label + ' ===');
  for (const r of rows) console.log(
    '  t=' + String(r.t).padStart(4) + 's  tok ' + fmt(r.tok).padStart(8) +
    '  net ' + r.net.toFixed(1).padStart(7) + '/s  debt ' + String(Math.floor(r.debt)).padStart(5) +
    '  integrity ' + (r.integ * 100).toFixed(0).padStart(3) + '%   ' + r.seats
  );
  return rows[rows.length - 1];
}

const MARKS = [30, 60, 90, 120, 180, 240, 300, 480, 600, 900, 1200, 1800];

const spam = run('A — SPAM THE FREE TIER', 1800, 2, T => {
  const s = seat(T, 'hy3');
  while (T.state.tokens >= T.costOf(s)) T.buy(s);
}, MARKS);

const disc = run('B — DISCIPLINED (hy3 x5 -> flash -> glm -> opus)', 1800, 2, T => {
  const c = T.state.counts;
  const buyIf = (id, cap) => {
    const s = seat(T, id);
    if (c[id] < cap && T.state.tokens >= T.costOf(s)) { T.buy(s); return true; }
    return false;
  };
  if (buyIf('hy3', 5)) return;
  if (c.glm >= 3 && buyIf('opus', 2)) return;
  if (c.flash >= 8 && buyIf('glm', 99)) return;
  buyIf('flash', 25);
}, MARKS);

const T = boot();
console.log('\n=== COST CURVE (first 10) ===');
for (const s of T.SEATS) {
  const c = [];
  for (let i = 0; i < 10; i++) c.push(Math.floor(s.baseCost * Math.pow(s.growth, i)));
  console.log('  ' + s.name.padEnd(6) + c.map(fmt).join(' '));
}

console.log('\n=== DEFECT EQUILIBRIUM ===');
console.log('  debt plateaus at (defects/sec / ' + T.CFG.debtDecay + '). Leaky bucket.');
for (const s of T.SEATS) {
  if (!s.defects) continue;
  for (const n of [5, 10, 25]) {
    const p = (n * s.defects) / T.CFG.debtDecay;
    console.log('    ' + String(n).padStart(3) + ' x ' + s.name.padEnd(6) +
      '-> ~' + p.toFixed(0).padStart(4) + ' debt, ' +
      (100 / (1 + p / T.CFG.debtHalfPoint)).toFixed(0).padStart(3) + '% integrity');
  }
}

console.log('\n=== VERDICT ===');
const ok = [];
ok.push(['spam survives',        spam.net > 0]);
ok.push(['disciplined survives', disc.net > 0]);
ok.push(['discipline wins',      disc.net > spam.net * 2]);
ok.push(['spam is capped',       spam.integ < 0.5]);
for (const [k, v] of ok) console.log('  ' + (v ? 'PASS' : 'FAIL') + '  ' + k);
if (ok.some(x => !x[1])) { console.log('\n  BALANCE IS BROKEN.'); process.exit(1); }
console.log('\n  Curve is sound. discipline beats spam by ' +
            (disc.net / spam.net).toFixed(1) + 'x.');
