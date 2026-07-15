"use strict";

/* --------------------------------------------------------------------------
   DATA — models, reasoning, campus paths, and conventions are all data.
   -------------------------------------------------------------------------- */

const TIERS = [
  { id: 1, name: "Roots", subtitle: "Small weights and the API pioneers", unlockLifetime: 0 },
  { id: 2, name: "Open Lab", subtitle: "Local runners become a real bench", unlockLifetime: 10000 },
  { id: 3, name: "Production", subtitle: "Workhorse models for serious throughput", unlockLifetime: 250000 },
  { id: 4, name: "Reasoning", subtitle: "Reviewers, planners, and agentic coordinators", unlockLifetime: 8000000 },
  { id: 5, name: "Frontier", subtitle: "Hosted leads for the late-game org", unlockLifetime: 200000000 }
];

// Model names, providers, eras, and availability labels mirror their official
// releases. Rates and costs are deliberately fictional game balance values.
const MODELS = [
  { id: "qwen25-05b", name: "Qwen2.5-0.5B-Instruct", shortName: "Qwen 0.5B", provider: "Qwen", tier: 1, era: "2024", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "hy3", color: "#8b6dff", baseCost: 15, growth: 1.15, rate: 0.3, burn: 0, defects: 0.15, clears: 0, role: "Tiny inbox scout", flavor: "Cheap, literal, and always first to volunteer.", labels: ["Snap", "Chain", "Verify"], source: "https://qwenlm.github.io/blog/qwen2.5/" },
  { id: "ds-coder-13b", name: "DeepSeek-Coder-1.3B-Instruct", shortName: "DS Coder 1.3B", provider: "DeepSeek", tier: 1, era: "2023", availability: "OPEN WEIGHTS · MODEL LICENSE", sprite: "flash", color: "#3d73ff", baseCost: 90, growth: 1.15, rate: 3, burn: 1.4, defects: 0.05, clears: 0, role: "Junior code runner", flavor: "Small enough to sprint; clever enough to worry you.", labels: ["Patch", "Trace", "Prove"], source: "https://github.com/deepseek-ai/DeepSeek-Coder" },
  { id: "chatglm3-6b", name: "ChatGLM3-6B", shortName: "ChatGLM3", provider: "Zhipu AI", tier: 1, era: "2023", availability: "OPEN WEIGHTS · CUSTOM LICENSE", sprite: "nano", color: "#34c8c8", baseCost: 320, growth: 1.16, rate: 8, burn: 3.7, defects: 0.028, clears: 0, role: "Bilingual tool caller", flavor: "Carries tools, translations, and too many tabs.", labels: ["Call", "Plan", "Reflect"], source: "https://github.com/zai-org/ChatGLM3" },
  { id: "gpt3", name: "GPT-3", shortName: "GPT-3", provider: "OpenAI", tier: 1, era: "2020", availability: "HOSTED · ARCHIVE", sprite: "glm", color: "#10a37f", baseCost: 1100, growth: 1.15, rate: 25, burn: 11, defects: 0.014, clears: 0, role: "API-era copy desk", flavor: "The old API pioneer still knows how to fill a queue.", labels: ["Draft", "Direct", "Deliberate"], source: "https://openai.com/index/gpt-3-apps/" },

  { id: "yi-6b-chat", name: "Yi-6B-Chat", shortName: "Yi 6B", provider: "01.AI", tier: 2, era: "2023", availability: "OPEN WEIGHTS · CUSTOM LICENSE", sprite: "sonnet", color: "#ff9a45", baseCost: 3200, growth: 1.16, rate: 65, burn: 28, defects: 0.009, clears: 0, role: "Bilingual writer", flavor: "A compact storyteller with a practical streak.", labels: ["Draft", "Shape", "Polish"], source: "https://github.com/01-ai/Yi" },
  { id: "qwen25-7b", name: "Qwen2.5-7B-Instruct", shortName: "Qwen 7B", provider: "Qwen", tier: 2, era: "2024", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "hy3", color: "#7b5bde", baseCost: 8500, growth: 1.16, rate: 170, burn: 76, defects: 0.006, clears: 0, role: "Balanced generalist", flavor: "The dependable local bench starts here.", labels: ["Answer", "Chain", "Inspect"], source: "https://qwenlm.github.io/blog/qwen2.5/" },
  { id: "mistral-7b", name: "Mistral 7B Instruct", shortName: "Mistral 7B", provider: "Mistral AI", tier: 2, era: "2023", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "flash", color: "#ff9f43", baseCost: 22000, growth: 1.16, rate: 430, burn: 188, defects: 0.0045, clears: 0, role: "Low-burn runner", flavor: "Fast local work without hauling the whole lab.", labels: ["Sprint", "Route", "Reason"], source: "https://mistral.ai/news/announcing-mistral-7b/" },
  { id: "glm4-9b", name: "GLM-4-9B-Chat", shortName: "GLM-4 9B", provider: "Zhipu AI", tier: 2, era: "2024", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "nano", color: "#22b8b0", baseCost: 60000, growth: 1.17, rate: 1100, burn: 490, defects: 0.003, clears: 0.02, role: "Long-context clerk", flavor: "Keeps the handoff legible in two languages.", labels: ["Execute", "Reflect", "Prove"], source: "https://github.com/zai-org/GLM-4" },

  { id: "gpt35-turbo", name: "GPT-3.5 Turbo", shortName: "GPT-3.5", provider: "OpenAI", tier: 3, era: "2023", availability: "HOSTED · ARCHIVE", sprite: "glm", color: "#20b486", baseCost: 160000, growth: 1.17, rate: 3000, burn: 1360, defects: 0.002, clears: 0, role: "API workhorse", flavor: "Function calls, batch jobs, and an alarming coffee habit.", labels: ["Call", "Compose", "Check"], source: "https://openai.com/index/function-calling-and-other-api-updates/" },
  { id: "llama31-8b", name: "Llama 3.1 8B Instruct", shortName: "Llama 3.1 8B", provider: "Meta", tier: 3, era: "2024", availability: "OPEN WEIGHTS · COMMUNITY LICENSE", sprite: "opus", color: "#168aff", baseCost: 450000, growth: 1.17, rate: 8000, burn: 3600, defects: 0.0012, clears: 0.04, role: "Private ops generalist", flavor: "Runs inside the walls and minds its own context.", labels: ["Draft", "Plan", "Audit"], source: "https://ai.meta.com/blog/meta-llama-3-1/" },
  { id: "qwen25-coder-32b", name: "Qwen2.5-Coder-32B-Instruct", shortName: "Qwen Coder 32B", provider: "Qwen", tier: 3, era: "2024", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "sonnet", color: "#9c6cff", baseCost: 1200000, growth: 1.18, rate: 24000, burn: 10800, defects: 0.0007, clears: 0.08, role: "Senior code architect", flavor: "Reads the repository before touching the semicolon.", labels: ["Patch", "Analyze", "Simulate"], source: "https://qwenlm.github.io/blog/qwen2.5-coder-family/" },
  { id: "deepseek-v3", name: "DeepSeek-V3", shortName: "DeepSeek V3", provider: "DeepSeek", tier: 3, era: "2024", availability: "OPEN WEIGHTS · MODEL LICENSE", sprite: "architect", color: "#2859d9", baseCost: 3500000, growth: 1.18, rate: 70000, burn: 31500, defects: 0.0004, clears: 0.14, role: "Production conductor", flavor: "A mixture of experts pretending the queue is an orchestra.", labels: ["Route", "Coordinate", "Verify"], source: "https://github.com/deepseek-ai/DeepSeek-V3" },

  { id: "llama31-70b", name: "Llama 3.1 70B Instruct", shortName: "Llama 3.1 70B", provider: "Meta", tier: 4, era: "2024", availability: "OPEN WEIGHTS · COMMUNITY LICENSE", sprite: "opus", color: "#0d6fd8", baseCost: 10000000, growth: 1.18, rate: 190000, burn: 90000, defects: 0.00018, clears: 0.8, role: "Reviewer and mentor", flavor: "Big enough to remember why the policy exists.", labels: ["Guide", "Review", "Forensic"], source: "https://ai.meta.com/blog/meta-llama-3-1/" },
  { id: "qwq-32b", name: "QwQ-32B", shortName: "QwQ 32B", provider: "Qwen", tier: 4, era: "2025", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "sonnet", color: "#b45cff", baseCost: 26000000, growth: 1.18, rate: 500000, burn: 245000, defects: 0.00006, clears: 3, role: "Math verifier", flavor: "Will think twice, then think about thinking twice.", labels: ["Solve", "Reason", "Prove"], source: "https://qwenlm.github.io/blog/qwq-32b/" },
  { id: "deepseek-r1", name: "DeepSeek-R1", shortName: "DeepSeek R1", provider: "DeepSeek", tier: 4, era: "2025", availability: "OPEN WEIGHTS · MIT", sprite: "architect", color: "#1649c8", baseCost: 70000000, growth: 1.19, rate: 1400000, burn: 700000, defects: 0.00002, clears: 12, role: "Defect hunter", flavor: "Finds the hidden premise and files a bug against it.", labels: ["Trace", "Reason", "Forensic"], source: "https://github.com/deepseek-ai/DeepSeek-R1" },
  { id: "kimi-k2", name: "Kimi-K2-Instruct", shortName: "Kimi K2", provider: "Moonshot AI", tier: 4, era: "2025", availability: "OPEN WEIGHTS · MODIFIED MIT", sprite: "nano", color: "#b8f36b", baseCost: 190000000, growth: 1.19, rate: 4000000, burn: 1950000, defects: 0.00003, clears: 4, role: "Agentic tool runner", flavor: "Carries the toolbox and somehow also the meeting notes.", labels: ["Act", "Coordinate", "Reflect"], source: "https://github.com/MoonshotAI/Kimi-K2" },

  { id: "openai-o3", name: "OpenAI o3", shortName: "o3", provider: "OpenAI", tier: 5, era: "2025", availability: "HOSTED · LEGACY FRONTIER", sprite: "opus", color: "#d8fff3", baseCost: 600000000, growth: 1.19, rate: 12000000, burn: 5900000, defects: 0, clears: 50, role: "Principal reasoner", flavor: "A principal scientist who reviews the review queue.", labels: ["Triage", "Reason", "Forensic"], source: "https://developers.openai.com/api/docs/models/o3" },
  { id: "gemini35-flash", name: "Gemini 3.5 Flash", shortName: "Gemini 3.5", provider: "Google", tier: 5, era: "2026", availability: "HOSTED · CURRENT", sprite: "flash", color: "#4285f4", baseCost: 1800000000, growth: 1.19, rate: 35000000, burn: 17000000, defects: 0.000006, clears: 14, role: "Multimodal responder", flavor: "Sees the screenshot before the bug report finishes loading.", labels: ["Flash", "Ground", "Inspect"], source: "https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash" },
  { id: "gpt56-sol", name: "GPT-5.6 Sol", shortName: "GPT-5.6 Sol", provider: "OpenAI", tier: 5, era: "2026", availability: "HOSTED · CURRENT", sprite: "hy3", color: "#e8fff8", baseCost: 5500000000, growth: 1.20, rate: 110000000, burn: 53000000, defects: 0.000002, clears: 70, role: "Executive orchestrator", flavor: "The all-rounder who turned the roadmap into a route.", labels: ["Direct", "Orchestrate", "Simulate"], source: "https://openai.com/index/gpt-5-6/" },
  { id: "claude-opus-48", name: "Claude Opus 4.8", shortName: "Opus 4.8", provider: "Anthropic", tier: 5, era: "2026", availability: "HOSTED · CURRENT", sprite: "architect", color: "#d97757", baseCost: 16000000000, growth: 1.20, rate: 340000000, burn: 162000000, defects: 0, clears: 220, role: "Long-horizon lead", flavor: "Builds for hours, then leaves unusually tidy notes.", labels: ["Build", "Lead", "Forensic"], source: "https://www.anthropic.com/news/claude-opus-4-8" }
];

