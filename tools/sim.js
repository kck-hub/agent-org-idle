/* Balance + invariant harness. Run with: node tools/sim.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");

function boot() {
  const storage = new Map();
  const ctx = {
    document: { getElementById: () => null },
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    Date, Math, JSON, Number, Object, Array, Set, Map,
    console, globalThis: null
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(source, ctx);
  return ctx.__AGENT_ORG__;
}

const model = (T, id) => T.MODELS.find(item => item.id === id);
const fmt = number => number >= 1000 ? (number / 1000).toFixed(1) + "K" : number.toFixed(1);
const MARKS = [60, 300, 600, 1200, 1800, 3600, 7200];

function buyUntil(T, id, cap, mode) {
  const item = model(T, id);
  if (mode) T.state.buyModes[id] = mode;
  if (T.countOf(id) < cap && T.state.tokens >= T.costOf(item)) {
    T.buy(item);
    return true;
  }
  return false;
}

function simulate(label, seconds, clicksPerSecond, policy) {
  const T = boot();
  const rows = [];
  for (let second = 1; second <= seconds; second++) {
    for (let click = 0; click < clicksPerSecond; click++) T.doWork();
    T.step(1, true);
    policy(T);
    if (MARKS.includes(second)) rows.push({
      second,
      tokens: T.state.tokens,
      debt: T.state.debt,
      integrity: T.integrity(),
      net: T.prodPerSec() - T.burnPerSec(),
      roster: T.MODELS.map(item => `${item.name}:${T.countOf(item.id)}`).join(" ")
    });
  }

  console.log(`\n=== ${label} ===`);
  for (const row of rows) {
    console.log(
      `  t=${String(row.second).padStart(4)}s  tok ${fmt(row.tokens).padStart(8)}` +
      `  net ${row.net.toFixed(1).padStart(8)}/s  debt ${row.debt.toFixed(1).padStart(7)}` +
      `  integrity ${(row.integrity * 100).toFixed(0).padStart(3)}%   ${row.roster}`
    );
  }
  return { T, last: rows[rows.length - 1] };
}

const spam = simulate("A — FREE-TIER SPAM", 1800, 2, T => {
  const item = model(T, "qwen25-05b");
  T.state.buyModes["qwen25-05b"] = "quick";
  while (T.state.tokens >= T.costOf(item)) T.buy(item);
});

const disciplined = simulate("B — DISCIPLINED MIX", 1800, 2, T => {
  if (buyUntil(T, "qwen25-05b", 5, "standard")) return;
  if (buyUntil(T, "ds-coder-13b", 5, "standard")) return;
  if (buyUntil(T, "chatglm3-6b", 5, "standard")) return;
  if (buyUntil(T, "gpt3", 4, "standard")) return;
  if (buyUntil(T, "yi-6b-chat", 4, "standard")) return;
  if (buyUntil(T, "qwen25-7b", 4, "deep")) return;
  buyUntil(T, "mistral-7b", 3, "deep");
});

const scaled = simulate("C — SYSTEMS + SCALE", 7200, 2, T => {
  const order = [
    ["qwen25-05b", 5, "standard"], ["ds-coder-13b", 5, "standard"], ["chatglm3-6b", 5, "standard"], ["gpt3", 4, "standard"],
    ["yi-6b-chat", 4, "standard"], ["qwen25-7b", 5, "deep"], ["mistral-7b", 4, "deep"], ["glm4-9b", 3, "deep"],
    ["gpt35-turbo", 3, "deep"], ["llama31-8b", 3, "deep"], ["qwen25-coder-32b", 3, "deep"], ["deepseek-v3", 2, "deep"],
    ["llama31-70b", 2, "deep"], ["qwq-32b", 2, "deep"], ["deepseek-r1", 2, "deep"], ["kimi-k2", 2, "deep"],
    ["openai-o3", 1, "deep"], ["gemini35-flash", 1, "deep"], ["gpt56-sol", 1, "deep"], ["claude-opus-48", 1, "deep"]
  ];
  for (const args of order) if (buyUntil(T, ...args)) return;
  for (const upgrade of T.UPGRADES) {
    if (!T.state.owned[upgrade.id] && T.unlocked(upgrade) && T.state.tokens >= upgrade.cost) {
      T.buyUp(upgrade);
      return;
    }
  }
  buyUntil(T, "claude-opus-48", 20, "deep");
});

console.log("\n=== COST CURVES (first 8) ===");
{
  const T = boot();
  for (const item of T.MODELS) {
    const costs = Array.from({ length: 8 }, (_, index) => Math.floor(item.baseCost * Math.pow(item.growth, index)));
    console.log("  " + item.name.padEnd(10) + costs.map(fmt).join(" "));
  }
}

console.log("\n=== INVARIANTS ===");
const checks = [];
const check = (label, pass, detail = "") => checks.push([label, !!pass, detail]);

check("spam survives", spam.last.net > 0);
check("disciplined survives", disciplined.last.net > 0);
check("discipline beats spam", disciplined.last.net > spam.last.net * 2,
  `${(disciplined.last.net / spam.last.net).toFixed(1)}×`);
check("spam remains quality-capped", spam.last.integrity < 0.5);
check("scaled strategy reaches reasoning tier", scaled.T.MODELS.some(item => item.tier === 4 && scaled.T.countOf(item.id) >= 1));
check("scaled strategy reaches frontier tier", scaled.T.MODELS.some(item => item.tier === 5 && scaled.T.countOf(item.id) >= 1));
check("scaled strategy adopts systems", Object.keys(scaled.T.state.owned).length >= 3);

{
  const T = boot();
  const fountain = T.PYLONS.find(pylon => pylon.id === "fountain");

  // Placement now matters: an attuned representative buffs its whole family.
  T.setState({ tokens: 0, agents: [{ uid: "a1", modelId: "ds-coder-13b", mode: "standard", x: fountain.x, y: fountain.y }] });
  const attunedRate = T.prodPerSec();
  check("fountain placement attunes the family", T.attunedModelIds().has("ds-coder-13b"));
  T.state.agents[0].x = 0.9;
  T.state.agents[0].y = 0.15;
  const farRate = T.prodPerSec();
  check("attunement is worth +15% output", Math.abs(attunedRate / farRate - 1.15) < 1e-9,
    `${(attunedRate / farRate).toFixed(3)}×`);
  check("focus factor stays within its band", T.focusFactor() >= 1 && T.focusFactor() <= 1.6);

  // Habitat plots gate foundation units; their income ignores integrity.
  const plot = T.PLOTS[0];
  const unit = T.FOUNDRY[0];
  T.state.tokens = 10000;
  check("units cannot deploy to a dormant plot", T.buyUnit(unit, plot.id) === false);
  check("plot activation is a purchase", T.buyPlot(plot) === true && T.plotState(plot.id).active);
  check("foundation unit deploys after activation", T.buyUnit(unit, plot.id) === true && T.unitCount(unit.id) === 1);
  const foundationClean = T.foundationPerSec();
  T.state.debt = 100000;
  check("foundation income ignores integrity", Math.abs(T.foundationPerSec() - foundationClean) < 1e-9 && foundationClean > 0);
  T.state.debt = 0;
  const costBefore = T.unitCostOf(unit);
  T.buyUnit(unit, plot.id);
  check("foundation costs grow per copy", T.unitCostOf(unit) > costBefore);

  // Pylon bursts: charged taps pay out and reset; uncharged taps do nothing.
  T.state.pylons.north = 0.4;
  check("uncharged pylons cannot burst", T.activatePylon("north") === false);
  T.state.pylons.north = 1;
  const tokensBefore = T.state.tokens;
  T.state.debt = 50;
  check("charged pylon burst pays out and clears defects",
    T.activatePylon("north") === true && T.state.tokens > tokensBefore && T.state.debt < 50 && T.state.pylons.north === 0);
  const chargeBefore = T.state.pylons.north;
  T.step(10, true);
  check("pylons recharge over time", T.state.pylons.north > chargeBefore && T.state.pylons.north < 1);

  // Command Center levels are a real output lever.
  const baseProd = T.prodPerSec();
  T.state.tokens = 1e9;
  check("command center upgrade purchasable", T.buyCcLevel() === true && T.state.ccLevel === 1);
  check("command center level boosts output", T.prodPerSec() > baseProd);

  // Manual sprint: a ready burst ships several seconds of production.
  T.setBurstCharge(1);
  const clickGain = T.doWork();
  check("ready sprint outships a bare click", clickGain > T.CFG.clickBase * T.mods().prodMult && T.burstCharge === 0);

  // Pathfinding + terrain rules that back the god-hand mechanic.
  const nodeIds = Object.keys(T.PATH_NODES);
  const from = nodeIds.indexOf("cave_door");
  const to = nodeIds.indexOf("south_gate");
  const path = T.findPath(from, to);
  check("A* routes across the whole campus", Array.isArray(path) && path[0] === from && path[path.length - 1] === to && path.length > 4);
  check("walkway points are walkable terrain", T.isWalkablePoint(T.PATH_NODES.cc_entry));
  check("open meadow is not walkable terrain", !T.isWalkablePoint({ x: 0.9, y: 0.4 }));
  check("river crossings are detected", T.segmentCrossesWater({ x: 0.52, y: 0.30 }, { x: 0.66, y: 0.30 }) === true);
}

{
  const T = boot();
  const quick = T.agentStats({ modelId: "ds-coder-13b", mode: "quick", x: 0.5, y: 0.5 });
  const standard = T.agentStats({ modelId: "ds-coder-13b", mode: "standard", x: 0.5, y: 0.5 });
  const deep = T.agentStats({ modelId: "ds-coder-13b", mode: "deep", x: 0.5, y: 0.5 });
  check("reasoning remains an economic lever",
    quick.rate > standard.rate && quick.defects > standard.defects && deep.defects < standard.defects && deep.burn > standard.burn);

  const hyStandard = T.agentStats({ modelId: "qwen25-05b", mode: "standard", x: 0.5, y: 0.5 });
  const hyQuick = T.agentStats({ modelId: "qwen25-05b", mode: "quick", x: 0.5, y: 0.5 });
  check("legacy reasoning balance is preserved",
    Math.abs(hyStandard.rate - 0.324) < 1e-12 && Math.abs(hyQuick.rate - 0.4536) < 1e-12 && Math.abs(deep.burn - 2.0412) < 1e-12);

  const graph = T.CAMPUS_PATHS;
  const linksAreValid = graph.every((node, index) =>
    node.x >= T.MAP_BOUNDS.minX && node.x <= T.MAP_BOUNDS.maxX &&
    node.y >= T.MAP_BOUNDS.minY && node.y <= T.MAP_BOUNDS.maxY &&
    node.links.length > 0 && node.links.every(link =>
      Number.isInteger(link) && graph[link] && graph[link].links.includes(index)));
  const reached = new Set([0]);
  const queue = [0];
  while (queue.length) {
    for (const link of graph[queue.shift()].links) {
      if (!reached.has(link)) { reached.add(link); queue.push(link); }
    }
  }
  check("campus path network is valid and connected", linksAreValid && reached.size === graph.length,
    `${reached.size}/${graph.length} nodes reachable`);

  const edgeKeys = new Set(T.PATH_EDGES.map(([a, b]) => [a, b].sort().join("|")));
  const hasEdge = (a, b) => edgeKeys.has([a, b].sort().join("|"));
  const nearCoordinate = (value, target) => Math.abs(value - target) < 1e-9;
  const lowerBridgeIds = ["east_lane", "east_bridge_w", "east_bridge_mid", "east_bridge_e", "lower_field_w", "lower_field_s"];
  const archiveLaneIds = ["lower_field_cross", "lower_field_apron", "lower_field_gate", "archive_lane_s", "archive_door"];
  const fountainRing = {
    fountain_n: [0.460, 0.598], fountain_ne: [0.482, 0.612], fountain_e: [0.489, 0.642],
    fountain_se: [0.482, 0.672], fountain_s: [0.460, 0.686], fountain_sw: [0.438, 0.672],
    fountain_w: [0.431, 0.642], fountain_nw: [0.438, 0.612]
  };
  const scenicGuardrailsHold =
    lowerBridgeIds.every(id => nearCoordinate(T.PATH_NODES[id].y, 0.675)) &&
    archiveLaneIds.every(id => nearCoordinate(T.PATH_NODES[id].x, 0.695)) &&
    Object.entries(fountainRing).every(([id, [x, y]]) =>
      nearCoordinate(T.PATH_NODES[id].x, x) && nearCoordinate(T.PATH_NODES[id].y, y)) &&
    nearCoordinate(T.PATH_NODES.east_lower_turn.x, 0.540) &&
    nearCoordinate(T.PATH_NODES.upper_bridge_turn.y, 0.385) &&
    nearCoordinate(T.PATH_NODES.west_lane_canopy_e.y, 0.305) &&
    nearCoordinate(T.PATH_NODES.west_lane_canopy_w.y, 0.305) &&
    hasEdge("cc_apron_e", "east_lower_turn") &&
    hasEdge("east_lower_turn", "east_lane") &&
    hasEdge("upper_bridge_e", "upper_bridge_turn") &&
    hasEdge("west_lane_n", "west_lane_canopy_e") &&
    hasEdge("west_lane_canopy_e", "west_lane_canopy_w") &&
    hasEdge("west_lane_canopy_w", "west_junction") &&
    !hasEdge("fountain_e", "east_lane") &&
    !hasEdge("upper_bridge_e", "upper_bridge_mid") &&
    !hasEdge("west_lane_n", "west_junction");
  check("scenic path guardrails stay aligned to visible lanes", scenicGuardrailsHold);

  const projectionsStayOnEdges = [
    { x: 0.02, y: 0.02 }, { x: 0.5, y: 0.4 }, { x: 0.9, y: 0.8 }, { x: 0.26, y: 0.35 }
  ].every(point => {
    const snap = T.projectToWalkway(point);
    const again = T.projectToWalkway(snap);
    return Math.sqrt(again.d2) < 1e-6;
  });
  check("arbitrary placement projects onto a walkway edge", projectionsStayOnEdges);
}

{
  const one = boot();
  one.state.tokens = 100000;
  one.state.buyModes["ds-coder-13b"] = "deep";
  one.buy(model(one, "ds-coder-13b"));
  const snapshot = JSON.parse(JSON.stringify(one.state));

  const large = boot();
  large.setState(snapshot);
  large.step(10, true);

  const small = boot();
  small.setState(snapshot);
  for (let i = 0; i < 100; i++) small.step(0.1, true);

  const tokenDelta = Math.abs(large.state.tokens - small.state.tokens);
  const debtDelta = Math.abs(large.state.debt - small.state.debt);
  check("step size is stable", tokenDelta < 0.2 && debtDelta < 0.02,
    `Δtokens=${tokenDelta.toFixed(4)} Δdebt=${debtDelta.toFixed(4)}`);
}

{
  const T = boot();
  T.setState({ tokens: 42, debt: 7, lifetime: 99, counts: { hy3: 3, glm: 1 }, owned: { shrink: true } });
  check("v1 counts migrate to real-model instances", T.state.agents.length === 4 && T.countOf("qwen25-05b") === 3 && T.countOf("qwen25-7b") === 1);
  check("migration preserves economy", T.state.tokens === 42 && T.state.debt === 7 && T.state.lifetime === 99);
  check("migration preserves upgrades", T.state.owned.shrink === true);
  check("migrated positions stay inside map bounds", T.state.agents.every(agent =>
    agent.x >= T.MAP_BOUNDS.minX && agent.x <= T.MAP_BOUNDS.maxX &&
    agent.y >= T.MAP_BOUNDS.minY && agent.y <= T.MAP_BOUNDS.maxY));
  check("migrated positions snap to walkway edges", T.state.agents.every(agent =>
    Math.sqrt(T.projectToWalkway(agent).d2) < 1e-6));

  const representatives = T.representativeAgents();
  check("duplicate purchases collapse to one field representative per model",
    representatives.length === 2 && new Set(representatives.map(agent => agent.modelId)).size === 2);
  const changed = T.setModelFamilyMode("qwen25-05b", "deep");
  check("representative reasoning applies to the whole model family",
    changed === 3 && T.state.agents.filter(agent => agent.modelId === "qwen25-05b").every(agent => agent.mode === "deep"));
}

{
  const T = boot();
  T.state.tokens = 1e12;
  const tierTwo = T.MODELS.find(item => item.tier === 2);
  check("future tiers cannot be bought early", T.buy(tierTwo) === false && T.countOf(tierTwo.id) === 0);
  T.state.lifetime = T.TIERS.find(tier => tier.id === 2).unlockLifetime;
  check("lifetime milestone unlocks the next tier", T.buy(tierTwo) === true && T.countOf(tierTwo.id) === 1);

  T.setState({ agents: [{ uid: "a1", modelId: "opus", mode: "deep", x: 0.9, y: 0.1 }] });
  check("v2 fictional reviewer migrates to QwQ", T.countOf("qwq-32b") === 1);
  check("legacy instance coordinates are collision-snapped", Math.sqrt(T.projectToWalkway(T.state.agents[0]).d2) < 1e-6);

  // v3 saves (no plots/pylons/ccLevel) hydrate to sane v4 defaults.
  T.setState({ version: 3, tokens: 500, agents: [{ uid: "a1", modelId: "qwen25-05b", mode: "standard", x: 0.46, y: 0.6 }] });
  const plotsOk = T.PLOTS.every(plot => T.plotState(plot.id) && T.plotState(plot.id).active === false);
  const pylonsOk = T.PYLONS.every(pylon => T.state.pylons[pylon.id] >= 0 && T.state.pylons[pylon.id] <= 1);
  check("v3 save migrates to v4 defaults", plotsOk && pylonsOk && T.state.ccLevel === 0 && T.state.tokens === 500 && T.countOf("qwen25-05b") === 1);
}

for (const [label, pass, detail] of checks) {
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
}

if (checks.some(([, pass]) => !pass)) {
  console.error("\nBALANCE OR ENGINE INVARIANTS FAILED.");
  process.exit(1);
}

console.log("\nCurve is sound: free-tier spam plateaus, disciplined depth compounds, and reviewers remain necessary.");