const LEGACY_MODEL_MAP = {
  hy3: "qwen25-05b", flash: "ds-coder-13b", nano: "chatglm3-6b",
  glm: "qwen25-7b", sonnet: "qwen25-coder-32b", opus: "qwq-32b", architect: "kimi-k2"
};

const REASONING = {
  quick:    { id: "quick", label: "Quick", short: "Q", rate: 1.512, burn: 1.18, defects: 3.45, clears: 0.70,
              note: "51% more output, 3.45× defect drift" },
  standard: { id: "standard", label: "Standard", short: "S", rate: 1.08, burn: 0.95, defects: 1, clears: 1,
              note: "8% more output with 5% less burn" },
  deep:     { id: "deep", label: "Deep", short: "D", rate: 0.78, burn: 1.458, defects: 0.075, clears: 1.50,
              note: "92.5% less drift, 46% more burn" }
};

const MODE_IDS = Object.keys(REASONING);

const MAP_BOUNDS = { minX: 0.035, maxX: 0.965, minY: 0.08, maxY: 0.92 };

// Invisible navigation graph. Every edge is traced over visible stone or sand.
// It has no economic meaning, but all placement and movement is constrained to it.
const PATH_NODES = {
  cc_entry:{x:.460,y:.550,event:"command"}, cc_apron_w:{x:.415,y:.558},
  west_lane_s:{x:.365,y:.558}, west_lane_mid:{x:.365,y:.450}, west_lane_n:{x:.365,y:.322},
  west_lane_canopy_e:{x:.365,y:.305}, west_lane_canopy_w:{x:.260,y:.305}, west_junction:{x:.260,y:.322}, cave_lane:{x:.258,y:.260}, cave_door:{x:.258,y:.145,event:"cave"},
  solar_junction:{x:.260,y:.450}, solar_stop:{x:.205,y:.450,event:"solar"}, west_beacon:{x:.160,y:.450,event:"beacon"},
  garden_end:{x:.260,y:.490,event:"garden"}, west_bridge_e:{x:.353,y:.535}, west_bridge_mid:{x:.335,y:.535,event:"bridge"}, west_bridge_w:{x:.316,y:.535},
  fountain_n:{x:.460,y:.598,event:"fountain"}, fountain_ne:{x:.482,y:.612,event:"fountain"}, fountain_e:{x:.489,y:.642,event:"fountain"},
  fountain_se:{x:.482,y:.672,event:"fountain"}, fountain_s:{x:.460,y:.686,event:"fountain"}, fountain_sw:{x:.438,y:.672,event:"fountain"},
  fountain_w:{x:.431,y:.642,event:"fountain"}, fountain_nw:{x:.438,y:.612,event:"fountain"},
  east_lower_turn:{x:.540,y:.558}, east_lane:{x:.540,y:.675}, east_bridge_w:{x:.556,y:.675}, east_bridge_mid:{x:.577,y:.675,event:"bridge"}, east_bridge_e:{x:.598,y:.675},
  lower_field_w:{x:.622,y:.675,event:"sandbox"}, lower_field_s:{x:.675,y:.675,event:"sandbox"}, lower_field_n:{x:.675,y:.585,event:"sandbox"},
  lower_field_cross:{x:.695,y:.585,event:"sandbox"}, lower_field_apron:{x:.695,y:.555}, lower_field_gate:{x:.695,y:.525},
  archive_lane_s:{x:.695,y:.487}, archive_door:{x:.695,y:.458,event:"archive"}, archive_lane_mid:{x:.720,y:.458}, archive_lane_e:{x:.744,y:.458},
  east_turn:{x:.760,y:.442}, east_lane_n:{x:.760,y:.350}, east_top_e:{x:.760,y:.335}, east_top_mid:{x:.690,y:.335},
  training_gate:{x:.690,y:.284}, training_s:{x:.690,y:.255,event:"training"}, training_mid:{x:.725,y:.215,event:"training"}, training_n:{x:.725,y:.165,event:"training"},
  east_top_w:{x:.640,y:.335,event:"beacon"}, upper_bridge_e:{x:.600,y:.350}, upper_bridge_turn:{x:.600,y:.385}, upper_bridge_mid:{x:.582,y:.385,event:"bridge"}, upper_bridge_w:{x:.570,y:.385,event:"water"},
  south_lane:{x:.460,y:.735}, south_junction:{x:.460,y:.768}, south_e:{x:.510,y:.768}, south_bridge_n:{x:.510,y:.800},
  south_bridge_mid:{x:.510,y:.825,event:"bridge"}, south_gate:{x:.510,y:.875,event:"perimeter"}, south_beacon:{x:.425,y:.768,event:"beacon"},
  cc_apron_e:{x:.510,y:.558,event:"command"}
};

const PATH_EDGES = [
  ["cc_entry","cc_apron_w"],["cc_apron_w","west_lane_s"],["west_lane_s","west_lane_mid"],["west_lane_mid","west_lane_n"],["west_lane_n","west_lane_canopy_e"],["west_lane_canopy_e","west_lane_canopy_w"],["west_lane_canopy_w","west_junction"],["west_junction","cave_lane"],["cave_lane","cave_door"],
  ["west_junction","solar_junction"],["solar_junction","solar_stop"],["solar_stop","west_beacon"],["solar_junction","garden_end"],
  ["west_lane_s","west_bridge_e"],["west_bridge_e","west_bridge_mid"],["west_bridge_mid","west_bridge_w"],
  ["cc_entry","fountain_n"],["fountain_n","fountain_ne"],["fountain_ne","fountain_e"],["fountain_e","fountain_se"],["fountain_se","fountain_s"],["fountain_s","fountain_sw"],["fountain_sw","fountain_w"],["fountain_w","fountain_nw"],["fountain_nw","fountain_n"],
  ["cc_apron_e","east_lower_turn"],["east_lower_turn","east_lane"],["east_lane","east_bridge_w"],["east_bridge_w","east_bridge_mid"],["east_bridge_mid","east_bridge_e"],["east_bridge_e","lower_field_w"],["lower_field_w","lower_field_s"],["lower_field_s","lower_field_n"],["lower_field_n","lower_field_cross"],["lower_field_cross","lower_field_apron"],["lower_field_apron","lower_field_gate"],
  ["lower_field_gate","archive_lane_s"],["archive_lane_s","archive_door"],["archive_door","archive_lane_mid"],["archive_lane_mid","archive_lane_e"],["archive_lane_e","east_turn"],["east_turn","east_lane_n"],["east_lane_n","east_top_e"],["east_top_e","east_top_mid"],["east_top_mid","east_top_w"],["east_top_w","upper_bridge_e"],["upper_bridge_e","upper_bridge_turn"],["upper_bridge_turn","upper_bridge_mid"],["upper_bridge_mid","upper_bridge_w"],
  ["east_top_mid","training_gate"],["training_gate","training_s"],["training_s","training_mid"],["training_mid","training_n"],
  ["fountain_s","south_lane"],["south_lane","south_junction"],["south_junction","south_e"],["south_e","south_bridge_n"],["south_bridge_n","south_bridge_mid"],["south_bridge_mid","south_gate"],["south_junction","south_beacon"],
  ["cc_entry","cc_apron_e"]
];

const PATH_NODE_IDS = Object.keys(PATH_NODES);
const PATH_INDEX = Object.fromEntries(PATH_NODE_IDS.map((id, index) => [id, index]));
const CAMPUS_PATHS = PATH_NODE_IDS.map(id => ({ id, ...PATH_NODES[id], links: [] }));
PATH_EDGES.forEach(([from, to]) => {
  const a = PATH_INDEX[from];
  const b = PATH_INDEX[to];
  CAMPUS_PATHS[a].links.push(b);
  CAMPUS_PATHS[b].links.push(a);
});

const SPAWN_ROUTES = [
  ["cc_entry", "cc_apron_w"], ["cc_entry", "fountain_n"], ["cc_entry", "cc_apron_e"]
];

const ENVIRONMENT_LINES = {
  command: ["Back from stand-up. Nothing stood up.", "HQ filed a ticket against the ticket."],
  cave: ["The cave returned 403.", "I heard legacy code in there."],
  solar: ["Panels at 98%. Confidence at 61%."],
  beacon: ["Beacon synced. Vibes remain eventual."],
  garden: ["I pruned one branch. Git is furious."],
  fountain: ["Water-cooler meeting, now with actual water.", "I reviewed my reflection. Needs tests."],
  archive: ["Archive found: FINAL_v7_REAL."],
  training: ["Benchmark complete. I won the spreadsheet."],
  sandbox: ["Sandbox passed. Sand remains untyped."],
  bridge: ["Water under the bridge; bugs still upstream."],
  water: ["Water under the bridge; bugs still upstream."],
  perimeter: ["I touched grass. Cache invalidated."]
};

const UPGRADES = [
  { id: "shrink", name: "Shrink Guard", cost: 400, need: { "ds-coder-13b": 1 },
    desc: "Reject suspiciously small diffs. Defect drift −25%.", effect: { type: "defectMult", value: 0.75 } },
  { id: "precheck", name: "Precheck Script", cost: 3000, need: { "qwen25-05b": 5 },
    desc: "Run deterministic checks first. Manual review clears 3×.", effect: { type: "reviewPower", value: 3 } },
  { id: "strict", name: "Strict Tool Config", cost: 15000, need: { gpt3: 1 },
    desc: "Stop loading unused context. Paid-seat burn −15%.", effect: { type: "burnMult", value: 0.85 } },
  { id: "compact", name: "Context Compaction", cost: 150000, need: { "qwen25-7b": 3 },
    desc: "Compact at 80%. Organization output +25%.", effect: { type: "prodMult", value: 1.25 } },
  { id: "perstage", name: "Per-stage Markers", cost: 10000000, need: { "llama31-70b": 1 },
    desc: "Passed work cannot false-fail. Defect drift −40%.", effect: { type: "defectMult", value: 0.60 } },
  { id: "routing", name: "Semantic Router", cost: 150000000, need: { "kimi-k2": 1 },
    desc: "Send each task to the right seat. Organization output +30%.", effect: { type: "prodMult", value: 1.30 } }
];

const SYNERGIES = [
  { id: "open-bench", name: "Open Bench", target: "Own 3 distinct open-weight models", desc: "+12% organization output", effect: { type: "prodMult", value: 1.12 },
    test: () => MODELS.filter(model => model.availability.startsWith("OPEN WEIGHTS") && countOf(model.id) > 0).length >= 3 },
  { id: "cross-lab", name: "Cross-Lab Handoff", target: "Recruit from 4 companies", desc: "Defect drift −18%", effect: { type: "defectMult", value: 0.82 },
    test: () => new Set(state.agents.map(agent => modelById(agent.modelId)?.provider).filter(Boolean)).size >= 4 },
  { id: "reasoning-ring", name: "Reasoning Ring", target: "Own 2 Tier 4 models", desc: "Manual review power +2", effect: { type: "reviewPowerAdd", value: 2 },
    test: () => MODELS.filter(model => model.tier === 4 && countOf(model.id) > 0).length >= 2 },
  { id: "frontier-council", name: "Frontier Council", target: "Own 3 Tier 5 models", desc: "+30% organization output", effect: { type: "prodMult", value: 1.30 },
    test: () => MODELS.filter(model => model.tier === 5 && countOf(model.id) > 0).length >= 3 }
];

const CFG = {
  tickMs: 100,
  saveEveryMs: 10000,
  offlineCapH: 8,
  debtHalfPoint: 50,
  brownoutRunway: 5,
  clickBase: 1,
  reviewBase: 1,
  debtDecay: 0.05,
  logMax: 5,
  saveKey: "agentOrgIdle.v3",
  legacySaveKeys: ["agentOrgIdle.v2", "agentOrgIdle.v1"],
  uiKey: "agentOrgIdle.ui.v1"
};

const CHATTER = [
  "stage passed clean.", "day-lock written.", "queue triaged: 0 open.",
  "branch synced.", "rc=0 in 12s.", "inbox empty; skipping.",
  "backoff 300s, attempt 2/4.", "markers purged."
];

const LIES = [
  "DONE. (no diff written)", "rc=0 in 4s — nothing happened.",
  "MAX TURNS without DONE.", "reasoning leaked past the footer.",
  "claimed success; guard disagrees.", "rc=124 — timeout.",
  "wrote the report to nowhere.", "counted 0 items; there were 6."
];

const MODEL_CHATTER = {
  hy3: [
    "Task understood. Probably.", "Free tier. Premium enthusiasm.",
    "I found the edge case. It was the task.", "Literal mode is a lifestyle.",
    "I brought a checklist for the checklist.", "Good news: it is reproducible.",
    "I fixed exactly what you said. Sorry.", "Verify clicked. Feeling official."
  ],
  flash: [
    "Done. What was the question?", "Latency is fear with units.",
    "I shipped while you were blinking.", "That corner looked optional.",
    "Fast path found. It was downhill.", "I can explain, but that is slower.",
    "Review? Catch me first.", "I skimmed the warning label."
  ],
  nano: [
    "I packed light. Context is heavy.", "Small prompt. Serious little plan.",
    "Handoff clean. No crumbs.", "I forgot nothing important-ish.",
    "I can summarize the summary.", "Minimal state. Maximum opinions.",
    "Compact, not cryptic. Usually.", "Passing the tiny baton."
  ],
  glm: [
    "Build green. Mood neutral.", "I brought the boring fix.",
    "Reliable is a feature.", "Tools loaded. Drama unloaded.",
    "Another day, another clean diff.", "I make the queue less interesting.",
    "Output steady. Coffee simulated.", "Factory settings: competent."
  ],
  sonnet: [
    "The knot had documentation.", "I read the footnote. It bit me.",
    "One tangled thought at a time.", "The context has subtext.",
    "I found three meanings and one bug.", "Patience is cheaper than rollback.",
    "Small diff. Long story.", "Deep read. Shallow panic."
  ],
  opus: [
    "I reviewed your review.", "Interesting. Define done.",
    "Some defects merely hide.", "My concerns are alphabetized.",
    "Approved, with a suspicious pause.", "I found a bug wearing a tie.",
    "Nothing to ship. Plenty to question.", "Green check. Raised eyebrow."
  ],
  architect: [
    "I planned for this conversation.", "The roadmap has a roadmap.",
    "I moved the bottleneck to Q4.", "That edge case has zoning issues.",
    "I modeled the model modeling.", "Blueprint first. Panic later.",
    "Dependencies are shy dominoes.", "The plan is perfect. Reality pending."
  ]
};

const AGENT_EXCHANGES = [
  ["Did you read the whole prompt?", "I read the confident parts."],
  ["Is that a feature?", "It has feature-like confidence."],
  ["How is the queue?", "Shorter than my context."],
  ["Any blockers?", "Only the laws of causality."],
  ["Want a second opinion?", "I have not finished the first."],
  ["Did the test pass?", "It passed something."],
  ["Who owns this task?", "The task appears self-governing."],
  ["Can you make it simpler?", "I can make it shorter."],
  ["Are we in deep reasoning?", "Emotionally, yes."],
  ["What is our runway?", "Enough for one bad idea."],
  ["Why are you glowing?", "Uncommitted changes."],
  ["Ship it?", "Let it finish becoming true."]
];

/* --------------------------------------------------------------------------
   STATE + ECONOMY
   -------------------------------------------------------------------------- */

function freshState() {
  const buyModes = {};
  MODELS.forEach(model => { buyModes[model.id] = "standard"; });
  return {
    version: 3,
    tokens: 0,
    debt: 0,
    lifetime: 0,
    agents: [],
    owned: {},
    brownout: false,
    conventions: 0,
    nextAgentId: 1,
    buyModes,
    defectEvents: 0,
    last: Date.now()
  };
}

let state = freshState();
let saveAcc = 0;

const modelById = id => MODELS.find(model => model.id === id);
const has = id => !!state.owned[id];
const countOf = modelId => state.agents.reduce((sum, agent) => sum + (agent.modelId === modelId ? 1 : 0), 0);
function representativeAgents() {
  const seen = new Set();
  return state.agents.filter(agent => {
    if (seen.has(agent.modelId)) return false;
    seen.add(agent.modelId);
    return true;
  });
}
const costOf = model => Math.floor(model.baseCost * Math.pow(model.growth, countOf(model.id)));
const upCostOf = upgrade => upgrade.cost;
const integrity = () => 1 / (1 + state.debt / CFG.debtHalfPoint);
const tierById = id => TIERS.find(tier => tier.id === id);
const modelUnlocked = model => state.lifetime >= tierById(model.tier).unlockLifetime || countOf(model.id) > 0;
const activeSynergies = () => SYNERGIES.filter(synergy => synergy.test());

function mods() {
  const out = { defectMult: 1, burnMult: 1, prodMult: 1, reviewPower: CFG.reviewBase };
  for (const upgrade of UPGRADES) {
    if (!has(upgrade.id)) continue;
    const effect = upgrade.effect;
    if (effect.type === "reviewPower") out.reviewPower = Math.max(out.reviewPower, effect.value);
    else out[effect.type] *= effect.value;
  }
  for (const synergy of activeSynergies()) {
    const effect = synergy.effect;
    if (effect.type === "reviewPowerAdd") out.reviewPower += effect.value;
    else out[effect.type] *= effect.value;
  }
  out.prodMult *= 1 + 0.02 * state.conventions;
  return out;
}

function agentStats(agent) {
  const model = modelById(agent.modelId);
  const mode = REASONING[agent.mode] || REASONING.standard;
  return {
    rate: model.rate * mode.rate,
    burn: model.burn * mode.burn,
    defects: model.defects * mode.defects,
    clears: model.clears * mode.clears
  };
}

function contributions(includeBrownedOut) {
  const total = { rate: 0, burn: 0, defects: 0, clears: 0 };
  for (const agent of state.agents) {
    const stats = agentStats(agent);
    if (!includeBrownedOut && state.brownout && stats.burn > 0) continue;
    total.rate += stats.rate;
    total.burn += stats.burn;
    total.defects += stats.defects;
    total.clears += stats.clears;
  }
  return total;
}

function prodPerSec(m) {
  m = m || mods();
  return contributions(false).rate * integrity() * m.prodMult;
}

function burnPerSec(m) {
  m = m || mods();
  return contributions(false).burn * m.burnMult;
}

function fullBurnPerSec(m) {
  m = m || mods();
  return contributions(true).burn * m.burnMult;
}

function defectsPerSec(m) {
  m = m || mods();
  return contributions(false).defects * m.defectMult;
}

function clearsPerSec() {
  return contributions(false).clears;
}

function unlocked(upgrade) {
  if (!upgrade.need) return true;
  return Object.entries(upgrade.need).every(([id, count]) => countOf(id) >= count);
}

function integrateDebt(dt, defects, clears) {
  const drift = defects - clears;
  const decay = CFG.debtDecay;
  const e = Math.exp(-decay * dt);
  state.debt = Math.max(0, state.debt * e + (drift / decay) * (1 - e));
  if (state.debt < 0.0001) state.debt = 0;
}

function step(dt, quiet) {
  if (!Number.isFinite(dt) || dt <= 0) return;
  let remaining = Math.min(dt, CFG.offlineCapH * 3600);

  // Fixed substeps make online/offline balance effectively identical while
  // keeping brownout threshold crossings stable for long fast-forwards.
  while (remaining > 0.000001) {
    const slice = Math.min(0.25, remaining);
    const m = mods();
    const output = prodPerSec(m);
    const burn = burnPerSec(m);
    const defects = defectsPerSec(m);
    const clears = clearsPerSec();
    const gain = output * slice;

    state.tokens = Math.max(0, state.tokens + gain - burn * slice);
    state.lifetime += gain;
    integrateDebt(slice, defects, clears);

    state.defectEvents += defects * slice;
    if (state.defectEvents >= 1) {
      const events = Math.floor(state.defectEvents);
      state.defectEvents -= events;
      if (!quiet && Math.random() < Math.min(0.72, events * 0.32)) log(pick(LIES), "d");
    }

    const fullBurn = fullBurnPerSec(m);
    if (!state.brownout && state.tokens <= 0 && fullBurn > 0) {
      state.brownout = true;
      if (!quiet) {
        log("reserves empty; paid seats are resting.", "d");
        announce("Brownout. Paid agents are resting.");
      }
    } else if (state.brownout && (fullBurn <= 0 || state.tokens >= fullBurn * CFG.brownoutRunway)) {
      state.brownout = false;
      if (!quiet) {
        log("reserves recovered; all seats online.", "g");
        announce("Reserves recovered. All agents are online.");
      }
    }

    if (!quiet && Math.random() < slice * 0.12) log(pick(CHATTER));
    remaining -= slice;
  }
}

function spawnSpot(ordinal) {
  const index = Math.max(0, ordinal);
  const [fromId, toId] = SPAWN_ROUTES[index % SPAWN_ROUTES.length];
  const from = PATH_NODES[fromId];
  const to = PATH_NODES[toId];
  const lane = Math.floor(index / SPAWN_ROUTES.length);
  const t = 0.16 + (lane % 5) * 0.16;
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t
  };
}

function buy(model) {
  const cost = costOf(model);
  if (!modelUnlocked(model) || state.tokens < cost) return false;
  const mode = MODE_IDS.includes(state.buyModes[model.id]) ? state.buyModes[model.id] : "standard";
  const ownedBefore = countOf(model.id);
  const spot = spawnSpot(state.agents.length + ownedBefore);
  const agent = {
    uid: "a" + state.nextAgentId++,
    modelId: model.id,
    mode,
    x: spot.x,
    y: spot.y
  };
  state.tokens -= cost;
  state.agents.push(agent);
  const representative = state.agents.find(item => item.modelId === model.id) || agent;
  selectedAgentId = representative.uid;
  log("deployed " + model.name + " in " + displayMode(model, mode) + " mode.", "g");
  announce(model.name + " deployed. The field robot now represents ×" + countOf(model.id) + ".");
  if (uiReady) {
    renderAgents(representative.uid);
    buildInspector();
    buildRoster();
    render();
    save(false);
  }
  return true;
}

function buyUp(upgrade) {
  if (has(upgrade.id) || !unlocked(upgrade) || state.tokens < upCostOf(upgrade)) return false;
  state.tokens -= upCostOf(upgrade);
  state.owned[upgrade.id] = true;
  log("convention adopted: " + upgrade.name + ".", "g");
  announce(upgrade.name + " adopted.");
  if (uiReady) { render(); save(false); }
  return true;
}

function doWork() {
  const gain = CFG.clickBase * mods().prodMult;
  state.tokens += gain;
  state.lifetime += gain;
  if (uiReady) {
    const work = $("work");
    work.classList.remove("is-pulsing");
    requestAnimationFrame(() => work.classList.add("is-pulsing"));
    render();
  }
}

function doReview() {
  if (state.debt <= 0) return;
  state.debt = Math.max(0, state.debt - mods().reviewPower);
  if (state.debt === 0) log("queue clear: 0 open.", "g");
  if (uiReady) render();
}

/* --------------------------------------------------------------------------
   SAVE + MIGRATION
   -------------------------------------------------------------------------- */

const finiteNonnegative = (value, fallback) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : fallback;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function projectToWalkway(point) {
  let best = null;
  PATH_EDGES.forEach(([aId, bId], edgeIndex) => {
    const a = PATH_NODES[aId];
    const b = PATH_NODES[bId];
    const ax = a.x * WORLD.width;
    const ay = a.y * WORLD.height;
    const bx = b.x * WORLD.width;
    const by = b.y * WORLD.height;
    const px = point.x * WORLD.width;
    const py = point.y * WORLD.height;
    const dx = bx - ax;
    const dy = by - ay;
    const t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    const x = ax + dx * t;
    const y = ay + dy * t;
    const d2 = (px - x) ** 2 + (py - y) ** 2;
    if (!best || d2 < best.d2) best = { x: x / WORLD.width, y: y / WORLD.height, aId, bId, t, edgeIndex, d2 };
  });
  return best;
}

function normalizeAgent(raw, index, seen) {
  const requestedId = raw && raw.modelId;
  const model = modelById(LEGACY_MODEL_MAP[requestedId] || requestedId);
  if (!model) return null;
  const mode = MODE_IDS.includes(raw.mode) ? raw.mode : "standard";
  let uid = typeof raw.uid === "string" && /^a\d+$/.test(raw.uid) ? raw.uid : "a" + (index + 1);
  while (seen.has(uid)) uid = "a" + (index + 1) + "m" + seen.size;
  seen.add(uid);
  const fallback = spawnSpot(index);
  const snapped = projectToWalkway({
    x: finiteNonnegative(raw.x, fallback.x),
    y: finiteNonnegative(raw.y, fallback.y)
  }) || fallback;
  return {
    uid,
    modelId: model.id,
    mode,
    x: snapped.x,
    y: snapped.y
  };
}

function migrateCounts(counts) {
  const agents = [];
  const migrated = {};
  Object.entries(counts || {}).forEach(([rawId, rawCount]) => {
    const id = LEGACY_MODEL_MAP[rawId] || rawId;
    if (!modelById(id)) return;
    migrated[id] = (migrated[id] || 0) + Math.floor(finiteNonnegative(rawCount, 0));
  });
  for (const model of MODELS) {
    const count = Math.min(250, migrated[model.id] || 0);
    for (let i = 0; i < count; i++) {
      const spot = spawnSpot(agents.length + i);
      agents.push({ uid: "a" + (agents.length + 1), modelId: model.id, mode: "standard", x: spot.x, y: spot.y });
    }
  }
  return agents;
}

function hydrate(raw) {
  const next = freshState();
  next.tokens = finiteNonnegative(raw.tokens, 0);
  next.debt = finiteNonnegative(raw.debt, 0);
  next.lifetime = finiteNonnegative(raw.lifetime, 0);
  next.brownout = !!raw.brownout;
  next.conventions = Math.floor(finiteNonnegative(raw.conventions, 0));
  next.defectEvents = clamp(finiteNonnegative(raw.defectEvents, 0), 0, 0.999999);
  next.last = finiteNonnegative(raw.last, Date.now());

  const seen = new Set();
  const sourceAgents = Array.isArray(raw.agents) ? raw.agents : migrateCounts(raw.counts);
  next.agents = sourceAgents.map((agent, index) => normalizeAgent(agent, index, seen)).filter(Boolean).slice(0, 500);

  next.owned = {};
  UPGRADES.forEach(upgrade => { if (raw.owned && raw.owned[upgrade.id]) next.owned[upgrade.id] = true; });
  MODELS.forEach(model => {
    const legacyId = Object.keys(LEGACY_MODEL_MAP).find(id => LEGACY_MODEL_MAP[id] === model.id);
    const mode = raw.buyModes && (raw.buyModes[model.id] || raw.buyModes[legacyId]);
    next.buyModes[model.id] = MODE_IDS.includes(mode) ? mode : "standard";
  });

  const maxId = next.agents.reduce((max, agent) => {
    const number = Number((agent.uid.match(/^a(\d+)$/) || [])[1]);
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 0);
  next.nextAgentId = Math.max(maxId + 1, Math.floor(finiteNonnegative(raw.nextAgentId, 1)));
  return next;
}

function save(showStatus) {
  state.last = Date.now();
  try {
    localStorage.setItem(CFG.saveKey, JSON.stringify(state));
    if (uiReady && showStatus !== false) $("saved").textContent = "Saved " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return true;
  } catch (error) {
    if (uiReady) $("saved").textContent = "Save unavailable";
    return false;
  }
}

function load() {
  let raw = null;
  let migrated = false;
  try {
    raw = localStorage.getItem(CFG.saveKey);
    if (!raw) {
      for (const key of CFG.legacySaveKeys) {
        raw = localStorage.getItem(key);
        if (raw) { migrated = true; break; }
      }
    }
  } catch (error) { return false; }
  if (!raw) return false;

  let parsed;
  try { parsed = JSON.parse(raw); } catch (error) { return false; }
  state = hydrate(parsed || {});

  const away = Math.min(Math.max(0, (Date.now() - state.last) / 1000), CFG.offlineCapH * 3600);
  if (away > 60) {
    const tokensBefore = state.tokens;
    const debtBefore = state.debt;
    step(away, true);
    const tokenDelta = state.tokens - tokensBefore;
    const debtDelta = state.debt - debtBefore;
    log("away " + duration(away) + ": " + (tokenDelta >= 0 ? "+" : "") + fmt(tokenDelta) + " tokens.", debtDelta > 0 ? "d" : "g");
  }
  if (migrated) save(false);
  return true;
}

/* --------------------------------------------------------------------------
   PRESENTATION
   -------------------------------------------------------------------------- */

const $ = id => document.getElementById(id);
const pick = array => array[Math.floor(Math.random() * array.length)];
const logLines = [];
let uiReady = false;
let selectedAgentId = null;
let toastTimer = 0;
const runtimePositions = new Map();
const roamRoutes = new Map();
const walkGenerations = new Map();
const activeWalks = new Map();
const agentHolds = new Map();
const interactionCooldowns = new Map();
let worldMotion = true;
const uiPreferences = { panelOpen: true, motionOn: true };

function fmt(number) {
  if (!Number.isFinite(number)) return "0";
  const negative = number < 0;
  const value = Math.abs(number);
  let out;
  if (value < 1000) out = value < 10 && value % 1 !== 0 ? value.toFixed(1) : Math.floor(value).toString();
  else if (value < 1e6) out = (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  else if (value < 1e9) out = (value / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  else if (value < 1e12) out = (value / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  else out = (value / 1e12).toFixed(2).replace(/\.00$/, "") + "T";
  return (negative ? "−" : "") + out;
}

const rate = number => (number < 0 ? "−" : "") + fmt(Math.abs(number)) + "/s";
const duration = seconds => seconds < 3600 ? Math.floor(seconds / 60) + "m" : (seconds / 3600).toFixed(1) + "h";

function displayMode(model, modeId) {
  const index = MODE_IDS.indexOf(modeId);
  return model.labels[index] || REASONING[modeId].label;
}

function log(message, cls) {
  logLines.push({ message, cls: cls || "" });
  while (logLines.length > CFG.logMax) logLines.shift();
  if (!uiReady) return;
  const container = $("log");
  container.replaceChildren(...logLines.map(line => {
    const div = document.createElement("div");
    div.className = line.cls;
    div.textContent = line.message;
    return div;
  }));
}

function announce(message) {
  if (!uiReady) return;
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function needLabel(upgrade) {
  if (!upgrade.need) return "Available";
  return Object.entries(upgrade.need).map(([id, count]) => {
    const model = modelById(id);
    return count + " " + (model ? model.name : id);
  }).join(" · ");
}

class PixelWorldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.ctx.imageSmoothingEnabled = false;
    this.startTime = performance.now();
    this.lastFrame = -1;
    this.leaves = Array.from({ length: 34 }, (_, index) => ({
      x: (index * 197 + 71) % 1672,
      y: (index * 113 + 29) % 941,
      speed: 14 + (index % 5) * 3,
      phase: index * 0.73,
      color: ["#9bd451", "#d5e866", "#e6bd55"][index % 3]
    }));
    this.treeTips = [
      [31, 38], [92, 55], [170, 42], [250, 63], [332, 38], [445, 61], [505, 43],
      [718, 47], [812, 55], [1019, 43], [1125, 55], [1290, 42], [1450, 58], [1595, 44],
      [150, 245], [503, 327], [870, 328], [1038, 432], [485, 548], [1268, 516],
      [115, 728], [552, 718], [618, 815], [1420, 835], [1570, 760]
    ];
    this.flowPoints = [
      [570, 104], [650, 151], [806, 202], [951, 278], [989, 438], [974, 587],
      [922, 775], [808, 866], [612, 780], [527, 640], [105, 527], [80, 667]
    ];
    this.waterfalls = [[596, 112, 26, 30], [91, 727, 25, 31], [510, 806, 27, 31]];
    this.flowers = [
      [270, 96, 0], [352, 112, 1], [480, 127, 2], [775, 105, 0], [1090, 119, 1], [1321, 176, 2],
      [382, 392, 1], [548, 414, 0], [676, 484, 2], [1118, 386, 0], [1211, 408, 1],
      [168, 534, 2], [400, 551, 0], [646, 642, 1], [802, 654, 2], [1008, 609, 0],
      [1295, 531, 1], [224, 744, 0], [466, 722, 2], [690, 688, 1], [1050, 744, 0], [1510, 757, 2]
    ];
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  loop(now) {
    requestAnimationFrame(this.loop);
    if (!worldMotion || document.hidden) return;
    const frame = Math.floor((now - this.startTime) / 50);
    if (frame === this.lastFrame) return;
    this.lastFrame = frame;
    this.draw((now - this.startTime) / 1000);
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 1672, 941);
    const gust = Math.max(0, Math.sin(time * 1.15) - 0.25) / 0.75;
    this.drawWater(ctx, time);
    this.drawWaterfalls(ctx, time);
    this.drawTrees(ctx, time, gust);
    this.drawFlowers(ctx, time, gust);
    this.drawLeaves(ctx, time, gust);
  }

  clear() {
    this.ctx.clearRect(0, 0, 1672, 941);
  }

  drawWater(ctx, time) {
    this.flowPoints.forEach(([x, y], index) => {
      const frame = Math.floor(time * 5 + index) % 4;
      const drift = frame * 4;
      ctx.globalAlpha = 0.48 + frame * 0.08;
      ctx.fillStyle = index % 2 ? "#c9f7ed" : "#8de7e2";
      ctx.fillRect(x - 12 + drift, y, 22, 3);
      ctx.fillRect(x + 10 + drift, y + 7, 13, 2);
      ctx.fillStyle = "#3fb8ca";
      ctx.fillRect(x - 5 + drift, y + 12, 18, 2);
    });
    ctx.globalAlpha = 1;
  }

  drawWaterfalls(ctx, time) {
    const frame = Math.floor(time * 10) % 4;
    this.waterfalls.forEach(([x, y, width, height], index) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.clip();
      ctx.globalAlpha = 0.82;
      for (let stripe = -1; stripe < 5; stripe += 1) {
        const sy = y + ((stripe * 9 + frame * 3 + index * 2) % (height + 9)) - 6;
        ctx.fillStyle = stripe % 2 ? "#eafff8" : "#83dfe3";
        ctx.fillRect(x + 3 + (stripe % 3) * 6, sy, 3, 12);
      }
      const foamShift = Math.floor(time * 6 + index) % 3;
      ctx.fillStyle = "#edfff8";
      ctx.fillRect(x + foamShift, y + height - 5, width - 4, 4);
      ctx.fillStyle = "#78d5df";
      ctx.fillRect(x + 5 - foamShift, y + height - 1, width - 7, 2);
      ctx.restore();
    });
  }

  drawTrees(ctx, time, gust) {
    const step = Math.round(Math.sin(time * 5.2) * gust * 2);
    this.treeTips.forEach(([x, y], index) => {
      const offset = step + (index % 3) - 1;
      ctx.globalAlpha = 0.32 + gust * 0.48;
      ctx.fillStyle = index % 2 ? "#c6ed63" : "#96d34c";
      ctx.fillRect(x + offset, y, 5, 4);
      ctx.fillRect(x + 6 + offset, y + 4, 4, 4);
      ctx.fillStyle = "#4c9d43";
      ctx.fillRect(x - offset, y + 9, 5, 3);
    });
    ctx.globalAlpha = 1;
  }

  drawFlowers(ctx, time, gust) {
    const frame = Math.floor(time * 7) % 4;
    const swayFrames = [0, -1, 1, 0];
    const sway = swayFrames[frame] * (gust > 0.12 ? 2 : 1);
    const petals = ["#fff3c4", "#f28e9f", "#a997ee"];
    this.flowers.forEach(([x, y, kind], index) => {
      const local = sway + ((index + frame) % 3 === 0 ? 1 : 0);
      ctx.fillStyle = "#337b3d";
      ctx.fillRect(x, y + 4, 2, 7);
      ctx.fillStyle = petals[kind];
      ctx.fillRect(x - 3 + local, y, 4, 4);
      ctx.fillRect(x + 2 + local, y - 2, 4, 4);
      ctx.fillRect(x + 2 + local, y + 3, 4, 4);
      ctx.fillStyle = "#f0c84b";
      ctx.fillRect(x + local, y + 1, 3, 3);
    });
  }

  drawLeaves(ctx, time, gust) {
    this.leaves.forEach((leaf, index) => {
      const fall = (leaf.y + time * leaf.speed) % 1000 - 30;
      const drift = Math.sin(time * 1.8 + leaf.phase) * 22 + gust * 18;
      const x = (leaf.x + drift + time * 3) % 1690 - 9;
      ctx.globalAlpha = 0.38 + (index % 4) * 0.13;
      ctx.fillStyle = leaf.color;
      ctx.fillRect(Math.round(x), Math.round(fall), index % 2 ? 5 : 4, 4);
      if (index % 3 === 0) ctx.fillRect(Math.round(x) + 4, Math.round(fall) + 3, 3, 2);
    });
    ctx.globalAlpha = 1;
  }
}

let pixelWorldRenderer = null;

function buildAmbience() {
  $("ambient-field").replaceChildren();
  if (!pixelWorldRenderer) pixelWorldRenderer = new PixelWorldRenderer($("world-canvas"));
}

function buildStore() {
  const seats = $("seats");
  seats.classList.add("is-tiered");
  seats.innerHTML = TIERS.map(tier => {
    const models = MODELS.filter(model => model.tier === tier.id);
    const open = state.lifetime >= tier.unlockLifetime || models.some(model => countOf(model.id) > 0);
    return `<section class="market-tier${open ? "" : " is-locked"}" id="tier-${tier.id}" data-tier="${tier.id}">
      <div class="tier-heading">
        <div><span class="tier-badge">Tier ${tier.id}</span><h4>${tier.name}</h4><p>${tier.subtitle}</p></div>
        <span class="tier-lock" id="tier-status-${tier.id}">${open ? "Online" : fmt(tier.unlockLifetime) + " lifetime to unlock"}</span>
      </div>
      <div class="model-grid">${models.map(model => `
    <article class="model-card" id="card-${model.id}" aria-label="${model.name} by ${model.provider}">
      <div class="model-glyph sprite-frame" style="--model-color:${model.color}"><span class="robot-sprite sprite-${model.sprite}"></span></div>
      <div class="model-copy">
        <div class="model-name-line"><strong title="${model.name}">${model.shortName}</strong><span class="owned-pill" id="count-${model.id}">0</span></div>
        <div class="model-identity"><span>${model.provider}</span><span>${model.era}</span><span>${model.availability}</span></div>
        <p>${model.flavor}</p>
        <div class="model-meta" id="meta-${model.id}"></div>
        <div class="model-role"><span>${model.role}</span><a href="${model.source}" target="_blank" rel="noreferrer">Official ↗</a></div>
      </div>
      <div class="model-actions">
        <select class="mode-select" id="mode-${model.id}" aria-label="Reasoning mode for next ${model.name}">
          ${MODE_IDS.map((modeId, index) => `<option value="${modeId}">${REASONING[modeId].label} · ${model.labels[index]}</option>`).join("")}
        </select>
        <button class="buy-button" id="buy-${model.id}" type="button">Deploy <span id="cost-${model.id}"></span></button>
      </div>
    </article>`).join("")}</div>
    </section>`;
  }).join("");

  MODELS.forEach(model => {
    const select = $("mode-" + model.id);
    select.value = state.buyModes[model.id];
    select.addEventListener("change", () => {
      state.buyModes[model.id] = select.value;
      updateModelCard(model);
      save(false);
    });
    $("buy-" + model.id).addEventListener("click", () => buy(model));
  });
}

function buildUpgrades() {
  $("ups").innerHTML = UPGRADES.map(upgrade => `
    <article class="upgrade-card" id="upgrade-${upgrade.id}">
      <div class="upgrade-top">
        <div><strong>${upgrade.name}</strong><p>${upgrade.desc}</p></div>
        <button class="upgrade-button" id="upbuy-${upgrade.id}" type="button"><span id="upcost-${upgrade.id}"></span></button>
      </div>
      <span class="upgrade-lock" id="upneed-${upgrade.id}">${needLabel(upgrade)}</span>
    </article>`).join("");
  UPGRADES.forEach(upgrade => $("upbuy-" + upgrade.id).addEventListener("click", () => buyUp(upgrade)));
}

function buildRoster() {
  if (!$("roster-list")) return;
  const providers = new Set(state.agents.map(agent => modelById(agent.modelId)?.provider).filter(Boolean));
  const active = new Set(activeSynergies().map(synergy => synergy.id));
  $("roster-count").textContent = state.agents.length;
  $("roster-companies").textContent = providers.size;
  $("roster-synergy-count").textContent = active.size + "/" + SYNERGIES.length;
  $("synergies").innerHTML = SYNERGIES.map(synergy => `
    <article class="synergy-card${active.has(synergy.id) ? " is-active" : " is-locked"}">
      <span class="synergy-status">${active.has(synergy.id) ? "ONLINE" : "LOCKED"}</span>
      <div><strong>${synergy.name}</strong><p>${synergy.desc}</p><small>${synergy.target}</small></div>
    </article>`).join("");

  const ownedModels = MODELS.filter(model => countOf(model.id) > 0);
  if (!ownedModels.length) {
    $("roster-list").innerHTML = `<div class="roster-empty"><span aria-hidden="true">◇</span><strong>No agents deployed</strong><p>Open Models and deploy your first model to start the organization.</p></div>`;
    return;
  }
  $("roster-list").innerHTML = ownedModels.map(model => {
    const family = state.agents.filter(agent => agent.modelId === model.id);
    const modes = MODE_IDS.map(modeId => `${REASONING[modeId].short}:${family.filter(agent => agent.mode === modeId).length}`).join(" · ");
    return `<article class="roster-card" style="--model-color:${model.color}">
      <div class="roster-sprite sprite-frame"><span class="robot-sprite sprite-${model.sprite}"></span></div>
      <div><span class="roster-provider">${model.provider} · T${model.tier}</span><strong>${model.name}</strong><p>${model.role}</p><small>${modes}</small></div>
      <b class="roster-owned">×${family.length}</b>
    </article>`;
  }).join("");
}

function updateModelCard(model) {
  const mode = REASONING[state.buyModes[model.id]] || REASONING.standard;
  const count = countOf(model.id);
  const cost = costOf(model);
  $("count-" + model.id).textContent = count + " owned";
  $("cost-" + model.id).textContent = fmt(cost);
  const open = modelUnlocked(model);
  $("buy-" + model.id).disabled = !open || state.tokens < cost;
  $("card-" + model.id).classList.toggle("is-unaffordable", state.tokens < cost);
  $("card-" + model.id).classList.toggle("is-model-locked", !open);
  $("card-" + model.id).classList.toggle("is-owned", count > 0);
  const out = model.rate * mode.rate;
  const burn = model.burn * mode.burn;
  const quality = model.clears ? "−" + fmt(model.clears * mode.clears) + " review" : "+" + fmt(model.defects * mode.defects) + " drift";
  $("meta-" + model.id).innerHTML = `<span class="positive">${out ? fmt(out) + "/s out" : "reviewer"}</span><span>${burn ? fmt(burn) + "/s burn" : "free"}</span><span class="${model.clears ? "positive" : "negative"}">${quality}</span>`;
  $("buy-" + model.id).firstChild.textContent = open ? "Deploy " : "Locked ";
}

function buildInspector() {
  const inspector = $("inspector");
  const agent = state.agents.find(item => item.uid === selectedAgentId);
  if (!agent) {
    inspector.className = "inspector is-empty";
    const empty = state.agents.length === 0;
    inspector.innerHTML = `<div class="empty-orbit" aria-hidden="true"><i></i></div><div><strong>${empty ? "Start the org" : "Select an agent"}</strong><p>${empty ? "Ship 15 tasks, then deploy your first Qwen 0.5B." : "Tap a path-roaming robot to tune how deeply it reasons."}</p></div>`;
    return;
  }

  const model = modelById(agent.modelId);
  const family = state.agents.filter(item => item.modelId === model.id);
  const uniformMode = family.every(item => item.mode === family[0].mode) ? family[0].mode : null;
  inspector.className = "inspector";
  inspector.innerHTML = `
    <div class="inspector-head">
      <div class="agent-mini sprite-frame" style="--model-color:${model.color}"><span class="robot-sprite sprite-${model.sprite}"></span></div>
      <div class="inspector-title"><strong>${model.name} · ×${family.length}</strong><small>${uniformMode ? REASONING[uniformMode].note : "Mixed reasoning modes across this model team"}</small></div>
      <span class="roam-chip">1 field sprite</span>
    </div>
    <div class="reasoning-control">
      <div class="reasoning-label"><span>Team reasoning depth</span><small>Applies to all ${family.length}</small></div>
      <div class="mode-switch">
        ${MODE_IDS.map((modeId, index) => `<button type="button" data-mode="${modeId}" class="${uniformMode === modeId ? "is-active" : ""}">${model.labels[index]}</button>`).join("")}
      </div>
    </div>
    <div class="inspector-stats">
      <span><small>Output</small><b id="inspect-rate">0/s</b></span>
      <span><small>Burn</small><b id="inspect-burn">0/s</b></span>
      <span><small>${model.clears ? "Review" : "Drift"}</small><b id="inspect-quality">0/s</b></span>
    </div>`;

  inspector.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click", () => setAgentMode(agent.uid, button.dataset.mode));
  });
  updateInspectorStats();
}

function updateInspectorStats() {
  const agent = state.agents.find(item => item.uid === selectedAgentId);
  if (!agent || !$("inspect-rate")) return;
  const model = modelById(agent.modelId);
  const stats = state.agents.filter(item => item.modelId === model.id).reduce((total, item) => {
    const contribution = agentStats(item);
    total.rate += contribution.rate;
    total.burn += contribution.burn;
    total.defects += contribution.defects;
    total.clears += contribution.clears;
    return total;
  }, { rate: 0, burn: 0, defects: 0, clears: 0 });
  $("inspect-rate").textContent = rate(stats.rate);
  $("inspect-burn").textContent = rate(stats.burn);
  $("inspect-quality").textContent = rate(model.clears ? stats.clears : stats.defects);
}

function setModelFamilyMode(modelId, modeId) {
  if (!REASONING[modeId]) return 0;
  const family = state.agents.filter(item => item.modelId === modelId);
  family.forEach(item => { item.mode = modeId; });
  return family.length;
}

function setAgentMode(uid, modeId) {
  const agent = state.agents.find(item => item.uid === uid);
  if (!agent || !REASONING[modeId]) return;
  const model = modelById(agent.modelId);
  const familyCount = setModelFamilyMode(model.id, modeId);
  log(familyCount + " " + model.name + " agents switched to " + displayMode(model, modeId) + " reasoning.");
  announce(model.shortName + " team is now using " + displayMode(model, modeId) + " reasoning.");
  renderAgents();
  buildInspector();
  buildRoster();
  render();
  save(false);
}

function activeWalkPosition(uid, now) {
  const walk = activeWalks.get(uid);
  if (!walk) return null;
  const progress = clamp(((now ?? performance.now()) - walk.started) / walk.duration, 0, 1);
  return {
    x: walk.from.x + (walk.target.x - walk.from.x) * progress,
    y: walk.from.y + (walk.target.y - walk.from.y) * progress
  };
}

function renderAgents(newUid) {
  const container = $("agents");
  const now = performance.now();
  container.innerHTML = representativeAgents().map((agent, index) => {
    const model = modelById(agent.modelId);
    const family = state.agents.filter(item => item.modelId === model.id);
    const familyModes = new Set(family.map(item => item.mode));
    const groupMode = familyModes.size === 1 ? family[0].mode : null;
    const walk = activeWalks.get(agent.uid);
    const position = activeWalkPosition(agent.uid, now) || runtimePositions.get(agent.uid) || agent;
    const selected = agent.uid === selectedAgentId;
    const browned = state.brownout && family.some(item => agentStats(item).burn > 0);
    const remaining = walk ? Math.max(1, walk.duration - (now - walk.started)) : 360;
    return `<button class="agent${selected ? " is-selected" : ""}${browned ? " is-browned" : ""}${walk ? " is-walking" : ""}${agent.uid === newUid ? " is-new" : ""}" type="button"
      data-agent-id="${agent.uid}" data-mode="${groupMode || "mixed"}" data-owned-count="${family.length}" aria-pressed="${selected}" aria-label="${model.name}, ${family.length} deployed, ${groupMode ? displayMode(model, groupMode) : "mixed"} reasoning, roaming the campus"
      ${walk ? `data-facing="${walk.facing}"` : ""} style="left:${position.x * 100}%;top:${position.y * 100}%;--model-color:${model.color};--walk-time:${remaining}ms;--float-delay:${-(index % 7) * 0.31}s">
      <span class="agent-sprite robot-sprite sprite-${model.sprite}" data-sprite="${model.sprite}"></span><span class="agent-mode">${groupMode ? REASONING[groupMode].short : "M"}</span><span class="agent-stack-count" aria-hidden="true">×${family.length}</span><span class="agent-label">${model.shortName} · ×${family.length}${groupMode ? " · " + displayMode(model, groupMode) : " · Mixed"}</span><span class="agent-speech" aria-hidden="true"></span>
    </button>`;
  }).join("");

  container.querySelectorAll(".agent").forEach(element => {
    bindAgent(element);
    const walk = activeWalks.get(element.dataset.agentId);
    if (walk) {
      element.getBoundingClientRect();
      if (!element.isConnected || activeWalks.get(element.dataset.agentId) !== walk) return;
      element.style.left = walk.target.x * 100 + "%";
      element.style.top = walk.target.y * 100 + "%";
    }
  });
}

function selectAgent(uid) {
  selectedAgentId = uid;
  renderAgents();
  buildInspector();
}

let drag = null;

function cancelAgentWalk(agent, element) {
  const current = activeWalkPosition(agent.uid) || runtimePositions.get(agent.uid) || agent;
  const snapped = projectToWalkway(current) || current;
  walkGenerations.set(agent.uid, (walkGenerations.get(agent.uid) || 0) + 1);
  activeWalks.delete(agent.uid);
  runtimePositions.delete(agent.uid);
  agent.x = snapped.x;
  agent.y = snapped.y;
  if (element) {
    element.classList.remove("is-walking");
    element.style.transition = "none";
    element.style.left = snapped.x * 100 + "%";
    element.style.top = snapped.y * 100 + "%";
    requestAnimationFrame(() => element.style.removeProperty("transition"));
  }
}

function bindAgent(element) {
  const uid = element.dataset.agentId;
  element.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    event.stopPropagation();
    const agent = state.agents.find(item => item.uid === uid);
    if (!agent) return;
    cancelAgentWalk(agent, element);
    element.classList.add("is-picked-up");
    drag = { uid, element, startX: event.clientX, startY: event.clientY, moved: false };
    if (element.setPointerCapture) element.setPointerCapture(event.pointerId);
  });
  element.addEventListener("keydown", event => {
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      selectAgent(uid);
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const agent = state.agents.find(item => item.uid === uid);
    cancelAgentWalk(agent, element);
    const snap = projectToWalkway(agent);
    const endpointIndices = [PATH_INDEX[snap.aId], PATH_INDEX[snap.bId]];
    const nearestIndex = nearestRoamNode(agent);
    const nearest = CAMPUS_PATHS[nearestIndex];
    const nearNode = Math.hypot((agent.x - nearest.x) * WORLD.width, (agent.y - nearest.y) * WORLD.height) < 5;
    const candidates = nearNode ? nearest.links : endpointIndices;
    const direction = event.key === "ArrowLeft" ? [-1, 0] : event.key === "ArrowRight" ? [1, 0] : event.key === "ArrowUp" ? [0, -1] : [0, 1];
    const origin = { x: agent.x * WORLD.width, y: agent.y * WORLD.height };
    const nextIndex = candidates.slice().sort((a, b) => {
      const score = index => {
        const node = CAMPUS_PATHS[index];
        const dx = node.x * WORLD.width - origin.x;
        const dy = node.y * WORLD.height - origin.y;
        return (dx * direction[0] + dy * direction[1]) / (Math.hypot(dx, dy) || 1);
      };
      return score(b) - score(a);
    })[0];
    const next = CAMPUS_PATHS[nextIndex];
    roamRoutes.set(uid, { node: nextIndex, previous: nearNode ? nearestIndex : endpointIndices.find(index => index !== nextIndex) ?? -1 });
    selectedAgentId = uid;
    beginAgentWalk(agent, next, nextIndex, 0, true);
    buildInspector();
    save(false);
  });
}

function moveAgentDrag(event) {
  if (!drag) return;
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (distance < 5 && !drag.moved) return;
  drag.moved = true;
  drag.element.classList.add("is-dragging");
  const point = clientToWorld(event.clientX, event.clientY);
  const snapped = projectToWalkway(point);
  if (!snapped) return;
  drag.snap = snapped;
  drag.element.style.left = snapped.x * 100 + "%";
  drag.element.style.top = snapped.y * 100 + "%";
}

function finishAgentDrag(event, cancelled) {
  if (!drag) return;
  const activeDrag = drag;
  const agent = state.agents.find(item => item.uid === activeDrag.uid);
  activeDrag.element.classList.remove("is-dragging", "is-picked-up");

  if (agent && !cancelled && activeDrag.moved) {
    const point = activeDrag.snap || projectToWalkway(clientToWorld(event.clientX, event.clientY));
    runtimePositions.delete(activeDrag.uid);
    activeWalks.delete(activeDrag.uid);
    const a = PATH_INDEX[point.aId];
    const b = PATH_INDEX[point.bId];
    const entry = point.t < 0.5 ? a : b;
    agent.x = point.x;
    agent.y = point.y;
    roamRoutes.set(activeDrag.uid, { node: entry, previous: entry === a ? b : a, needsEntry: true });
    selectedAgentId = activeDrag.uid;
    log(modelById(agent.modelId).name + " picked a new campus route.", "g");
    announce("Snapped to the nearest path. This robot will keep roaming from here.");
    save(false);
  } else if (agent && !activeDrag.moved && !cancelled) {
    selectedAgentId = activeDrag.uid;
  }

  drag = null;
  renderAgents();
  buildInspector();
  render();
}

function motionAllowed() {
  return uiReady && !document.hidden && worldMotion;
}

function nearestRoamNode(point) {
  let nearest = 0;
  let nearestDistance = Infinity;
  CAMPUS_PATHS.forEach((node, index) => {
    const distance = Math.hypot((point.x - node.x) * 1.78, point.y - node.y);
    if (distance < nearestDistance) {
      nearest = index;
      nearestDistance = distance;
    }
  });
  return nearest;
}

function nextRoamTarget(agent) {
  const current = activeWalkPosition(agent.uid) || runtimePositions.get(agent.uid) || agent;
  let route = roamRoutes.get(agent.uid);
  if (!route) {
    const snap = projectToWalkway(current);
    const a = PATH_INDEX[snap.aId];
    const b = PATH_INDEX[snap.bId];
    const nearestIndex = snap.t < 0.5 ? a : b;
    const otherIndex = nearestIndex === a ? b : a;
    const nearest = CAMPUS_PATHS[nearestIndex];
    const distance = Math.hypot((current.x - nearest.x) * WORLD.width, (current.y - nearest.y) * WORLD.height);
    route = { node: nearestIndex, previous: otherIndex, needsEntry: distance > 2 };
    roamRoutes.set(agent.uid, route);
  }
  if (route.needsEntry) {
    route.needsEntry = false;
    const entry = CAMPUS_PATHS[route.node];
    return { x: entry.x, y: entry.y, nodeIndex: route.node };
  }
  const node = CAMPUS_PATHS[route.node];
  const forward = node.links.filter(index => index !== route.previous);
  const choices = forward.length ? forward : node.links;
  const nextIndex = pick(choices);
  const next = CAMPUS_PATHS[nextIndex];
  roamRoutes.set(agent.uid, { node: nextIndex, previous: route.node });
  return { x: next.x, y: next.y, nodeIndex: nextIndex };
}

function beginAgentWalk(agent, target, nodeIndex, stagger, rebuild) {
  const element = $("agents").querySelector(`[data-agent-id="${agent.uid}"]`);
  if (!element && !rebuild) return false;
  const current = activeWalkPosition(agent.uid) || { x: agent.x, y: agent.y };
  const distance = Math.hypot((target.x - current.x) * WORLD.width, (target.y - current.y) * WORLD.height);
  const durationMs = clamp(Math.round(distance / 48 * 1000), 760, 3900) + (stagger || 0) * 45;
  const generation = (walkGenerations.get(agent.uid) || 0) + 1;
  const horizontal = target.x - current.x;
  const facing = Math.abs(horizontal) > 0.001 ? (horizontal < 0 ? "left" : "right") : (element?.dataset.facing || "left");

  walkGenerations.set(agent.uid, generation);
  runtimePositions.set(agent.uid, target);
  activeWalks.set(agent.uid, { from: current, target, started: performance.now(), duration: durationMs, generation, facing, nodeIndex });

  if (rebuild) {
    renderAgents();
  } else {
    element.dataset.facing = facing;
    element.style.setProperty("--walk-time", durationMs + "ms");
    element.classList.add("is-walking");
    requestAnimationFrame(() => {
      element.style.left = target.x * 100 + "%";
      element.style.top = target.y * 100 + "%";
    });
  }

  setTimeout(() => {
    if (walkGenerations.get(agent.uid) !== generation) return;
    const walk = activeWalks.get(agent.uid);
    if (!walk || walk.generation !== generation) return;
    agent.x = walk.target.x;
    agent.y = walk.target.y;
    activeWalks.delete(agent.uid);
    runtimePositions.delete(agent.uid);
    const currentElement = $("agents").querySelector(`[data-agent-id="${agent.uid}"]`);
    if (currentElement) currentElement.classList.remove("is-walking");
    handleEnvironmentArrival(agent, walk.nodeIndex);
  }, durationMs + 80);
  return true;
}

function wanderAgents() {
  if (!motionAllowed() || drag || state.agents.length === 0) return;
  const now = performance.now();
  const candidates = representativeAgents().filter(agent => {
    const element = $("agents").querySelector(`[data-agent-id="${agent.uid}"]`);
    return element && !activeWalks.has(agent.uid) && (agentHolds.get(agent.uid) || 0) <= now;
  });
  if (!candidates.length) return;
  const moves = Math.max(1, Math.ceil(candidates.length * 0.45));
  const shuffled = candidates.slice().sort(() => Math.random() - 0.5).slice(0, moves);

  shuffled.forEach((agent, index) => {
    const target = nextRoamTarget(agent);
    beginAgentWalk(agent, target, target.nodeIndex, index, false);
  });
}

function pulseEnvironment(type, node) {
  const field = $("ambient-field");
  if (!field || !node) return;
  const pulse = document.createElement("i");
  pulse.className = "environment-pulse environment-" + type;
  pulse.style.left = node.x * 100 + "%";
  pulse.style.top = node.y * 100 + "%";
  field.appendChild(pulse);
  if (type === "command") $("command-center-hotspot").classList.add("is-active");
  setTimeout(() => {
    pulse.remove();
    if (type === "command") $("command-center-hotspot").classList.remove("is-active");
  }, 1800);
}

function handleEnvironmentArrival(agent, nodeIndex) {
  const node = CAMPUS_PATHS[nodeIndex];
  const type = node && node.event;
  if (!type || !ENVIRONMENT_LINES[type]) return;
  const now = performance.now();
  if ((interactionCooldowns.get(agent.uid) || 0) > now || Math.random() > 0.62) return;
  interactionCooldowns.set(agent.uid, now + 10000);
  agentHolds.set(agent.uid, now + 1200 + Math.random() * 1600);
  const line = pick(ENVIRONMENT_LINES[type]);
  showSpeech(agent.uid, line, 3400);
  pulseEnvironment(type, node);
  if (Math.random() < 0.22) log(modelById(agent.modelId).shortName + " checked " + type + ".", "g");
}

function showSpeech(uid, text, durationMs) {
  const element = $("agents").querySelector(`[data-agent-id="${uid}"]`);
  const bubble = element && element.querySelector(".agent-speech");
  if (!bubble) return;
  bubble.textContent = text;
  bubble.classList.add("is-speaking");
  clearTimeout(bubble._speechTimer);
  bubble._speechTimer = setTimeout(() => bubble.classList.remove("is-speaking"), durationMs || 3800);
}

let conversationBusy = false;

function runConversation() {
  const agents = representativeAgents();
  if (!uiReady || document.hidden || !agents.length || conversationBusy) return;
  conversationBusy = true;

  if (agents.length === 1) {
    const agent = agents[0];
    const model = modelById(agent.modelId);
    showSpeech(agent.uid, pick(MODEL_CHATTER[model.sprite] || CHATTER), 3900);
    setTimeout(() => { conversationBusy = false; }, 4200);
    return;
  }

  const nearbyPairs = [];
  const positionNow = performance.now();
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const firstPosition = activeWalkPosition(agents[i].uid, positionNow) || runtimePositions.get(agents[i].uid) || agents[i];
      const secondPosition = activeWalkPosition(agents[j].uid, positionNow) || runtimePositions.get(agents[j].uid) || agents[j];
      const closeEnough = Math.hypot((firstPosition.x - secondPosition.x) * 1.78, firstPosition.y - secondPosition.y) < 0.16;
      if (closeEnough) nearbyPairs.push([agents[i], agents[j]]);
    }
  }

  if (!nearbyPairs.length) {
    const solo = pick(agents);
    const model = modelById(solo.modelId);
    showSpeech(solo.uid, pick(MODEL_CHATTER[model.sprite] || CHATTER), 3900);
    setTimeout(() => { conversationBusy = false; }, 4200);
    return;
  }

  const [first, second] = pick(nearbyPairs);
  const exchange = pick(AGENT_EXCHANGES);
  showSpeech(first.uid, exchange[0], 4100);
  setTimeout(() => showSpeech(second.uid, exchange[1], 4300), 1500);
  setTimeout(() => { conversationBusy = false; }, 6100);
}

function startLivingWorld() {
  setTimeout(wanderAgents, 350);
  setInterval(wanderAgents, 1400);
  const chatterLoop = () => {
    runConversation();
    setTimeout(chatterLoop, 9000 + Math.random() * 6500);
  };
  setTimeout(chatterLoop, 3500);
}

function render() {
  if (!uiReady) return;
  const m = mods();
  const output = prodPerSec(m);
  const burn = burnPerSec(m);
  const net = output - burn;
  const quality = integrity();
  const defects = defectsPerSec(m);
  const clears = clearsPerSec();

  $("tok").textContent = fmt(state.tokens);
  $("prod").textContent = rate(output);
  $("burn").textContent = rate(burn);
  $("net").textContent = rate(net);
  $("netdot").classList.toggle("is-bad", net < 0);
  $("mult").textContent = Math.round(quality * 100) + "%";
  $("integrity-ring").style.setProperty("--fill", Math.round(quality * 100) + "%");
  $("debt").textContent = fmt(state.debt);
  $("brown").classList.toggle("is-visible", state.brownout);
  $("clickv").textContent = "+" + fmt(CFG.clickBase * m.prodMult);
  $("review").disabled = state.debt <= 0;
  $("reviewv").textContent = state.debt > 0 ? "clear " + fmt(m.reviewPower) + " defects" : "queue clean";

  const plateau = defects > clears ? (defects - clears) / CFG.debtDecay : 0;
  const plateauIntegrity = Math.round(100 / (1 + plateau / CFG.debtHalfPoint));
  $("debtnote").textContent = defects <= clears
    ? (state.debt > 0 ? "Review is ahead; debt falling" : "Clean queue")
    : "Trend: " + fmt(plateau) + " debt · " + plateauIntegrity + "% integrity";

  MODELS.forEach(updateModelCard);
  TIERS.forEach(tier => {
    const tierModels = MODELS.filter(model => model.tier === tier.id);
    const open = state.lifetime >= tier.unlockLifetime || tierModels.some(model => countOf(model.id) > 0);
    const section = $("tier-" + tier.id);
    const status = $("tier-status-" + tier.id);
    if (section) section.classList.toggle("is-locked", !open);
    if (status) status.textContent = open ? "Online" : fmt(Math.max(0, tier.unlockLifetime - state.lifetime)) + " lifetime left";
  });
  UPGRADES.forEach(upgrade => {
    const bought = has(upgrade.id);
    const open = unlocked(upgrade);
    const button = $("upbuy-" + upgrade.id);
    $("upgrade-" + upgrade.id).classList.toggle("is-locked", !open && !bought);
    $("upgrade-" + upgrade.id).classList.toggle("is-bought", bought);
    $("upcost-" + upgrade.id).textContent = bought ? "Adopted" : open ? fmt(upgrade.cost) : "Locked";
    $("upneed-" + upgrade.id).textContent = bought ? "Active organization-wide" : open ? "Available now" : "Requires " + needLabel(upgrade);
    button.disabled = bought || !open || state.tokens < upgrade.cost;
  });

  const agentsById = new Map(state.agents.map(agent => [agent.uid, agent]));
  $("agents").querySelectorAll(".agent").forEach(element => {
    const agent = agentsById.get(element.dataset.agentId);
    element.classList.toggle("is-browned", !!agent && state.brownout && agentStats(agent).burn > 0);
  });
  updateInspectorStats();
}

/* --------------------------------------------------------------------------
   CAMERA + UI EVENTS
   -------------------------------------------------------------------------- */

const WORLD = { width: 1672, height: 941 };
const camera = { x: 0, y: 0, scale: 0, minScale: 0 };
let pan = null;
let cameraInitialized = false;

function cameraViewWidth() {
  if ($("game").classList.contains("command-full")) return window.innerWidth;
  const panelOpen = !$("game").classList.contains("panel-closed") && !$("game").classList.contains("map-only");
  const dockWidth = $("dock") ? $("dock").getBoundingClientRect().width : 342;
  return panelOpen && window.innerWidth > 820 ? Math.max(520, window.innerWidth - dockWidth - 36) : window.innerWidth;
}

function fitCamera(recenter) {
  const width = cameraViewWidth();
  const height = window.innerHeight;
  camera.minScale = Math.max(width / WORLD.width, height / WORLD.height);
  camera.scale = !cameraInitialized || recenter ? camera.minScale : Math.max(camera.scale, camera.minScale);
  if (!cameraInitialized || recenter) {
    camera.x = (width - WORLD.width * camera.scale) / 2;
    camera.y = (height - WORLD.height * camera.scale) / 2;
    cameraInitialized = true;
  }
  clampCamera();
  applyCamera();
}

function clampCamera() {
  const viewWidth = cameraViewWidth();
  const scaledWidth = WORLD.width * camera.scale;
  const scaledHeight = WORLD.height * camera.scale;
  camera.x = scaledWidth <= viewWidth ? (viewWidth - scaledWidth) / 2 : clamp(camera.x, viewWidth - scaledWidth, 0);
  camera.y = scaledHeight <= window.innerHeight ? (window.innerHeight - scaledHeight) / 2 : clamp(camera.y, window.innerHeight - scaledHeight, 0);
}

function applyCamera() {
  $("world").style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`;
}

function clientToWorld(clientX, clientY) {
  return {
    x: (clientX - camera.x) / camera.scale / WORLD.width,
    y: (clientY - camera.y) / camera.scale / WORLD.height
  };
}

function bindMapPan() {
  const map = $("map");
  map.addEventListener("pointerdown", event => {
    if (event.button !== 0 || event.target.closest("button, aside, header, .action-dock, .feed")) return;
    pan = { startX: event.clientX, startY: event.clientY, cameraX: camera.x, cameraY: camera.y };
    map.setPointerCapture(event.pointerId);
  });
  map.addEventListener("pointermove", event => {
    map.style.setProperty("--pointer-x", event.clientX + "px");
    map.style.setProperty("--pointer-y", event.clientY + "px");
    if (!pan) return;
    camera.x = pan.cameraX + event.clientX - pan.startX;
    camera.y = pan.cameraY + event.clientY - pan.startY;
    clampCamera();
    applyCamera();
  });
  const end = () => { pan = null; };
  map.addEventListener("pointerup", end);
  map.addEventListener("pointercancel", end);
}

function setMapOnly(hidden) {
  const game = $("game");
  if (hidden) closeCommand(false);
  const chrome = [document.querySelector(".topbar"), $("dock"), document.querySelector(".action-dock"), document.querySelector(".feed")];
  game.classList.toggle("map-only", hidden);
  $("hud-restore").hidden = !hidden;
  chrome.forEach(element => { if (element) element.inert = hidden; });
  requestAnimationFrame(() => {
    fitCamera(true);
    (hidden ? $("hud-restore") : $("hud-hide")).focus({ preventScroll: true });
  });
}

function saveUIPreferences() {
  try { localStorage.setItem(CFG.uiKey, JSON.stringify(uiPreferences)); } catch (error) {}
}

function setWorldMotion(enabled, persist, announceChange) {
  worldMotion = !!enabled;
  uiPreferences.motionOn = worldMotion;
  $("game").classList.toggle("motion-off", !worldMotion);
  $("motion-toggle").setAttribute("aria-pressed", String(worldMotion));
  $("motion-label").textContent = worldMotion ? "Motion on" : "Motion off";
  if (!worldMotion) {
    if (pixelWorldRenderer) pixelWorldRenderer.clear();
    state.agents.forEach(agent => cancelAgentWalk(agent, $("agents").querySelector(`[data-agent-id="${agent.uid}"]`)));
    $("agents").querySelectorAll(".is-walking").forEach(element => element.classList.remove("is-walking"));
  }
  else if (pixelWorldRenderer) pixelWorldRenderer.draw((performance.now() - pixelWorldRenderer.startTime) / 1000);
  if (persist !== false) saveUIPreferences();
  if (announceChange) announce(worldMotion ? "World motion on. The campus is awake." : "World motion off. The campus is resting.");
}

function setPanel(open, persist) {
  $("game").classList.toggle("panel-closed", !open);
  $("panel-toggle").setAttribute("aria-expanded", String(open));
  $("dock").inert = !open;
  $("dock").setAttribute("aria-hidden", String(!open));
  uiPreferences.panelOpen = open;
  if (persist !== false) saveUIPreferences();
  if (uiReady && cameraInitialized) requestAnimationFrame(() => fitCamera(true));
}

let commandReturnFocus = null;

function commandFocusables() {
  return [...$("dock").querySelectorAll('button:not([disabled]), a[href], select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.hidden && element.getClientRects().length > 0);
}

function openCommand(view) {
  const full = view === "full";
  const game = $("game");
  if (game.classList.contains("map-only")) setMapOnly(false);
  if (!$("dock").contains(document.activeElement)) commandReturnFocus = document.activeElement;
  game.classList.toggle("command-full", full);
  $("map").inert = full;
  $("dock").dataset.commandView = full ? "full" : "docked";
  $("dock").setAttribute("aria-modal", String(full));
  setPanel(true, true);
  requestAnimationFrame(() => {
    fitCamera(true);
    (full ? $("panel-dock") : $("panel-close")).focus({ preventScroll: true });
  });
}

function closeCommand(restoreFocus) {
  const savedTarget = commandReturnFocus;
  const fallbackTarget = $("command-center-hotspot") || $("panel-toggle");
  const returnTarget = savedTarget && document.contains(savedTarget) && !$("dock").contains(savedTarget)
    ? savedTarget
    : fallbackTarget;
  $("game").classList.remove("command-full");
  $("map").inert = false;
  $("dock").dataset.commandView = "docked";
  $("dock").setAttribute("aria-modal", "false");
  setPanel(false, true);
  if (restoreFocus !== false && returnTarget && document.contains(returnTarget)) {
    requestAnimationFrame(() => returnTarget.focus({ preventScroll: true }));
  }
  commandReturnFocus = null;
}

function dockCommand() {
  $("game").classList.remove("command-full");
  $("map").inert = false;
  $("dock").dataset.commandView = "docked";
  $("dock").setAttribute("aria-modal", "false");
  setPanel(true, true);
  requestAnimationFrame(() => {
    fitCamera(true);
    $("panel-expand").focus({ preventScroll: true });
  });
}

function loadUIPreferences() {
  const mobile = window.matchMedia("(max-width: 820px)").matches;
  uiPreferences.panelOpen = !mobile;
  uiPreferences.motionOn = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    const stored = JSON.parse(localStorage.getItem(CFG.uiKey) || "null");
    if (stored && typeof stored.panelOpen === "boolean") uiPreferences.panelOpen = stored.panelOpen;
    if (stored && typeof stored.motionOn === "boolean") uiPreferences.motionOn = stored.motionOn;
  } catch (error) {}
  setPanel(uiPreferences.panelOpen, false);
  setWorldMotion(uiPreferences.motionOn, false, false);
}

function bindUI() {
  $("work").addEventListener("click", doWork);
  $("review").addEventListener("click", doReview);
  $("panel-toggle").addEventListener("click", () => {
    if ($("game").classList.contains("panel-closed")) openCommand("docked");
    else closeCommand(true);
  });
  $("command-center-hotspot").addEventListener("click", () => openCommand("full"));
  $("panel-expand").addEventListener("click", () => openCommand("full"));
  $("panel-dock").addEventListener("click", dockCommand);
  $("panel-close").addEventListener("click", () => closeCommand(true));
  $("command-backdrop").addEventListener("click", () => closeCommand(true));
  $("motion-toggle").addEventListener("click", () => setWorldMotion(!worldMotion, true, true));
  $("hud-hide").addEventListener("click", () => setMapOnly(true));
  $("hud-restore").addEventListener("click", () => setMapOnly(false));
  window.addEventListener("keydown", event => {
    if (event.key === "Tab" && $("game").classList.contains("command-full")) {
      const focusable = commandFocusables();
      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
      return;
    }
    const target = event.target;
    if (target && /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) return;
    if (event.key === "Escape" && $("game").classList.contains("command-full")) {
      event.preventDefault();
      closeCommand(true);
    } else if (event.key === "Escape" && $("game").classList.contains("map-only")) {
      event.preventDefault();
      setMapOnly(false);
    } else if (event.key.toLowerCase() === "h") {
      event.preventDefault();
      setMapOnly(!$("game").classList.contains("map-only"));
    } else if (event.key.toLowerCase() === "m") {
      event.preventDefault();
      setWorldMotion(!worldMotion, true, true);
    }
  });

  const activateCommandTab = (tab, moveFocus) => {
      document.querySelectorAll(".tab").forEach(item => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      document.querySelectorAll(".panel").forEach(panel => {
        const active = panel.id === tab.dataset.panel;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
      if (moveFocus) tab.focus({ preventScroll: true });
  };

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => activateCommandTab(tab, false));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const tabs = [...document.querySelectorAll(".tab")];
      const current = tabs.indexOf(tab);
      const next = event.key === "Home"
        ? tabs[0]
        : event.key === "End"
          ? tabs[tabs.length - 1]
          : tabs[(current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      event.preventDefault();
      activateCommandTab(next, true);
    });
  });

  $("feed-toggle").addEventListener("click", () => {
    const feed = document.querySelector(".feed");
    const collapsed = feed.classList.toggle("is-collapsed");
    $("feed-toggle").textContent = collapsed ? "Show" : "Hide";
    $("feed-toggle").setAttribute("aria-expanded", String(!collapsed));
  });

  $("wipe").addEventListener("click", () => {
    if (!confirm("Reset the campus, agents, upgrades, and tokens?")) return;
    try {
      localStorage.removeItem(CFG.saveKey);
      CFG.legacySaveKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {}
    state = freshState();
    runtimePositions.clear();
    roamRoutes.clear();
    walkGenerations.clear();
    activeWalks.clear();
    agentHolds.clear();
    interactionCooldowns.clear();
    selectedAgentId = null;
    saveAcc = 0;
    logLines.length = 0;
    buildStore();
    renderAgents();
    buildInspector();
    buildRoster();
    log("cold start. Ship a task to fund the first seat.");
    render();
  });

  bindMapPan();
  window.addEventListener("pointermove", moveAgentDrag, { passive: true });
  window.addEventListener("pointerup", event => finishAgentDrag(event, false));
  window.addEventListener("pointercancel", event => finishAgentDrag(event, true));
  window.addEventListener("resize", fitCamera);
  window.addEventListener("pagehide", () => save(false));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") save(false); });
}

function initUI() {
  uiReady = true;
  buildAmbience();
  buildStore();
  buildUpgrades();
  bindUI();
  loadUIPreferences();
  fitCamera();

  if (!load()) log("cold start. Ship a task to fund the first seat.");
  buildStore();
  renderAgents();
  buildInspector();
  buildRoster();
  logLines.forEach(() => {});
  render();
  startLivingWorld();

  setTimeout(() => $("map-hint").classList.add("is-hidden"), 9000);
  let previous = performance.now();
  setInterval(() => {
    const now = performance.now();
    const dt = Math.min(1, (now - previous) / 1000);
    previous = now;
    step(dt, false);
    render();
    saveAcc += dt;
    if (saveAcc >= CFG.saveEveryMs / 1000) { saveAcc = 0; save(true); }
  }, CFG.tickMs);
}

// Exposed for the balance harness; the browser game still boots normally.
globalThis.__AGENT_ORG__ = {
  get state() { return state; },
  setState(next) { state = hydrate(next || {}); },
  freshState, hydrate, step, doWork, doReview, buy, buyUp, costOf, upCostOf,
  countOf, representativeAgents, setModelFamilyMode, prodPerSec, burnPerSec, fullBurnPerSec, defectsPerSec, clearsPerSec,
  integrity, mods, unlocked, modelUnlocked, activeSynergies, agentStats, projectToWalkway,
  MODELS, TIERS, REASONING, MAP_BOUNDS, PATH_NODES, PATH_EDGES, CAMPUS_PATHS, UPGRADES, SYNERGIES, CFG, WORLD
};

if (typeof document !== "undefined" && document.getElementById("game")) initUI();
