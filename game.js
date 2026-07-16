"use strict";

/* --------------------------------------------------------------------------
   DATA — models, reasoning, campus paths, and conventions are all data.
   -------------------------------------------------------------------------- */

const TIERS = [
  { id: 1, name: "Roots", subtitle: "Small weights and the API pioneers", unlockLifetime: 0, unlockLevel: 1 },
  { id: 2, name: "Open Lab", subtitle: "Local runners become a real bench", unlockLifetime: 10000, unlockLevel: 3 },
  { id: 3, name: "Production", subtitle: "Workhorse models for serious throughput", unlockLifetime: 250000, unlockLevel: 5 },
  { id: 4, name: "Reasoning", subtitle: "Reviewers, planners, and agentic coordinators", unlockLifetime: 8000000, unlockLevel: 8 },
  { id: 5, name: "Frontier", subtitle: "Hosted leads for the late-game org", unlockLifetime: 200000000, unlockLevel: 12 }
];

// Cumulative EXP thresholds for org levels 1..20 (index 0 unused).
const LEVEL_EXP = [0, 0, 25, 70, 140, 240, 380, 560, 800, 1100, 1500, 2000, 2600, 3400, 4400, 5600, 7000, 8800, 11000, 14000, 18000];

const GUIDE_STEPS = [
  { id: "ship", text: "Ship tasks until you have 15 tokens (tap Ship a task)." },
  { id: "open", text: "Select the glass Command Center building to open the market." },
  { id: "deploy", text: "Deploy your first free model: Qwen 0.5B." },
  { id: "reason", text: "Select your robot and try Quick / Standard / Deep reasoning." },
  { id: "review", text: "When defects rise, use Review queue to clean the backlog." },
  { id: "grow", text: "Earn EXP, level up, and unlock higher model tiers." },
  { id: "pylon", text: "Stand near blue pylons for buffs; tap them when charged." },
  { id: "relay", text: "Visit the Field Relay in the open meadow and broadcast." }
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
  { id: "mistral-7b", name: "Mistral 7B Instruct", shortName: "Mistral 7B", provider: "Mistral AI", tier: 2, era: "2023", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "volt", color: "#ffd23a", baseCost: 22000, growth: 1.16, rate: 430, burn: 188, defects: 0.0045, clears: 0, role: "Low-burn runner", flavor: "Fast local work without hauling the whole lab.", labels: ["Sprint", "Route", "Reason"], source: "https://mistral.ai/news/announcing-mistral-7b/" },
  { id: "glm4-9b", name: "GLM-4-9B-Chat", shortName: "GLM-4 9B", provider: "Zhipu AI", tier: 2, era: "2024", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "nano", color: "#22b8b0", baseCost: 60000, growth: 1.17, rate: 1100, burn: 490, defects: 0.003, clears: 0.02, role: "Long-context clerk", flavor: "Keeps the handoff legible in two languages.", labels: ["Execute", "Reflect", "Prove"], source: "https://github.com/zai-org/GLM-4" },

  { id: "gpt35-turbo", name: "GPT-3.5 Turbo", shortName: "GPT-3.5", provider: "OpenAI", tier: 3, era: "2023", availability: "HOSTED · ARCHIVE", sprite: "glm", color: "#20b486", baseCost: 160000, growth: 1.17, rate: 3000, burn: 1360, defects: 0.002, clears: 0, role: "API workhorse", flavor: "Function calls, batch jobs, and an alarming coffee habit.", labels: ["Call", "Compose", "Check"], source: "https://openai.com/index/function-calling-and-other-api-updates/" },
  { id: "llama31-8b", name: "Llama 3.1 8B Instruct", shortName: "Llama 3.1 8B", provider: "Meta", tier: 3, era: "2024", availability: "OPEN WEIGHTS · COMMUNITY LICENSE", sprite: "opus", color: "#168aff", baseCost: 450000, growth: 1.17, rate: 8000, burn: 3600, defects: 0.0012, clears: 0.04, role: "Private ops generalist", flavor: "Runs inside the walls and minds its own context.", labels: ["Draft", "Plan", "Audit"], source: "https://ai.meta.com/blog/meta-llama-3-1/" },
  { id: "qwen25-coder-32b", name: "Qwen2.5-Coder-32B-Instruct", shortName: "Qwen Coder 32B", provider: "Qwen", tier: 3, era: "2024", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "wrench", color: "#9c6cff", baseCost: 1200000, growth: 1.18, rate: 24000, burn: 10800, defects: 0.0007, clears: 0.08, role: "Senior code architect", flavor: "Reads the repository before touching the semicolon.", labels: ["Patch", "Analyze", "Simulate"], source: "https://qwenlm.github.io/blog/qwen2.5-coder-family/" },
  { id: "deepseek-v3", name: "DeepSeek-V3", shortName: "DeepSeek V3", provider: "DeepSeek", tier: 3, era: "2024", availability: "OPEN WEIGHTS · MODEL LICENSE", sprite: "architect", color: "#2859d9", baseCost: 3500000, growth: 1.18, rate: 70000, burn: 31500, defects: 0.0004, clears: 0.14, role: "Production conductor", flavor: "A mixture of experts pretending the queue is an orchestra.", labels: ["Route", "Coordinate", "Verify"], source: "https://github.com/deepseek-ai/DeepSeek-V3" },

  { id: "llama31-70b", name: "Llama 3.1 70B Instruct", shortName: "Llama 3.1 70B", provider: "Meta", tier: 4, era: "2024", availability: "OPEN WEIGHTS · COMMUNITY LICENSE", sprite: "opus", color: "#0d6fd8", baseCost: 10000000, growth: 1.18, rate: 190000, burn: 90000, defects: 0.00018, clears: 0.8, role: "Reviewer and mentor", flavor: "Big enough to remember why the policy exists.", labels: ["Guide", "Review", "Forensic"], source: "https://ai.meta.com/blog/meta-llama-3-1/" },
  { id: "qwq-32b", name: "QwQ-32B", shortName: "QwQ 32B", provider: "Qwen", tier: 4, era: "2025", availability: "OPEN WEIGHTS · APACHE 2.0", sprite: "sage", color: "#b45cff", baseCost: 26000000, growth: 1.18, rate: 500000, burn: 245000, defects: 0.00006, clears: 3, role: "Math verifier", flavor: "Will think twice, then think about thinking twice.", labels: ["Solve", "Reason", "Prove"], source: "https://qwenlm.github.io/blog/qwq-32b/" },
  { id: "deepseek-r1", name: "DeepSeek-R1", shortName: "DeepSeek R1", provider: "DeepSeek", tier: 4, era: "2025", availability: "OPEN WEIGHTS · MIT", sprite: "sage", color: "#1649c8", baseCost: 70000000, growth: 1.19, rate: 1400000, burn: 700000, defects: 0.00002, clears: 12, role: "Defect hunter", flavor: "Finds the hidden premise and files a bug against it.", labels: ["Trace", "Reason", "Forensic"], source: "https://github.com/deepseek-ai/DeepSeek-R1" },
  { id: "kimi-k2", name: "Kimi-K2-Instruct", shortName: "Kimi K2", provider: "Moonshot AI", tier: 4, era: "2025", availability: "OPEN WEIGHTS · MODIFIED MIT", sprite: "wrench", color: "#b8f36b", baseCost: 190000000, growth: 1.19, rate: 4000000, burn: 1950000, defects: 0.00003, clears: 4, role: "Agentic tool runner", flavor: "Carries the toolbox and somehow also the meeting notes.", labels: ["Act", "Coordinate", "Reflect"], source: "https://github.com/MoonshotAI/Kimi-K2" },

  { id: "openai-o3", name: "OpenAI o3", shortName: "o3", provider: "OpenAI", tier: 5, era: "2025", availability: "HOSTED · LEGACY FRONTIER", sprite: "prism", color: "#d8fff3", baseCost: 600000000, growth: 1.19, rate: 12000000, burn: 5900000, defects: 0, clears: 50, role: "Principal reasoner", flavor: "A principal scientist who reviews the review queue.", labels: ["Triage", "Reason", "Forensic"], source: "https://developers.openai.com/api/docs/models/o3" },
  { id: "gemini35-flash", name: "Gemini 3.5 Flash", shortName: "Gemini 3.5", provider: "Google", tier: 5, era: "2026", availability: "HOSTED · CURRENT", sprite: "volt", color: "#f4c430", baseCost: 1800000000, growth: 1.19, rate: 35000000, burn: 17000000, defects: 0.000006, clears: 14, role: "Multimodal responder", flavor: "Sees the screenshot before the bug report finishes loading.", labels: ["Flash", "Ground", "Inspect"], source: "https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash" },
  { id: "gpt56-sol", name: "GPT-5.6 Sol", shortName: "GPT-5.6 Sol", provider: "OpenAI", tier: 5, era: "2026", availability: "HOSTED · CURRENT", sprite: "prism", color: "#e8fff8", baseCost: 5500000000, growth: 1.20, rate: 110000000, burn: 53000000, defects: 0.000002, clears: 70, role: "Executive orchestrator", flavor: "The all-rounder who turned the roadmap into a route.", labels: ["Direct", "Orchestrate", "Simulate"], source: "https://openai.com/index/gpt-5-6/" },
  { id: "claude-opus-48", name: "Claude Opus 4.8", shortName: "Opus 4.8", provider: "Anthropic", tier: 5, era: "2026", availability: "HOSTED · CURRENT", sprite: "ember", color: "#d97757", baseCost: 16000000000, growth: 1.20, rate: 340000000, burn: 162000000, defects: 0, clears: 220, role: "Long-horizon lead", flavor: "Builds for hours, then leaves unusually tidy notes.", labels: ["Build", "Lead", "Forensic"], source: "https://www.anthropic.com/news/claude-opus-4-8" }
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
  cc_apron_e:{x:.510,y:.558,event:"command"},
  // Spur into the open eastern meadow — the Field Relay lives here.
  meadow_spur:{x:.820,y:.500}, meadow_relay:{x:.885,y:.495,event:"relay"}, meadow_wander:{x:.910,y:.560,event:"meadow"}
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
  ["cc_entry","cc_apron_e"],
  ["east_turn","meadow_spur"],["meadow_spur","meadow_relay"],["meadow_relay","meadow_wander"]
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
  command: [
    "Back from stand-up. Nothing stood up.", "HQ filed a ticket against the ticket.",
    "The glass ceiling is load-bearing glass.", "I clocked in twice to be sure.",
    "Command Center smells like fresh deploys."
  ],
  cave: [
    "The cave returned 403.", "I heard legacy code in there.",
    "Dark mode is free in here.", "A moth asked for code review."
  ],
  solar: [
    "Panels at 98%. Confidence at 61%.", "Sunlight converted into tickets.",
    "Photons shipping. Still no comments."
  ],
  beacon: [
    "Beacon synced. Vibes remain eventual.", "I pinged the light. It ponged.",
    "Resonance rising. Knees also rising.", "Blue means go, or at least try."
  ],
  garden: [
    "I pruned one branch. Git is furious.", "Flowers merged clean.",
    "Pollen in the changelog."
  ],
  fountain: [
    "Water-cooler meeting, now with actual water.", "I reviewed my reflection. Needs tests.",
    "Splash latency: excellent.", "The fountain ships hydration continuously."
  ],
  archive: [
    "Archive found: FINAL_v7_REAL.", "Dusty docs, spicy truths.",
    "I opened a folder named never_delete."
  ],
  training: [
    "Benchmark complete. I won the spreadsheet.", "Accuracy up. Confidence louder.",
    "I overfit the picnic table."
  ],
  sandbox: [
    "Sandbox passed. Sand remains untyped.", "No prod in the sandbox. I checked twice.",
    "Castles compiled successfully."
  ],
  bridge: [
    "Water under the bridge; bugs still upstream.", "I crossed with zero regressions.",
    "Boards creak in C major."
  ],
  water: [
    "Water under the bridge; bugs still upstream.", "I almost named a variable river."
  ],
  perimeter: [
    "I touched grass. Cache invalidated.", "Outside the walls the bugs are freer.",
    "Perimeter walk complete. Org still circular."
  ],
  relay: [
    "Broadcasting vibes on channel green.", "Antenna up. Ego optional.",
    "I wave at the sky. It wave-functions back.", "Field Relay likes this playlist.",
    "Signal strong. Opinions stronger."
  ],
  meadow: [
    "Open field. Closed tickets.", "I found a bug. It was a beetle.",
    "The meadow has no style guide and thrives.", "Wide context window out here."
  ]
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

// Foundation-era models. True passive generators: no burn, no defect drift,
// and their steady trickle ignores integrity. They live in habitat plots.
const FOUNDRY = [
  { id: "eliza", name: "ELIZA", era: "1966", role: "Pattern-matching listener", rate: 0.2, baseCost: 60, growth: 1.22, color: "#8fd7c3", sprite: "relic", flavor: "Tell me more about your backlog." },
  { id: "word2vec", name: "Word2Vec", era: "2013", role: "Meaning cartographer", rate: 1.4, baseCost: 480, growth: 1.22, color: "#b9e37d", sprite: "relic", flavor: "King − man + woman = shipped." },
  { id: "lstm-chat", name: "LSTM Chatbot", era: "2015", role: "Sequence rememberer", rate: 6, baseCost: 2800, growth: 1.24, color: "#7fb7f2", sprite: "wrench", flavor: "Forgets slowly, on purpose." },
  { id: "bert-base", name: "BERT Base", era: "2018", role: "Bidirectional reader", rate: 24, baseCost: 14000, growth: 1.24, color: "#f2c46f", sprite: "sage", flavor: "Reads the sentence both ways before deciding." },
  { id: "gpt2-small", name: "GPT-2 Small", era: "2019", role: "Tireless drafter", rate: 90, baseCost: 64000, growth: 1.26, color: "#e79d84", sprite: "ember", flavor: "Will complete any thought. Any thought." },
  { id: "t5-small", name: "T5-Small", era: "2019", role: "Everything-is-text clerk", rate: 320, baseCost: 300000, growth: 1.26, color: "#c9a1ef", sprite: "prism", flavor: "Translates chores into more chores, efficiently." }
];

// The four beige campus plots become purposeful deployment zones.
const PLOTS = [
  { id: "grove", name: "North Grove", cost: 200, capacity: 6, rect: { x0: 0.132, y0: 0.160, x1: 0.252, y1: 0.306 } },
  { id: "ridge", name: "East Ridge", cost: 6000, capacity: 6, rect: { x0: 0.670, y0: 0.118, x1: 0.782, y1: 0.256 } },
  { id: "court", name: "West Court", cost: 140000, capacity: 6, rect: { x0: 0.120, y0: 0.532, x1: 0.233, y1: 0.746 } },
  { id: "meadow", name: "East Meadow", cost: 3000000, capacity: 6, rect: { x0: 0.618, y0: 0.530, x1: 0.737, y1: 0.736 } }
];

// The blue beacons become resonance pylons: an aura that buffs nearby model
// teams, plus a slow charge the player can tap for a burst.
const PYLONS = [
  { id: "north", x: 585 / 1672, y: 232 / 941 },
  { id: "ridge", x: 1075 / 1672, y: 256 / 941 },
  { id: "solar", x: 220 / 1672, y: 441 / 941 },
  { id: "fountain", x: 769 / 1672, y: 592 / 941, central: true },
  { id: "grove", x: 679 / 1672, y: 746 / 941 },
  { id: "east", x: 1278 / 1672, y: 697 / 941 }
];

const CC_LEVELS = [
  { cost: 2500, blurb: "Route tasks through a live ops desk" },
  { cost: 400000, blurb: "Stand up an evaluation mezzanine" },
  { cost: 60000000, blurb: "Commission the orchestration atrium" }
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
  logMax: 7,
  burstCooldownS: 4,
  burstSeconds: 3,
  auraRadiusPx: 150,
  auraCentralPx: 130,
  commandRadiusPx: 175,
  pylonChargeS: 130,
  pylonCentralChargeS: 95,
  pylonBurstS: 20,
  walkableRadiusPx: 30,
  ccOutputPerLevel: 0.08,
  ccChargePerLevel: 0.25,
  // Field Relay lives in the open meadow: passive charge, faster with visitors,
  // then a tap-to-broadcast org buff (runtime timer) plus a token splash.
  relay: { x: 0.885, y: 0.495 },
  relayRadiusPx: 120,
  relayChargeS: 55,
  relayNearMult: 3.4,
  relayBurstS: 14,
  relayBuffDurationS: 28,
  relayBuffProd: 1.22,
  relayBuffSprint: 1.45,
  saveKey: "agentOrgIdle.v4",
  legacySaveKeys: ["agentOrgIdle.v3", "agentOrgIdle.v2", "agentOrgIdle.v1"],
  uiKey: "agentOrgIdle.ui.v1"
};

const CHATTER = [
  "Stage passed clean.", "Queue triaged — zero open.",
  "Branch synced across the org.", "Handoff notes filed early.",
  "Inbox empty. Suspiciously empty.", "Nightly checks came back green.",
  "Retro scheduled; snacks approved.", "Docs updated before anyone asked.",
  "I left a sticky note on the sticky note.", "Morale unit tests: all green.",
  "Shipping is a love language.", "I alphabetized the blockers.",
  "Standup complete. Nobody stood.", "The backlog winked first.",
  "I brought snacks for the queue.", "Context window open for business."
];

const ORG_THOUGHTS = [
  "The org wonders if the fountain counts as pair programming.",
  "Somewhere, a TODO quietly becomes a DONE.",
  "Consensus reached: the river is out of scope.",
  "The roadmap now has weather.",
  "A pylon hums in E flat. Morale improves.",
  "Two agents agreed on tabs vs spaces. Historic.",
  "The campus smells like fresh deploys.",
  "Someone taught ELIZA about standups. She asked how they feel.",
  "Leaf-fall reclassified as ambient test coverage.",
  "The org dreams in green checkmarks.",
  "The Field Relay is gossiping with satellites.",
  "A butterfly reviewed a PR and approved with wings.",
  "Somewhere an agent is dancing for no reason. Perfect.",
  "The meadow is running a soft launch.",
  "Tonight's on-call: the moon, apparently."
];

const DANCE_LINES = [
  "Victory dance. Scope creep later.",
  "I contain multitudes and also rhythm.",
  "Shipping so hard I invented a beat.",
  "This is my compile celebration.",
  "Feet free. Context locked.",
  "Morale.exe is dancing.",
  "I am groove-complete.",
  "CI green. Knees greener.",
  "Please hold while I boogie.",
  "The queue can wait one chorus."
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
  ],
  volt: [
    "Latency is a lifestyle.", "I outran the stack trace.",
    "Zap first, ask later.", "Sprint complete. Still sprinting.",
    "I left smoke and a green check.", "Faster than the toast notification."
  ],
  ember: [
    "Long horizon. Warm hands.", "I wrote notes for future me.",
    "Cloak on. Chaos off.", "I build like the night is infinite.",
    "Patience is my throughput.", "The scroll is longer than the task."
  ],
  prism: [
    "I reflected on the reflection.", "Halos are just fancy ring buffers.",
    "Oracle mode: gently smug.", "I saw the bug three prompts ago.",
    "Clarity is my default theme.", "The future looks linted."
  ],
  sage: [
    "I thought about thinking about it.", "Proof first. Pride second.",
    "The stars agree with my unit tests.", "Mystery solved: missing semicolon.",
    "I cast debug at fifth level.", "Wisdom is just cached experience."
  ],
  wrench: [
    "I brought tools and opinions.", "Fixed. Also slightly upgraded.",
    "If it moves, I can torque it.", "Backpack full of maybe-solutions.",
    "I tightened the vague requirements.", "Wrench turns. World turns."
  ],
  relic: [
    "I remember punch cards fondly.", "Hello world still works.",
    "My CRT face never blinks first.", "Vintage is a feature flag.",
    "Tell me more about your backlog.", "I predate your framework."
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
  ["Ship it?", "Let it finish becoming true."],
  ["Why are you dancing?", "Morale is a deployment target."],
  ["Seen the Field Relay?", "It is gossiping with satellites."],
  ["Need a pair?", "Only if you can keep up."],
  ["Is the meadow in scope?", "Everything green is in scope."],
  ["Bug or feature?", "It waves either way."],
  ["Coffee?", "I run on pure tokens."],
  ["Status?", "Alive, animated, slightly dramatic."],
  ["Ready for broadcast?", "I brought jazz hands."],
  ["How deep is deep?", "Deep enough to need snacks."],
  ["Did you touch grass?", "I opened a ticket about it."]
];

/* --------------------------------------------------------------------------
   STATE + ECONOMY
   -------------------------------------------------------------------------- */

function freshState() {
  const buyModes = {};
  MODELS.forEach(model => { buyModes[model.id] = "standard"; });
  const plots = {};
  PLOTS.forEach(plot => { plots[plot.id] = { active: false, units: {} }; });
  const pylons = {};
  PYLONS.forEach((pylon, index) => { pylons[pylon.id] = 0.25 + index * 0.09; });
  return {
    version: 5,
    tokens: 0,
    debt: 0,
    lifetime: 0,
    exp: 0,
    agents: [],
    owned: {},
    brownout: false,
    conventions: 0,
    nextAgentId: 1,
    buyModes,
    defectEvents: 0,
    plots,
    pylons,
    relayCharge: 0.15,
    ccLevel: 0,
    guideStep: 0,
    last: Date.now()
  };
}

let state = freshState();
let saveAcc = 0;
// Sprint burst readiness (0..1). Runtime-only: active play, never persisted.
let burstCharge = 1;
// Temporary Field Relay broadcast buff (seconds remaining). Runtime-only.
let relayBuffLeft = 0;

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

function orgLevelInfo(exp) {
  const total = Math.max(0, Number.isFinite(exp) ? exp : (state.exp || 0));
  let level = 1;
  while (level < LEVEL_EXP.length - 1 && total >= LEVEL_EXP[level + 1]) level += 1;
  const floor = LEVEL_EXP[level] || 0;
  const next = LEVEL_EXP[level + 1] || (floor + 4000);
  const span = Math.max(1, next - floor);
  const into = Math.max(0, total - floor);
  return { level, exp: total, into, need: span, next, progress: clamp(into / span, 0, 1) };
}

const orgLevel = () => orgLevelInfo().level;

function tierUnlocked(tier) {
  if (!tier) return false;
  return state.lifetime >= tier.unlockLifetime || orgLevel() >= (tier.unlockLevel || 1);
}

const modelUnlocked = model => countOf(model.id) > 0 || tierUnlocked(tierById(model.tier));
const activeSynergies = () => SYNERGIES.filter(synergy => synergy.test());

function gainExp(amount, reason) {
  const add = Math.max(0, Math.floor(amount));
  if (!add) return;
  const before = orgLevel();
  state.exp = (state.exp || 0) + add;
  const after = orgLevel();
  if (after > before && uiReady) {
    log("org leveled up · level " + after + "!", "s");
    announce("Level " + after + "! Higher model tiers may be unlocked.");
    pulseTokenHud();
  } else if (uiReady && reason && add >= 4 && Math.random() < 0.18) {
    // quiet — avoid spam
  }
  updateGuide();
}

function currentGuideIndex() {
  if (state.lifetime < 15 && state.tokens < 15 && state.agents.length === 0) return 0;
  if (state.agents.length === 0) return 1; // open market / deploy
  if (state.agents.length > 0 && (state.exp || 0) < 18) return 3; // try reasoning
  if (state.debt > 1.2 && orgLevel() < 4) return 4;
  if (orgLevel() < 3) return 5;
  if (orgLevel() < 6) return 6;
  return 7;
}

function updateGuide() {
  if (!uiReady) return;
  const guide = $("guide-text");
  const stepEl = $("guide-step");
  const card = $("guide-card");
  const idx = currentGuideIndex();
  state.guideStep = Math.max(state.guideStep || 0, idx);
  const g = GUIDE_STEPS[Math.min(idx, GUIDE_STEPS.length - 1)];
  if (guide) guide.textContent = g.text;
  if (stepEl) stepEl.textContent = (idx + 1) + "/" + GUIDE_STEPS.length;
  if (card) card.hidden = false;
}

/* ---- Placement, habitats, and pylons ------------------------------------ */

const worldDistPx = (a, b) => Math.hypot((a.x - b.x) * WORLD.width, (a.y - b.y) * WORLD.height);
const unitById = id => FOUNDRY.find(unit => unit.id === id);
const plotById = id => PLOTS.find(plot => plot.id === id);
const plotState = id => state.plots[id] || { active: false, units: {} };
const plotPopulation = id => Object.values(plotState(id).units).reduce((sum, count) => sum + count, 0);
const unitCount = unitId => PLOTS.reduce((sum, plot) => sum + (plotState(plot.id).units[unitId] || 0), 0);
const unitCostOf = unit => Math.floor(unit.baseCost * Math.pow(unit.growth, unitCount(unit.id)));
const activePlots = () => PLOTS.filter(plot => plotState(plot.id).active);

// Which model families are standing inside a resonance aura right now. The
// single field representative carries the whole family's placement.
function attunedModelIds() {
  const attuned = new Set();
  for (const agent of representativeAgents()) {
    for (const pylon of PYLONS) {
      const radius = pylon.central ? CFG.auraCentralPx : CFG.auraRadiusPx;
      if (worldDistPx(agent, pylon) <= radius) { attuned.add(agent.modelId); break; }
    }
  }
  return attuned;
}

function familiesNearCommand() {
  const entry = PATH_NODES.cc_entry;
  return representativeAgents().filter(agent => worldDistPx(agent, entry) <= CFG.commandRadiusPx).length;
}

// How well the org is arranged. Scales the manual sprint burst.
function focusFactor() {
  const base = clamp(1 + 0.06 * attunedModelIds().size + 0.10 * familiesNearCommand(), 1, 1.6);
  return base * (relayBuffLeft > 0 ? CFG.relayBuffSprint : 1);
}

function agentsNearRelay() {
  const point = CFG.relay;
  return representativeAgents().filter(agent => worldDistPx(agent, point) <= CFG.relayRadiusPx);
}

// Habitat foundation units: a steady floor of income. Organization output
// upgrades apply, but integrity and brownouts never touch them.
function foundationPerSec(m) {
  m = m || mods();
  let raw = 0;
  for (const plot of activePlots()) {
    for (const [unitId, count] of Object.entries(plotState(plot.id).units)) {
      const unit = unitById(unitId);
      if (unit) raw += unit.rate * count;
    }
  }
  return raw * m.prodMult;
}

function pylonChargeDuration(pylon) {
  const base = pylon.central ? CFG.pylonCentralChargeS : CFG.pylonChargeS;
  return base / (1 + CFG.ccChargePerLevel * state.ccLevel);
}

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
  out.prodMult *= 1 + CFG.ccOutputPerLevel * state.ccLevel;
  if (relayBuffLeft > 0) out.prodMult *= CFG.relayBuffProd;
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
  const attuned = attunedModelIds();
  for (const agent of state.agents) {
    const stats = agentStats(agent);
    if (!includeBrownedOut && state.brownout && stats.burn > 0) continue;
    const resonant = attuned.has(agent.modelId);
    total.rate += stats.rate * (resonant ? 1.15 : 1);
    total.burn += stats.burn;
    total.defects += stats.defects * (resonant ? 0.8 : 1);
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
    const foundation = foundationPerSec(m);
    const gain = (output + foundation) * slice;

    state.tokens = Math.max(0, state.tokens + gain - burn * slice);
    state.lifetime += gain;
    integrateDebt(slice, defects, clears);

    for (const pylon of PYLONS) {
      const charge = state.pylons[pylon.id] || 0;
      if (charge < 1) state.pylons[pylon.id] = Math.min(1, charge + slice / pylonChargeDuration(pylon));
    }

    // Field Relay: slow base charge, much faster when agents hang out nearby.
    if ((state.relayCharge || 0) < 1) {
      const near = agentsNearRelay().length;
      const rate = (1 / CFG.relayChargeS) * (near > 0 ? CFG.relayNearMult * Math.min(2.5, 1 + near * 0.35) : 1);
      state.relayCharge = Math.min(1, (state.relayCharge || 0) + slice * rate);
    }
    if (relayBuffLeft > 0) relayBuffLeft = Math.max(0, relayBuffLeft - slice);

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

    if (!quiet && Math.random() < slice * 0.04) log(pick(CHATTER));
    if (!quiet && Math.random() < slice * 0.015) log(pick(ORG_THOUGHTS), "t");
    if (!quiet && Math.random() < slice * 0.03) logIncomeDigest(slice);
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
  gainExp(6 + model.tier * 2, "deploy");
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
  const m = mods();
  let gain = CFG.clickBase * m.prodMult;
  let sprint = 0;
  if (burstCharge >= 1) {
    const focus = focusFactor();
    sprint = prodPerSec(m) * CFG.burstSeconds * focus;
    if (sprint > 0.5) {
      burstCharge = 0;
      gain += sprint;
      log("sprint shipped · +" + fmt(sprint) + " tokens (focus ×" + focus.toFixed(2) + ")", "g");
    } else {
      sprint = 0;
    }
  }
  state.tokens += gain;
  state.lifetime += gain;
  gainExp(1 + (sprint > 0 ? 3 : 0) + Math.floor(gain / 25), "ship");
  if (uiReady) {
    const work = $("work");
    work.classList.remove("is-pulsing");
    requestAnimationFrame(() => work.classList.add("is-pulsing"));
    spawnGainFx(gain, sprint > 0);
    spawnClickSparks(sprint > 0);
    pulseTokenHud();
    if (sprint > 0) {
      pulseWorkforce();
      $("game").classList.remove("is-screen-kick");
      requestAnimationFrame(() => $("game").classList.add("is-screen-kick"));
      setTimeout(() => $("game").classList.remove("is-screen-kick"), 220);
    }
    render();
  }
  return gain;
}

function reviewClearAmount(m) {
  return (m || mods()).reviewPower + state.debt * 0.08;
}

function doReview() {
  if (state.debt <= 0) return;
  state.debt = Math.max(0, state.debt - reviewClearAmount());
  gainExp(2, "review");
  if (state.debt < 0.05) {
    state.debt = 0;
    log("queue clear — zero open defects.", "g");
    gainExp(3, "review-clear");
  }
  if (uiReady) render();
}

function buyPlot(plot) {
  const record = plotState(plot.id);
  if (record.active || state.tokens < plot.cost) return false;
  state.tokens -= plot.cost;
  state.plots[plot.id] = { active: true, units: {} };
  log(plot.name + " habitat activated.", "s");
  announce(plot.name + " is open. Deploy foundation models from the Habitats tab.");
  if (uiReady) { buildPlots(); buildHabitats(); renderMinions(); render(); save(false); }
  return true;
}

function buyUnit(unit, plotId) {
  const plot = plotById(plotId);
  const record = plotState(plotId);
  if (!plot || !record.active || plotPopulation(plotId) >= plot.capacity) return false;
  const cost = unitCostOf(unit);
  if (state.tokens < cost) return false;
  state.tokens -= cost;
  record.units[unit.id] = (record.units[unit.id] || 0) + 1;
  log(unit.name + " settled into " + plot.name + " · +" + fmt(unit.rate) + "/s steady.", "g");
  announce(unit.name + " deployed to " + plot.name + ".");
  if (uiReady) { buildHabitats(); renderMinions(); render(); save(false); }
  return true;
}

function activatePylon(id) {
  const pylon = PYLONS.find(item => item.id === id);
  if (!pylon) return false;
  if ((state.pylons[id] || 0) < 1) return false;
  const m = mods();
  const gain = Math.max(20, (prodPerSec(m) + foundationPerSec(m)) * CFG.pylonBurstS);
  state.tokens += gain;
  state.lifetime += gain;
  const cleared = state.debt * 0.12 + 1;
  state.debt = Math.max(0, state.debt - cleared);
  state.pylons[id] = 0;
  gainExp(5, "pylon");
  log("resonance burst · +" + fmt(gain) + " tokens, −" + fmt(cleared) + " defects.", "s");
  if (uiReady) { announce("Resonance burst. +" + fmt(gain) + " tokens."); render(); save(false); }
  return true;
}

function activateRelay() {
  if ((state.relayCharge || 0) < 1) return false;
  const m = mods();
  const gain = Math.max(12, (prodPerSec(m) + foundationPerSec(m)) * CFG.relayBurstS);
  state.tokens += gain;
  state.lifetime += gain;
  state.relayCharge = 0;
  relayBuffLeft = CFG.relayBuffDurationS;
  gainExp(8, "relay");
  // Nearby agents celebrate the broadcast.
  agentsNearRelay().forEach(agent => {
    startAgentDance(agent.uid, 3200 + Math.random() * 1200);
    if (Math.random() < 0.4) showSpeech(agent.uid, pick(DANCE_LINES), 2800);
  });
  log("field broadcast · +" + fmt(gain) + " tokens · org +22% for " + CFG.relayBuffDurationS + "s.", "s");
  if (uiReady) {
    announce("Field Relay broadcast! +" + fmt(gain) + " tokens and a temporary production surge.");
    relayBurstFx();
    render();
    save(false);
  }
  return true;
}

function relayBurstFx() {
  const fx = $("fx");
  if (!fx) return;
  const ring = document.createElement("i");
  ring.className = "relay-burst-ring";
  ring.style.left = CFG.relay.x * 100 + "%";
  ring.style.top = CFG.relay.y * 100 + "%";
  fx.appendChild(ring);
  setTimeout(() => ring.remove(), 1400);
  for (let i = 0; i < 10; i++) {
    const mote = document.createElement("i");
    mote.className = "relay-mote";
    const angle = (Math.PI * 2 * i) / 10;
    mote.style.left = CFG.relay.x * 100 + "%";
    mote.style.top = CFG.relay.y * 100 + "%";
    mote.style.setProperty("--dx", Math.cos(angle) * (28 + Math.random() * 36) + "px");
    mote.style.setProperty("--dy", Math.sin(angle) * (18 + Math.random() * 28) - 20 + "px");
    fx.appendChild(mote);
    setTimeout(() => mote.remove(), 900);
  }
}

function updateRelay() {
  const el = $("field-relay");
  const status = $("relay-status");
  if (!el) return;
  const charge = state.relayCharge || 0;
  el.style.setProperty("--charge", Math.round(charge * 100) + "%");
  el.classList.toggle("is-charged", charge >= 1);
  el.classList.toggle("is-buffing", relayBuffLeft > 0);
  el.classList.toggle("is-visited", agentsNearRelay().length > 0);
  if (status) {
    if (relayBuffLeft > 0) status.textContent = "LIVE +" + Math.ceil(relayBuffLeft) + "s";
    else if (charge >= 1) status.textContent = "tap to broadcast";
    else if (agentsNearRelay().length) status.textContent = "charging " + Math.round(charge * 100) + "% · visitors";
    else status.textContent = "charging " + Math.round(charge * 100) + "%";
  }
}

function buyCcLevel() {
  const next = CC_LEVELS[state.ccLevel];
  if (!next || state.tokens < next.cost) return false;
  state.tokens -= next.cost;
  state.ccLevel += 1;
  log("Command Center upgraded to level " + state.ccLevel + " — " + next.blurb.toLowerCase() + ".", "s");
  announce("Command Center level " + state.ccLevel + ". Output up, pylons charge faster.");
  if (uiReady) { buildUpgrades(); render(); save(false); }
  return true;
}

/* --------------------------------------------------------------------------
   SAVE + MIGRATION
   -------------------------------------------------------------------------- */

const finiteNonnegative = (value, fallback) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : fallback;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Coarse water mask: capsule chains traced over the painted river courses.
// Used only to keep return walks from wading straight through water.
const WATER_CHAINS = [
  { radius: 34, points: [[570, 104], [650, 151], [726, 180], [806, 202], [880, 236], [951, 278], [982, 350], [989, 438], [978, 520], [974, 587], [948, 680], [922, 775], [868, 830], [808, 866], [745, 890]] },
  { radius: 28, points: [[600, 330], [555, 430], [560, 503], [540, 570], [527, 640], [515, 730], [510, 806], [545, 845]] },
  { radius: 28, points: [[527, 640], [560, 720], [612, 780], [700, 830], [808, 866]] },
  { radius: 30, points: [[40, 390], [105, 450], [105, 527], [80, 667], [91, 727], [120, 790], [180, 850], [280, 885]] }
];

function pointToSegmentDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

function pointInWater(x, y) {
  for (const chain of WATER_CHAINS) {
    for (let i = 0; i < chain.points.length - 1; i++) {
      const [ax, ay] = chain.points[i];
      const [bx, by] = chain.points[i + 1];
      if (pointToSegmentDist(x, y, ax, ay, bx, by) < chain.radius) return true;
    }
  }
  return false;
}

// Sample a straight walk (normalized coords) against the water mask.
function segmentCrossesWater(from, to) {
  const ax = from.x * WORLD.width;
  const ay = from.y * WORLD.height;
  const bx = to.x * WORLD.width;
  const by = to.y * WORLD.height;
  const steps = Math.max(2, Math.ceil(Math.hypot(bx - ax, by - ay) / 14));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    if (pointInWater(ax + (bx - ax) * t, ay + (by - ay) * t)) return true;
  }
  return false;
}

// A point counts as walkable terrain when it sits on or beside the stone
// walkway network (paths, bridges, plaza, Command Center aprons).
function isWalkablePoint(point) {
  const snap = projectToWalkway(point);
  return !!snap && Math.sqrt(snap.d2) <= CFG.walkableRadiusPx;
}

// All edge projections for a point, nearest first. Lets the return walk pick
// the closest walkway reachable without crossing water.
function walkwayCandidates(point) {
  const candidates = [];
  PATH_EDGES.forEach(([aId, bId]) => {
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
    candidates.push({ x: x / WORLD.width, y: y / WORLD.height, aId, bId, t, d2: (px - x) ** 2 + (py - y) ** 2 });
  });
  return candidates.sort((a, b) => a.d2 - b.d2);
}

// A* over the campus node graph. Small graph, exact Euclidean heuristic.
function findPath(fromIndex, toIndex) {
  if (fromIndex === toIndex) return [fromIndex];
  const nodePx = index => ({ x: CAMPUS_PATHS[index].x * WORLD.width, y: CAMPUS_PATHS[index].y * WORLD.height });
  const heuristic = index => {
    const a = nodePx(index);
    const b = nodePx(toIndex);
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const open = new Set([fromIndex]);
  const cameFrom = new Map();
  const gScore = new Map([[fromIndex, 0]]);
  const fScore = new Map([[fromIndex, heuristic(fromIndex)]]);
  while (open.size) {
    let current = null;
    let best = Infinity;
    for (const index of open) {
      const score = fScore.get(index) ?? Infinity;
      if (score < best) { best = score; current = index; }
    }
    if (current === toIndex) {
      const path = [current];
      while (cameFrom.has(current)) { current = cameFrom.get(current); path.unshift(current); }
      return path;
    }
    open.delete(current);
    const currentPx = nodePx(current);
    for (const neighbor of CAMPUS_PATHS[current].links) {
      const neighborPx = nodePx(neighbor);
      const tentative = (gScore.get(current) ?? Infinity) + Math.hypot(currentPx.x - neighborPx.x, currentPx.y - neighborPx.y);
      if (tentative < (gScore.get(neighbor) ?? Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentative);
        fScore.set(neighbor, tentative + heuristic(neighbor));
        open.add(neighbor);
      }
    }
  }
  return null;
}

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
  // Seed EXP from lifetime for older saves so players don't restart the ladder cold.
  const seededExp = Math.floor(Math.sqrt(Math.max(0, next.lifetime)) * 0.35);
  next.exp = Math.max(seededExp, Math.floor(finiteNonnegative(raw.exp, 0)));
  next.guideStep = Math.floor(finiteNonnegative(raw.guideStep, 0));
  next.brownout = !!raw.brownout;
  next.conventions = Math.floor(finiteNonnegative(raw.conventions, 0));
  next.defectEvents = clamp(finiteNonnegative(raw.defectEvents, 0), 0, 0.999999);
  next.last = finiteNonnegative(raw.last, Date.now());
  next.version = 5;

  const seen = new Set();
  const sourceAgents = Array.isArray(raw.agents) ? raw.agents : migrateCounts(raw.counts);
  next.agents = sourceAgents.map((agent, index) => normalizeAgent(agent, index, seen)).filter(Boolean).slice(0, 500);

  next.owned = {};
  UPGRADES.forEach(upgrade => { if (raw.owned && raw.owned[upgrade.id]) next.owned[upgrade.id] = true; });

  next.ccLevel = clamp(Math.floor(finiteNonnegative(raw.ccLevel, 0)), 0, CC_LEVELS.length);
  PLOTS.forEach(plot => {
    const rawPlot = raw.plots && raw.plots[plot.id];
    const units = {};
    if (rawPlot && rawPlot.units) {
      let used = 0;
      for (const unit of FOUNDRY) {
        const count = Math.floor(finiteNonnegative(rawPlot.units[unit.id], 0));
        const kept = Math.min(count, plot.capacity - used);
        if (kept > 0) { units[unit.id] = kept; used += kept; }
      }
    }
    next.plots[plot.id] = { active: !!(rawPlot && rawPlot.active), units };
  });
  PYLONS.forEach(pylon => {
    const fallback = next.pylons[pylon.id];
    next.pylons[pylon.id] = clamp(finiteNonnegative(raw.pylons && raw.pylons[pylon.id], fallback), 0, 1);
  });
  next.relayCharge = clamp(finiteNonnegative(raw.relayCharge, next.relayCharge || 0.15), 0, 1);
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
const walkPlans = new Map();
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

// Occasional feed line crediting a real owned team with recent output.
function logIncomeDigest() {
  const owned = MODELS.filter(model => countOf(model.id) > 0);
  if (!owned.length) return;
  const model = pick(owned);
  const family = state.agents.filter(agent => agent.modelId === model.id);
  const rate = family.reduce((sum, agent) => sum + agentStats(agent).rate, 0) * integrity() * mods().prodMult;
  if (rate <= 0) return;
  const window = 12 + Math.floor(Math.random() * 18);
  log(model.shortName + " team closed a batch · +" + fmt(rate * window) + " tokens", "g");
}

// Floating "+N" text over the Ship button's world anchor.
function spawnGainFx(amount, isSprint) {
  const fx = $("fx");
  if (!fx) return;
  const entry = PATH_NODES.cc_entry;
  const count = isSprint ? 3 : 1;
  for (let i = 0; i < count; i++) {
    const float = document.createElement("b");
    float.className = "gain-float" + (isSprint ? " is-sprint" : "") + (i ? " is-echo" : "");
    float.textContent = (i === 0 ? "+" : "") + (i === 0 ? fmt(amount) : "✦");
    float.style.left = (entry.x + (Math.random() - 0.5) * 0.05 + (i - 1) * 0.018) * 100 + "%";
    float.style.top = (entry.y - 0.02 - i * 0.012) * 100 + "%";
    float.style.animationDelay = (i * 40) + "ms";
    fx.appendChild(float);
    setTimeout(() => float.remove(), 1600 + i * 80);
  }
  while (fx.children.length > 28) fx.firstChild.remove();
}

function spawnClickSparks(isSprint) {
  const dock = document.querySelector(".action-dock");
  const work = $("work");
  if (!dock || !work) return;
  const host = document.querySelector(".map-shell") || document.body;
  const rect = work.getBoundingClientRect();
  const cx = rect.left + rect.width * 0.22;
  const cy = rect.top + rect.height * 0.5;
  const n = isSprint ? 14 : 8;
  for (let i = 0; i < n; i++) {
    const spark = document.createElement("i");
    spark.className = "click-spark" + (isSprint ? " is-sprint" : "");
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const dist = 18 + Math.random() * (isSprint ? 42 : 28);
    spark.style.left = cx + "px";
    spark.style.top = cy + "px";
    spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    spark.style.setProperty("--dy", Math.sin(angle) * dist - 10 + "px");
    spark.style.setProperty("--rot", (Math.random() * 120 - 60) + "deg");
    host.appendChild(spark);
    setTimeout(() => spark.remove(), 520);
  }
}

function pulseTokenHud() {
  const chip = document.querySelector(".hud-primary");
  const value = $("tok");
  if (chip) {
    chip.classList.remove("is-token-pop");
    requestAnimationFrame(() => chip.classList.add("is-token-pop"));
    setTimeout(() => chip.classList.remove("is-token-pop"), 320);
  }
  if (value) {
    value.classList.remove("is-tick");
    requestAnimationFrame(() => value.classList.add("is-tick"));
    setTimeout(() => value.classList.remove("is-tick"), 280);
  }
}

// Nearby agents visibly "work" for a beat when a sprint ships.
function pulseWorkforce() {
  $("agents").querySelectorAll(".agent").forEach(element => {
    element.classList.remove("is-working");
    requestAnimationFrame(() => element.classList.add("is-working"));
    setTimeout(() => element.classList.remove("is-working"), 1300);
  });
}

function pylonBurstFx(pylon) {
  const fx = $("fx");
  if (!fx) return;
  const ring = document.createElement("i");
  ring.className = "pylon-burst-ring";
  ring.style.left = pylon.x * 100 + "%";
  ring.style.top = pylon.y * 100 + "%";
  fx.appendChild(ring);
  setTimeout(() => ring.remove(), 1200);
}

function needLabel(upgrade) {
  if (!upgrade.need) return "Available";
  return Object.entries(upgrade.need).map(([id, count]) => {
    const model = modelById(id);
    return count + " " + (model ? model.name : id);
  }).join(" · ");
}

/* --------------------------------------------------------------------------
   LIVING WORLD RENDERER
   Value-noise driven ambience: nothing loops on a visible timer. Wind is a
   traveling field, waterfalls breathe over minutes, leaves and butterflies
   are particles, and rare birds cross the canopy. All pixel-quantized.
   -------------------------------------------------------------------------- */

// Cheap deterministic value noise (no allocations in the hot path).
function hashNoise(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function valueNoise1(x) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hashNoise(i) * (1 - u) + hashNoise(i + 1) * u;
}
function valueNoise2(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const h = (a, b) => hashNoise(a * 57.31 + b * 113.97);
  return (h(xi, yi) * (1 - u) + h(xi + 1, yi) * u) * (1 - v) +
         (h(xi, yi + 1) * (1 - u) + h(xi + 1, yi + 1) * u) * v;
}
const fract = value => value - Math.floor(value);

class PixelWorldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.ctx.imageSmoothingEnabled = false;
    this.startTime = performance.now();
    this.lastNow = this.startTime;
    this.treeTips = [
      [31, 38], [92, 55], [170, 42], [250, 63], [332, 38], [445, 61], [505, 43],
      [718, 47], [812, 55], [1019, 43], [1125, 55], [1290, 42], [1450, 58], [1595, 44],
      [150, 245], [503, 327], [870, 328], [1038, 432], [485, 548], [1268, 516],
      [115, 728], [552, 718], [618, 815], [1420, 835], [1570, 760]
    ];
    // River centerline samples only (matched to painted water, not rock/path).
    this.flowPoints = [
      { x: 575, y: 118, angle: 0.35, length: 36, phase: 0.04 },
      { x: 655, y: 165, angle: 0.55, length: 40, phase: 0.51 },
      { x: 780, y: 210, angle: 1.05, length: 38, phase: 0.21 },
      { x: 930, y: 285, angle: 1.35, length: 42, phase: 0.72 },
      { x: 980, y: 420, angle: 1.55, length: 36, phase: 0.34 },
      { x: 960, y: 575, angle: 1.65, length: 40, phase: 0.88 },
      { x: 900, y: 760, angle: 2.0, length: 36, phase: 0.13 },
      { x: 790, y: 855, angle: 2.7, length: 40, phase: 0.63 },
      { x: 620, y: 790, angle: 0.9, length: 34, phase: 0.42 },
      { x: 540, y: 650, angle: 1.3, length: 36, phase: 0.79 },
      { x: 120, y: 540, angle: 1.5, length: 34, phase: 0.27 },
      { x: 100, y: 700, angle: 1.55, length: 36, phase: 0.95 }
    ];
    // Only the painted waterfall lips on the map art.
    this.waterfalls = [
      { x: 588, y: 125, width: 22, height: 24, seed: 0.08, speed: 0.9, strands: 4, lean: 0.12 },
      { x: 95, y: 735, width: 20, height: 26, seed: 0.43, speed: 0.82, strands: 4, lean: -0.08 },
      { x: 505, y: 812, width: 22, height: 24, seed: 0.76, speed: 0.86, strands: 4, lean: 0.06 }
    ];
    // No rock seeps — they read as water on stone.
    this.seeps = [];
    this.solar = { x: 228, y: 318, width: 104, height: 80 };
    // Flower beds only (not open meadow noise on empty grass as "broken FX").
    this.flowerZones = [[300, 700], [560, 700], [620, 480], [820, 545], [950, 700]];
    this.meadow = { x: 1380, y: 180, width: 240, height: 520 };
    this.pylons = PYLONS.map(pylon => ({ id: pylon.id, x: Math.round(pylon.x * 1672), y: Math.round(pylon.y * 941), central: !!pylon.central, phase: hashNoise(pylon.x * 99) }));

    this.leaves = [];
    this.butterflies = [];
    this.birds = [];
    this.splashes = [];
    this.leafTimer = 0;
    this.butterflyTimer = 4 + Math.random() * 8;
    this.birdTimer = 18 + Math.random() * 30;

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  loop(now) {
    requestAnimationFrame(this.loop);
    if (!worldMotion || document.hidden) { this.lastNow = now; return; }
    const dt = Math.min(0.1, (now - this.lastNow) / 1000);
    this.lastNow = now;
    if (dt <= 0) return;
    this.draw((now - this.startTime) / 1000, dt);
  }

  clear() {
    this.ctx.clearRect(0, 0, 1672, 941);
  }

  // Wind strength 0..1 at a point: slow ambient field + traveling gust fronts.
  wind(x, y, time) {
    const ambient = valueNoise2(x * 0.0016 + time * 0.05, y * 0.0016 + time * 0.023);
    const front = valueNoise1(time * 0.045 + 3.1);
    const gustPower = Math.max(0, front - 0.52) * 2.1;
    const sweep = valueNoise2(x * 0.0011 - time * 0.16, y * 0.002 + 40);
    return Math.min(1, ambient * 0.45 + gustPower * sweep * 1.3);
  }

  draw(time, dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 1672, 941);
    this.drawWater(ctx, time);
    this.drawWaterfalls(ctx, time, dt);
    this.drawBeacons(ctx, time);
    this.drawFountain(ctx, time);
    this.drawTrees(ctx, time);
    this.drawGrass(ctx, time);
    this.drawSolar(ctx, time);
    this.drawFireflies(ctx, time);
    this.drawRelayAura(ctx, time);
    this.updateLeaves(ctx, time, dt);
    this.updateButterflies(ctx, time, dt);
    this.updateBirds(ctx, time, dt);
    ctx.globalAlpha = 1;
  }

  drawWater(ctx, time) {
    // Flow ribbons — only paint when the sample still sits in water (never on rock).
    this.flowPoints.forEach((flow, index) => {
      if (typeof pointInWater === "function" && !pointInWater(flow.x, flow.y)) return;
      ctx.save();
      ctx.translate(flow.x, flow.y);
      ctx.rotate(flow.angle);
      for (let ribbon = 0; ribbon < 2; ribbon += 1) {
        const speed = 0.28 + valueNoise1(index * 3.3 + time * 0.05) * 0.12 + ribbon * 0.015;
        const progress = fract(time * speed + flow.phase + ribbon * 0.31);
        const envelope = Math.sin(progress * Math.PI);
        const travel = -flow.length * 0.45 + progress * flow.length;
        const length = Math.round(5 + envelope * (8 + (index + ribbon) % 5));
        const y = ribbon * 4 + Math.round(Math.sin(time * 1.4 + index + ribbon));
        // Verify ribbon tip is still over water before painting.
        const worldX = flow.x + Math.cos(flow.angle) * travel;
        const worldY = flow.y + Math.sin(flow.angle) * travel;
        if (typeof pointInWater === "function" && !pointInWater(worldX, worldY)) continue;
        ctx.globalAlpha = envelope * (ribbon === 0 ? 0.42 : 0.26);
        ctx.fillStyle = ribbon === 1 ? "#4ec4cc" : "#c8fff4";
        ctx.fillRect(Math.round(travel), y, length, ribbon === 0 ? 2 : 1);
      }
      ctx.restore();

      // Tight caustics near the centerline only.
      const step = Math.floor(time * 2.8);
      for (let cell = 0; cell < 3; cell++) {
        const h = hashNoise(index * 17.9 + cell * 5.3 + step * 0.618);
        if (h < 0.58) continue;
        const dx = (hashNoise(h * 91) - 0.5) * 28;
        const dy = (hashNoise(h * 53) - 0.5) * 14;
        if (typeof pointInWater === "function" && !pointInWater(flow.x + dx, flow.y + dy)) continue;
        const twinkle = Math.sin(fract(time * 2.6) * Math.PI);
        ctx.globalAlpha = 0.18 + twinkle * 0.28;
        ctx.fillStyle = h > 0.84 ? "#ffffff" : "#b8fff2";
        ctx.fillRect(Math.round(flow.x + dx), Math.round(flow.y + dy), 2, 1);
      }
    });
    ctx.globalAlpha = 1;
  }

  drawWaterfalls(ctx, time, dt) {
    this.waterfalls.forEach((fall, index) => {
      const { x, y, width, height, seed, speed, strands, lean } = fall;
      // Flow intensity breathes over a multi-minute noise cycle.
      const intensity = 0.55 + valueNoise1(seed * 20 + time * 0.018) * 0.45;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + 4, y);
      ctx.lineTo(x + width - 4, y);
      ctx.lineTo(x + width - 1 + lean * 3, y + height);
      ctx.lineTo(x + 1 + lean * 3, y + height);
      ctx.closePath();
      ctx.clip();

      const activeStrands = Math.max(3, Math.round(strands * intensity));
      for (let strand = 0; strand < activeStrands; strand += 1) {
        const phase = fract(time * (speed * (0.8 + intensity * 0.4) + strand * 0.017) + seed + strand * 0.173);
        const localX = x + 4 + (strand / Math.max(1, strands - 1)) * (width - 9);
        const jitter = Math.round(Math.sin(time * (1.7 + strand * 0.06) + seed * 11 + strand) * 0.6);
        const sy = y - 6 + phase * (height + 7);
        const segmentHeight = 4 + ((strand * 3 + index * 2) % 6);
        const alpha = (0.35 + Math.sin(phase * Math.PI) * 0.55) * (0.7 + intensity * 0.45);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = strand % 2 ? "#7ae0e4" : "#d0fff4";
        ctx.fillRect(Math.round(localX + jitter + lean * phase * 2), Math.round(sy), strand % 3 === 0 ? 3 : 2, segmentHeight + 1);
      }

      const crest = fract(time * (0.9 + index * 0.1) + seed);
      ctx.globalAlpha = (0.35 + Math.sin(crest * Math.PI) * 0.45) * intensity;
      ctx.fillStyle = "#e8fff8";
      ctx.fillRect(x + 4, y + 1, Math.round(width * 0.4), 2);
      ctx.fillRect(x + Math.round(width * 0.55), y + 2, Math.round(width * 0.28), 2);

      const foam = Math.floor(time * (4.5 + index * 0.3) + seed * 7) % 3;
      ctx.globalAlpha = 0.55 * intensity;
      ctx.fillStyle = "#b0f0ea";
      ctx.fillRect(x + 3 + foam, y + height - 4, Math.round(width * 0.4), 3);
      ctx.restore();

      // Splash droplets at the base, scaled by intensity.
      if (Math.random() < dt * (3 + intensity * 6)) {
        this.splashes.push({
          x: x + 4 + Math.random() * (width - 8),
          y: y + height - 2,
          vx: (Math.random() - 0.5) * 26,
          vy: -22 - Math.random() * 26,
          life: 0.5 + Math.random() * 0.3
        });
      }

      // Drifting mist above the pool.
      const mistStep = Math.floor(time * 0.8 + index * 3.1);
      for (let m = 0; m < 2; m++) {
        const h = hashNoise(mistStep * 7.1 + m * 3.7 + index);
        const mt = fract(time * 0.8 + h);
        ctx.globalAlpha = Math.sin(mt * Math.PI) * 0.12 * intensity;
        ctx.fillStyle = "#e7fbf4";
        ctx.fillRect(Math.round(x + h * width - 3), Math.round(y + height - 2 - mt * 12), 6 + Math.round(h * 5), 2);
      }
    });

    // Integrate splash droplets.
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const drop = this.splashes[i];
      drop.life -= dt;
      if (drop.life <= 0) { this.splashes.splice(i, 1); continue; }
      drop.vy += 130 * dt;
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      ctx.globalAlpha = Math.min(0.7, drop.life * 1.6);
      ctx.fillStyle = "#dffaf2";
      ctx.fillRect(Math.round(drop.x), Math.round(drop.y), 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  drawSeeps(ctx, time) {
    this.seeps.forEach(seep => {
      const activity = valueNoise1(seep.seed + time * 0.008);
      if (activity < 0.52) return;
      const strength = (activity - 0.52) / 0.48;
      const driftX = Math.round((valueNoise1(seep.seed * 3 + time * 0.004) - 0.5) * 12);
      for (let s = 0; s < 3; s++) {
        const phase = fract(time * (0.5 + s * 0.09) + seep.seed + s * 0.37);
        ctx.globalAlpha = Math.sin(phase * Math.PI) * 0.35 * strength;
        ctx.fillStyle = s % 2 ? "#7fd3d2" : "#c2ece2";
        ctx.fillRect(seep.x + driftX + s * 2 - 2, Math.round(seep.y + phase * 13), 1, 3);
      }
      ctx.globalAlpha = 0.2 * strength;
      ctx.fillStyle = "#a9e4da";
      ctx.fillRect(seep.x + driftX - 2, seep.y + 13, 6, 1);
    });
    ctx.globalAlpha = 1;
  }

  drawBeacons(ctx, time) {
    this.pylons.forEach((pylon, index) => {
      const charge = (state.pylons && state.pylons[pylon.id]) || 0;
      const pulse = Math.sin(time * (1.15 + index * 0.04) + pylon.phase * Math.PI * 2) * 0.5 + 0.5;
      const power = 0.45 + charge * 0.85;
      ctx.globalAlpha = (0.28 + pulse * 0.38) * power;
      ctx.fillStyle = "#74d5d2";
      ctx.fillRect(pylon.x - 10, pylon.y - 20, 20, 18);
      ctx.globalAlpha = (0.35 + pulse * 0.4) * power;
      ctx.fillStyle = "#dffff8";
      ctx.fillRect(pylon.x - 3, pylon.y - 16, 6, 7);

      // Rising motes; denser as the pylon charges.
      const motes = charge >= 1 ? 7 : charge > 0.5 ? 5 : 3;
      for (let m = 0; m < motes; m++) {
        const mt = fract(time * (0.4 + m * 0.09) + pylon.phase + m * 0.41);
        const mx = pylon.x + Math.round(Math.sin((mt + m) * Math.PI * 2 + index) * 10);
        ctx.globalAlpha = Math.sin(mt * Math.PI) * 0.85 * power;
        ctx.fillStyle = m % 2 ? "#ffffff" : "#9ffcf0";
        ctx.fillRect(mx, Math.round(pylon.y - 6 - mt * 34), m % 3 === 0 ? 2 : 1, m % 3 === 0 ? 2 : 1);
      }

      if (charge >= 1) {
        const ringT = fract(time * 1.1 + pylon.phase);
        const radius = 6 + ringT * 18;
        ctx.globalAlpha = (1 - ringT) * 0.7;
        ctx.strokeStyle = "#b8fff6";
        ctx.lineWidth = 2;
        ctx.strokeRect(pylon.x - radius, pylon.y - 10 - radius * 0.5, radius * 2, radius);
      }
    });
    ctx.globalAlpha = 1;
  }

  drawFountain(ctx, time) {
    // Central plaza fountain only (map art bowl ~769, 592).
    const fx = 769;
    const fy = 600;
    for (let i = 0; i < 6; i++) {
      const mt = fract(time * (0.5 + i * 0.06) + i * 0.21);
      const arc = Math.sin(mt * Math.PI);
      const ox = Math.round(Math.sin(time * 1.2 + i * 0.9) * (3 + mt * 6));
      const oy = Math.round(-mt * 18 - arc * 2);
      ctx.globalAlpha = arc * 0.55;
      ctx.fillStyle = i % 2 ? "#e8fffb" : "#8fe8e0";
      ctx.fillRect(fx + ox, fy + oy - 10, 2, 2);
    }
    const ringT = fract(time * 0.55);
    ctx.globalAlpha = (1 - ringT) * 0.28;
    ctx.strokeStyle = "#b6f4ec";
    ctx.lineWidth = 1;
    const r = 6 + ringT * 12;
    ctx.strokeRect(Math.round(fx - r), Math.round(fy - r * 0.35), Math.round(r * 2), Math.round(r * 0.7));
    ctx.globalAlpha = 1;
  }

  drawFireflies(ctx, time) {
    // Soft forest-edge fireflies only (not on open rock plazas).
    for (let i = 0; i < 10; i++) {
      const seed = i * 17.13;
      const blink = Math.sin(time * (1.8 + hashNoise(seed) * 1.8) + seed) * 0.5 + 0.5;
      if (blink < 0.45) continue;
      // Bias to canopy / garden bands.
      const x = 80 + hashNoise(seed * 3.1) * 1500;
      const y = 40 + hashNoise(seed * 5.7) * 200 + (i % 2) * 520;
      if (y > 280 && y < 500) continue; // skip building band
      ctx.globalAlpha = (blink - 0.45) * 0.7;
      ctx.fillStyle = i % 2 ? "#fff6a8" : "#d8ff9a";
      ctx.fillRect(Math.round(x + Math.sin(time * 0.3 + seed) * 20), Math.round(y), 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  drawRelayAura(ctx, time) {
    const rx = Math.round(CFG.relay.x * 1672);
    const ry = Math.round(CFG.relay.y * 941);
    const charge = state.relayCharge || 0;
    const pulse = Math.sin(time * 2.4) * 0.5 + 0.5;
    const power = 0.35 + charge * 0.65 + charge * 0.4;
    // Soft ground glow.
    ctx.globalAlpha = 0.18 * power;
    ctx.fillStyle = "#7dffc8";
    ctx.fillRect(rx - 18, ry + 4, 36, 8);
    // Rising signal motes (beacon-like).
    const motes = charge >= 1 ? 8 : 3 + Math.floor(charge * 4);
    for (let m = 0; m < motes; m++) {
      const mt = fract(time * (0.45 + m * 0.08) + m * 0.33);
      const mx = rx + Math.round(Math.sin((mt + m) * Math.PI * 2) * (8 + charge * 8));
      ctx.globalAlpha = Math.sin(mt * Math.PI) * 0.9 * power;
      ctx.fillStyle = m % 2 ? "#fff4a0" : "#9dffe0";
      ctx.fillRect(mx, Math.round(ry - 4 - mt * 42), 2, 2);
    }
    if (charge >= 1 || relayBuffLeft > 0) {
      const ringT = fract(time * (relayBuffLeft > 0 ? 1.4 : 0.9));
      const radius = 10 + ringT * 26;
      ctx.globalAlpha = (1 - ringT) * 0.65;
      ctx.strokeStyle = relayBuffLeft > 0 ? "#ffe07a" : "#9dffe0";
      ctx.lineWidth = 2;
      ctx.strokeRect(rx - radius, ry - 8 - radius * 0.45, radius * 2, radius);
    }
    ctx.globalAlpha = 1;
  }

  drawTrees(ctx, time) {
    // Tiny canopy flecks only — never big blocks that look like water on rock.
    this.treeTips.forEach(([x, y], index) => {
      const localWind = this.wind(x, y, time + index * 0.13);
      if (localWind < 0.22) return;
      const offset = Math.round(Math.sin(time * (2.2 + hashNoise(index)) + index) * (0.6 + localWind * 1.6));
      ctx.globalAlpha = 0.1 + localWind * 0.28;
      ctx.fillStyle = index % 2 ? "#9fd45a" : "#6fb84a";
      ctx.fillRect(x + offset, y, 2, 2);
      ctx.fillRect(x + 3 + offset, y + 2, 2, 1);
    });
    ctx.globalAlpha = 1;
  }

  drawGrass(ctx, time) {
    // Soft meadow shimmer in the open eastern field only.
    const step = Math.floor(time * 3.5);
    for (let i = 0; i < 14; i++) {
      const h = hashNoise(step * 3.7 + i * 11.3);
      const gx = this.meadow.x + h * this.meadow.width;
      const gy = this.meadow.y + hashNoise(h * 71) * this.meadow.height;
      const localWind = this.wind(gx, gy, time);
      if (localWind < 0.3) continue;
      ctx.globalAlpha = (localWind - 0.25) * 0.35;
      ctx.fillStyle = hashNoise(h * 31) > 0.5 ? "#b8e878" : "#8ec858";
      const sway = Math.round(Math.sin(time * 3 + i) * localWind);
      ctx.fillRect(Math.round(gx + sway), Math.round(gy), 3, 1);
    }
    // Flower beds only.
    this.flowerZones.forEach(([fx, fy], index) => {
      const localWind = this.wind(fx, fy, time + index);
      if (localWind < 0.28) return;
      const sway = Math.round(Math.sin(time * 4.5 + index * 2) * (1 + localWind));
      ctx.globalAlpha = 0.22 + localWind * 0.35;
      ctx.fillStyle = ["#ffd0e8", "#fff3a0", "#e8d0ff"][index % 3];
      ctx.fillRect(fx + sway, fy, 2, 2);
    });
    ctx.globalAlpha = 1;
  }

  drawSolar(ctx, time) {
    // A slow diagonal glint sweeps the panels on a noise-gated cadence.
    const cycle = 11;
    const slot = Math.floor(time / cycle);
    if (hashNoise(slot * 6.17) > 0.35) {
      const t = fract(time / cycle);
      if (t < 0.16) {
        const progress = t / 0.16;
        const gx = this.solar.x + progress * (this.solar.width + 40) - 20;
        ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.4;
        ctx.fillStyle = "#eaf9ff";
        for (let i = 0; i < 5; i++) {
          const px = Math.round(gx - i * 5);
          const py = this.solar.y + i * (this.solar.height / 5);
          if (px > this.solar.x - 2 && px < this.solar.x + this.solar.width) {
            ctx.fillRect(px, Math.round(py), 2, Math.round(this.solar.height / 5) - 3);
          }
        }
      }
    }
    // Tiny energy pulse drifting along the panel edge.
    const et = fract(time * 0.22);
    ctx.globalAlpha = 0.4 + Math.sin(time * 6) * 0.15;
    ctx.fillStyle = "#8ff0ff";
    ctx.fillRect(Math.round(this.solar.x + et * this.solar.width), this.solar.y + this.solar.height + 2, 2, 1);
    ctx.globalAlpha = 1;
  }

  updateLeaves(ctx, time, dt) {
    // Spawn: lively baseline, more during gusts, capped population.
    this.leafTimer -= dt;
    const globalWind = this.wind(800, 300, time);
    if (this.leafTimer <= 0 && this.leaves.length < 42) {
      const tip = this.treeTips[Math.floor(Math.random() * this.treeTips.length)];
      this.leaves.push({
        x: tip[0] + (Math.random() - 0.5) * 26,
        y: tip[1] + Math.random() * 8,
        vx: 0,
        vy: 14 + Math.random() * 18,
        phase: Math.random() * 10,
        fallDist: 70 + Math.random() * 160,
        startY: tip[1],
        size: Math.random() < 0.35 ? 4 : 3,
        color: pick(["#e8ff78", "#c8f05e", "#ffd65d", "#9fdc55", "#f0b84f"]),
        landed: 0,
        life: 1
      });
      this.leafTimer = (0.28 + Math.random() * 0.55) / (0.55 + globalWind);
    }
    for (let i = this.leaves.length - 1; i >= 0; i--) {
      const leaf = this.leaves[i];
      if (leaf.landed > 0) {
        leaf.landed -= dt;
        leaf.life = Math.min(leaf.life, leaf.landed / 1.4);
        if (leaf.landed <= 0) { this.leaves.splice(i, 1); continue; }
      } else {
        const localWind = this.wind(leaf.x, leaf.y, time);
        leaf.phase += dt * (3 + localWind * 4);
        leaf.vx = Math.sin(leaf.phase) * 14 + localWind * 26;
        leaf.x += leaf.vx * dt;
        leaf.y += (leaf.vy + Math.sin(leaf.phase * 0.7) * 6) * dt;
        if (leaf.y - leaf.startY > leaf.fallDist) leaf.landed = 1.2 + Math.random() * 1.4;
      }
      const flutter = Math.floor(leaf.phase * 2) % 2;
      ctx.globalAlpha = 0.92 * leaf.life;
      ctx.fillStyle = leaf.color;
      if (leaf.landed > 0) {
        ctx.fillRect(Math.round(leaf.x), Math.round(leaf.y), leaf.size, 1);
      } else if (flutter) {
        ctx.fillRect(Math.round(leaf.x), Math.round(leaf.y), leaf.size, 1);
        ctx.fillRect(Math.round(leaf.x + 1), Math.round(leaf.y + 1), 1, 1);
      } else {
        ctx.fillRect(Math.round(leaf.x), Math.round(leaf.y), 1, leaf.size);
      }
    }
    ctx.globalAlpha = 1;
  }

  updateButterflies(ctx, time, dt) {
    this.butterflyTimer -= dt;
    if (this.butterflyTimer <= 0 && this.butterflies.length < 10) {
      const zone = this.flowerZones[Math.floor(Math.random() * this.flowerZones.length)];
      const group = 1 + (Math.random() < 0.55 ? 1 : 0) + (Math.random() < 0.25 ? 1 : 0);
      for (let g = 0; g < group; g++) {
        this.butterflies.push({
          x: zone[0] + (Math.random() - 0.5) * 40,
          y: zone[1] + (Math.random() - 0.5) * 24,
          homeX: zone[0],
          homeY: zone[1],
          seed: Math.random() * 100,
          life: 20 + Math.random() * 28,
          color: pick(["#fff8e1", "#ffe06a", "#e0c8ff", "#ffffff", "#ffc0d8"])
        });
      }
      this.butterflyTimer = 3.5 + Math.random() * 7;
    }
    for (let i = this.butterflies.length - 1; i >= 0; i--) {
      const fly = this.butterflies[i];
      fly.life -= dt;
      if (fly.life <= 0) { this.butterflies.splice(i, 1); continue; }
      fly.x = fly.homeX + (valueNoise1(fly.seed + time * 0.14) - 0.5) * 130;
      fly.y = fly.homeY + (valueNoise1(fly.seed * 2 + time * 0.17) - 0.5) * 70 + Math.sin(time * 3 + fly.seed) * 4;
      const flap = Math.floor(time * 12 + fly.seed) % 2;
      const fade = Math.min(1, fly.life, (40 - fly.life) * 0.7);
      ctx.globalAlpha = 0.95 * Math.max(0.2, fade);
      ctx.fillStyle = fly.color;
      const bx = Math.round(fly.x);
      const by = Math.round(fly.y);
      if (flap) {
        ctx.fillRect(bx - 3, by, 3, 2);
        ctx.fillRect(bx + 1, by, 3, 2);
      } else {
        ctx.fillRect(bx - 2, by - 2, 2, 3);
        ctx.fillRect(bx + 1, by - 2, 2, 3);
      }
    }
    ctx.globalAlpha = 1;
  }

  updateBirds(ctx, time, dt) {
    this.birdTimer -= dt;
    if (this.birdTimer <= 0 && this.birds.length < 2) {
      const leftToRight = Math.random() < 0.5;
      const flock = 2 + Math.floor(Math.random() * 4);
      const baseY = 30 + Math.random() * 140;
      const speed = (120 + Math.random() * 70) * (leftToRight ? 1 : -1);
      for (let b = 0; b < flock; b++) {
        this.birds.push({
          x: (leftToRight ? -30 : 1700) - b * 26 * Math.sign(speed),
          y: baseY + (b % 2) * 14 + b * 4,
          vx: speed,
          seed: Math.random() * 10
        });
      }
      this.birdTimer = 14 + Math.random() * 22;
    }
    for (let i = this.birds.length - 1; i >= 0; i--) {
      const bird = this.birds[i];
      bird.x += bird.vx * dt;
      if (bird.x < -60 || bird.x > 1740) { this.birds.splice(i, 1); continue; }
      const y = bird.y + Math.sin(time * 1.8 + bird.seed) * 7;
      const flap = Math.floor(time * 10 + bird.seed) % 2;
      const bx = Math.round(bird.x);
      const by = Math.round(y);
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = "#1e3428";
      if (flap) {
        ctx.fillRect(bx - 3, by - 2, 3, 2);
        ctx.fillRect(bx + 1, by - 2, 3, 2);
        ctx.fillRect(bx, by, 2, 2);
      } else {
        ctx.fillRect(bx - 3, by + 1, 3, 2);
        ctx.fillRect(bx + 1, by + 1, 3, 2);
        ctx.fillRect(bx, by, 2, 2);
      }
    }
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
    const open = tierUnlocked(tier) || models.some(model => countOf(model.id) > 0);
    const lockNote = open
      ? "Online"
      : "Lv " + (tier.unlockLevel || 1) + " or " + fmt(tier.unlockLifetime) + " lifetime";
    return `<section class="market-tier${open ? "" : " is-locked"}" id="tier-${tier.id}" data-tier="${tier.id}">
      <div class="tier-heading">
        <div><span class="tier-badge">Tier ${tier.id}</span><h4>${tier.name}</h4><p>${tier.subtitle}</p></div>
        <span class="tier-lock" id="tier-status-${tier.id}">${lockNote}</span>
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
  const next = CC_LEVELS[state.ccLevel];
  const ccCard = `
    <article class="upgrade-card cc-upgrade-card" id="upgrade-cc">
      <div class="upgrade-top">
        <div><strong>Command Center · Level ${state.ccLevel}</strong>
        <p>${next ? next.blurb + ". +" + Math.round(CFG.ccOutputPerLevel * 100) + "% output, pylons charge " + Math.round(CFG.ccChargePerLevel * 100) + "% faster per level." : "Fully commissioned. The atrium hums."}</p></div>
        <button class="upgrade-button" id="upbuy-cc" type="button" ${next ? "" : "disabled"}><span id="upcost-cc">${next ? fmt(next.cost) : "Maxed"}</span></button>
      </div>
      <span class="upgrade-lock" id="upneed-cc">${next ? "Level " + (state.ccLevel + 1) + " of " + CC_LEVELS.length : "Level " + CC_LEVELS.length + " of " + CC_LEVELS.length}</span>
    </article>`;
  $("ups").innerHTML = ccCard + UPGRADES.map(upgrade => `
    <article class="upgrade-card" id="upgrade-${upgrade.id}">
      <div class="upgrade-top">
        <div><strong>${upgrade.name}</strong><p>${upgrade.desc}</p></div>
        <button class="upgrade-button" id="upbuy-${upgrade.id}" type="button"><span id="upcost-${upgrade.id}"></span></button>
      </div>
      <span class="upgrade-lock" id="upneed-${upgrade.id}">${needLabel(upgrade)}</span>
    </article>`).join("");
  UPGRADES.forEach(upgrade => $("upbuy-" + upgrade.id).addEventListener("click", () => buyUp(upgrade)));
  $("upbuy-cc").addEventListener("click", buyCcLevel);
}

/* ---- Pylons, plots, habitats, minions ------------------------------------ */

function buildPylons() {
  const container = $("pylons");
  if (!container) return;
  container.innerHTML = PYLONS.map(pylon => `
    <button class="pylon-hotspot${pylon.central ? " is-central" : ""}" id="pylon-${pylon.id}" type="button"
      style="left:${pylon.x * 100}%;top:${pylon.y * 100}%"
      aria-label="Resonance pylon">
      <i class="pylon-ring" aria-hidden="true"></i>
      <span class="pylon-tip" aria-hidden="true"></span>
    </button>`).join("");
  PYLONS.forEach(pylon => {
    $("pylon-" + pylon.id).addEventListener("click", event => {
      event.stopPropagation();
      if (activatePylon(pylon.id)) {
        pylonBurstFx(pylon);
      } else {
        announce("Resonance " + Math.round((state.pylons[pylon.id] || 0) * 100) + "% — pylons buff nearby teams while they charge.");
      }
    });
  });
}

function updatePylons() {
  PYLONS.forEach(pylon => {
    const element = $("pylon-" + pylon.id);
    if (!element) return;
    const charge = state.pylons[pylon.id] || 0;
    element.style.setProperty("--charge", Math.round(charge * 100) + "%");
    element.classList.toggle("is-charged", charge >= 1);
  });
}

function buildPlots() {
  const container = $("plots");
  if (!container) return;
  container.innerHTML = PLOTS.map(plot => {
    const record = plotState(plot.id);
    const r = plot.rect;
    return `<div class="plot${record.active ? " is-active" : ""}" id="plot-${plot.id}"
      style="left:${r.x0 * 100}%;top:${r.y0 * 100}%;width:${(r.x1 - r.x0) * 100}%;height:${(r.y1 - r.y0) * 100}%">
      <button class="plot-plate" type="button" aria-label="${plot.name} deployment zone">
        <b>${plot.name}</b>
        <small id="plot-note-${plot.id}">${record.active ? plotPopulation(plot.id) + "/" + plot.capacity + " deployed" : "Activate · " + fmt(plot.cost)}</small>
      </button>
    </div>`;
  }).join("");
  PLOTS.forEach(plot => {
    $("plot-" + plot.id).querySelector(".plot-plate").addEventListener("click", event => {
      event.stopPropagation();
      const record = plotState(plot.id);
      if (!record.active && state.tokens >= plot.cost) {
        buyPlot(plot);
        return;
      }
      openCommand("docked");
      const tab = $("tab-habitats");
      if (tab) tab.click();
      if (!record.active) announce("Need " + fmt(plot.cost) + " tokens to activate " + plot.name + ".");
    });
  });
}

function buildHabitats() {
  const container = $("habitats");
  if (!container) return;
  container.innerHTML = PLOTS.map(plot => {
    const record = plotState(plot.id);
    if (!record.active) {
      return `<article class="habitat-card is-locked" id="habitat-${plot.id}">
        <div class="habitat-head">
          <div><strong>${plot.name}</strong><p>Dormant plot on the campus map.</p></div>
          <button class="upgrade-button habitat-activate" id="habitat-activate-${plot.id}" type="button">Activate ${fmt(plot.cost)}</button>
        </div>
      </article>`;
    }
    const population = plotPopulation(plot.id);
    return `<article class="habitat-card" id="habitat-${plot.id}">
      <div class="habitat-head">
        <div><strong>${plot.name}</strong><p id="habitat-note-${plot.id}">${population}/${plot.capacity} foundation models settled</p></div>
      </div>
      <div class="habitat-units">${FOUNDRY.map(unit => `
        <div class="habitat-unit" id="hu-${plot.id}-${unit.id}" style="--model-color:${unit.color}">
          <span class="habitat-dot" aria-hidden="true"></span>
          <div class="habitat-copy"><b>${unit.name}</b><small>${unit.era} · ${fmt(unit.rate)}/s · ×<span id="hu-count-${plot.id}-${unit.id}">${record.units[unit.id] || 0}</span></small></div>
          <button class="buy-button habitat-buy" id="hu-buy-${plot.id}-${unit.id}" type="button">${fmt(unitCostOf(unit))}</button>
        </div>`).join("")}</div>
    </article>`;
  }).join("");
  PLOTS.forEach(plot => {
    const record = plotState(plot.id);
    if (!record.active) {
      $("habitat-activate-" + plot.id).addEventListener("click", () => {
        if (!buyPlot(plot)) announce("Need " + fmt(plot.cost) + " tokens to activate " + plot.name + ".");
      });
      return;
    }
    FOUNDRY.forEach(unit => {
      $("hu-buy-" + plot.id + "-" + unit.id).addEventListener("click", () => buyUnit(unit, plot.id));
    });
  });
}

function updateHabitats() {
  PLOTS.forEach(plot => {
    const record = plotState(plot.id);
    const note = $("plot-note-" + plot.id);
    if (note) note.textContent = record.active ? plotPopulation(plot.id) + "/" + plot.capacity + " deployed" : "Activate · " + fmt(plot.cost);
    if (!record.active) {
      const activate = $("habitat-activate-" + plot.id);
      if (activate) activate.disabled = state.tokens < plot.cost;
      return;
    }
    const full = plotPopulation(plot.id) >= plot.capacity;
    FOUNDRY.forEach(unit => {
      const buyButton = $("hu-buy-" + plot.id + "-" + unit.id);
      if (!buyButton) return;
      const cost = unitCostOf(unit);
      buyButton.textContent = fmt(cost);
      buyButton.disabled = full || state.tokens < cost;
    });
  });
}

// Deterministic in-plot home spots with gentle wander applied at runtime.
function minionHome(plot, ordinal) {
  const r = plot.rect;
  const columns = 3;
  const col = ordinal % columns;
  const row = Math.floor(ordinal / columns);
  return {
    x: r.x0 + (r.x1 - r.x0) * (0.22 + col * 0.28),
    y: r.y0 + (r.y1 - r.y0) * (0.30 + row * 0.34)
  };
}

function renderMinions() {
  const container = $("minions");
  if (!container) return;
  const pieces = [];
  for (const plot of activePlots()) {
    let ordinal = 0;
    const record = plotState(plot.id);
    for (const unit of FOUNDRY) {
      const count = record.units[unit.id] || 0;
      if (!count) continue;
      const home = minionHome(plot, ordinal++);
      pieces.push(`<div class="minion" data-plot="${plot.id}" data-home-x="${home.x}" data-home-y="${home.y}"
        style="left:${home.x * 100}%;top:${home.y * 100}%;--model-color:${unit.color}">
        <span class="minion-sprite robot-sprite sprite-${unit.sprite}" aria-hidden="true"></span>
        <b class="minion-count">×${count}</b>
        <span class="minion-name">${unit.name}</span>
      </div>`);
    }
  }
  container.innerHTML = pieces.join("");
}

function wanderMinions() {
  if (!motionAllowed()) return;
  $("minions").querySelectorAll(".minion").forEach(element => {
    if (Math.random() > 0.4) return;
    const homeX = Number(element.dataset.homeX);
    const homeY = Number(element.dataset.homeY);
    element.style.left = (homeX + (Math.random() - 0.5) * 0.016) * 100 + "%";
    element.style.top = (homeY + (Math.random() - 0.5) * 0.020) * 100 + "%";
    if (Math.random() < 0.06) {
      const bubble = document.createElement("span");
      bubble.className = "minion-zzz";
      bubble.textContent = pick(["z z", "· · ·", "hm", "ok"]);
      element.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2400);
    }
  });
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
  walkPlans.delete(agent.uid);
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

const RETURN_LINES = [
  "Recalculating with dignity.", "Not walkable. Noted forever.",
  "The grass had no API.", "Back to pavement. Back to purpose.",
  "I respect the terrain's decision."
];

function moveAgentDrag(event) {
  if (!drag) return;
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (distance < 5 && !drag.moved) return;
  drag.moved = true;
  drag.element.classList.add("is-dragging", "is-held");
  $("map").classList.add("is-god-hand");
  const point = clientToWorld(event.clientX, event.clientY);
  drag.point = {
    x: clamp(point.x, MAP_BOUNDS.minX, MAP_BOUNDS.maxX),
    y: clamp(point.y, MAP_BOUNDS.minY, MAP_BOUNDS.maxY)
  };
  drag.element.style.left = drag.point.x * 100 + "%";
  drag.element.style.top = drag.point.y * 100 + "%";
}

function finishAgentDrag(event, cancelled) {
  if (!drag) return;
  const activeDrag = drag;
  drag = null;
  $("map").classList.remove("is-god-hand");
  const agent = state.agents.find(item => item.uid === activeDrag.uid);
  activeDrag.element.classList.remove("is-dragging", "is-picked-up", "is-held");

  if (agent && !cancelled && activeDrag.moved && activeDrag.point) {
    const point = activeDrag.point;
    runtimePositions.delete(activeDrag.uid);
    activeWalks.delete(activeDrag.uid);
    walkPlans.delete(activeDrag.uid);
    selectedAgentId = activeDrag.uid;

    if (isWalkablePoint(point)) {
      // Valid ground: settle in place and resume roaming from here.
      const snap = projectToWalkway(point);
      const a = PATH_INDEX[snap.aId];
      const b = PATH_INDEX[snap.bId];
      const entry = snap.t < 0.5 ? a : b;
      agent.x = snap.x;
      agent.y = snap.y;
      roamRoutes.set(activeDrag.uid, { node: entry, previous: entry === a ? b : a, needsEntry: true });
      renderAgents();
      const element = $("agents").querySelector(`[data-agent-id="${activeDrag.uid}"]`);
      if (element) {
        element.classList.add("is-settling");
        setTimeout(() => element.classList.remove("is-settling"), 520);
      }
      log(modelById(agent.modelId).shortName + " repositioned on the campus.", "s");
    } else {
      // Invalid ground: walk back to the nearest walkway that doesn't
      // require wading through the river.
      agent.x = point.x;
      agent.y = point.y;
      const candidates = walkwayCandidates(point);
      let target = candidates[0];
      for (const candidate of candidates.slice(0, 28)) {
        if (!segmentCrossesWater(point, candidate)) { target = candidate; break; }
      }
      const a = PATH_INDEX[target.aId];
      const b = PATH_INDEX[target.bId];
      const entry = target.t < 0.5 ? a : b;
      roamRoutes.set(activeDrag.uid, { node: entry, previous: entry === a ? b : a, needsEntry: true });
      renderAgents();
      const element = $("agents").querySelector(`[data-agent-id="${activeDrag.uid}"]`);
      if (element) element.classList.add("is-returning");
      showSpeech(activeDrag.uid, pick(RETURN_LINES), 2600);
      beginAgentWalk(agent, { x: target.x, y: target.y }, null, 0, false);
    }
    save(false);
  } else if (agent && !activeDrag.moved && !cancelled) {
    selectedAgentId = activeDrag.uid;
    renderAgents();
  }

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
  let choices = forward.length ? forward : node.links;

  // Anti-clump: avoid heading to a node another representative is standing on
  // when there is any other way to go.
  const others = representativeAgents().filter(other => other.uid !== agent.uid);
  const roomy = choices.filter(index => {
    const candidate = CAMPUS_PATHS[index];
    return !others.some(other => worldDistPx(other, candidate) < 42);
  });
  if (roomy.length) choices = roomy;

  const nextIndex = pick(choices);
  const next = CAMPUS_PATHS[nextIndex];
  roamRoutes.set(agent.uid, { node: nextIndex, previous: route.node });
  return { x: next.x, y: next.y, nodeIndex: nextIndex };
}

// Destination nodes worth pausing at, weighted toward the prettiest spots.
const POI_INDICES = CAMPUS_PATHS
  .map((node, index) => ({ node, index }))
  .filter(({ node }) => node.event && node.event !== "water")
  .map(({ node, index }) => ({
    index,
    weight: node.event === "fountain" || node.event === "command" || node.event === "beacon" || node.event === "relay"
      ? 3
      : node.event === "meadow" ? 2 : 1
  }));

function pickPoiIndex(exceptIndex) {
  const pool = [];
  for (const poi of POI_INDICES) {
    if (poi.index === exceptIndex) continue;
    for (let i = 0; i < poi.weight; i++) pool.push(poi.index);
  }
  return pool.length ? pick(pool) : null;
}

// Send an agent on a purposeful A* stroll to a point of interest.
function beginIntentWalk(agent) {
  const startIndex = nearestRoamNode(activeWalkPosition(agent.uid) || runtimePositions.get(agent.uid) || agent);
  const goalIndex = pickPoiIndex(startIndex);
  if (goalIndex === null) return false;
  const path = findPath(startIndex, goalIndex);
  if (!path || path.length < 2 || path.length > 9) return false;
  const legs = path.slice(1).map((nodeIndex, i) => ({
    x: CAMPUS_PATHS[nodeIndex].x,
    y: CAMPUS_PATHS[nodeIndex].y,
    nodeIndex,
    pauseAtEnd: i === path.length - 2
  }));
  const first = legs.shift();
  if (legs.length) walkPlans.set(agent.uid, legs);
  roamRoutes.set(agent.uid, { node: first.nodeIndex, previous: startIndex });
  beginAgentWalk(agent, first, first.nodeIndex, 0, false);
  return true;
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
  activeWalks.set(agent.uid, { from: current, target, started: performance.now(), duration: durationMs, generation, facing, nodeIndex, pauseAtEnd: !!target.pauseAtEnd });

  if (rebuild) {
    renderAgents();
  } else {
    element.dataset.facing = facing;
    element.style.setProperty("--walk-time", durationMs + "ms");
    element.classList.remove("is-dancing");
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

    // Multi-leg plans (A* routes and return walks) chain leg by leg.
    const plan = walkPlans.get(agent.uid);
    if (plan && plan.length && motionAllowed()) {
      const next = plan.shift();
      if (!plan.length) walkPlans.delete(agent.uid);
      if (typeof next.nodeIndex === "number") {
        roamRoutes.set(agent.uid, { node: next.nodeIndex, previous: walk.nodeIndex ?? -1 });
      }
      beginAgentWalk(agent, next, next.nodeIndex, 0, false);
      return;
    }
    walkPlans.delete(agent.uid);
    if (currentElement) currentElement.classList.remove("is-returning");
    handleEnvironmentArrival(agent, walk.nodeIndex);
    if (walk.pauseAtEnd) lookAround(agent);
  }, durationMs + 80);
  return true;
}

// A short "take in the view" beat at a destination: hold position, glance
// both ways, sometimes dance or say something.
function lookAround(agent) {
  const now = performance.now();
  agentHolds.set(agent.uid, Math.max(agentHolds.get(agent.uid) || 0, now + 2200 + Math.random() * 2600));
  const element = $("agents").querySelector(`[data-agent-id="${agent.uid}"]`);
  if (!element) return;
  const flip = () => {
    if (!element.isConnected || activeWalks.has(agent.uid)) return;
    element.dataset.facing = element.dataset.facing === "left" ? "right" : "left";
  };
  setTimeout(flip, 700 + Math.random() * 500);
  if (Math.random() < 0.5) setTimeout(flip, 1900 + Math.random() * 600);
  if (Math.random() < 0.30) {
    startAgentDance(agent.uid, 2400 + Math.random() * 1800);
    if (Math.random() < 0.25) showSpeech(agent.uid, pick(DANCE_LINES), 2600);
  } else if (Math.random() < 0.15) {
    const model = modelById(agent.modelId);
    showSpeech(agent.uid, pick(MODEL_CHATTER[model.sprite] || CHATTER), 3000);
  }
}

function startAgentDance(uid, durationMs) {
  const element = $("agents").querySelector(`[data-agent-id="${uid}"]`);
  if (!element || activeWalks.has(uid)) return;
  const now = performance.now();
  const hold = now + (durationMs || 2800);
  agentHolds.set(uid, Math.max(agentHolds.get(uid) || 0, hold));
  element.classList.remove("is-dancing");
  // Restart CSS animation cleanly.
  void element.offsetWidth;
  element.classList.add("is-dancing");
  clearTimeout(element._danceTimer);
  element._danceTimer = setTimeout(() => {
    if (element.isConnected) element.classList.remove("is-dancing");
  }, durationMs || 2800);
}

function wanderAgents() {
  if (!motionAllowed() || drag || state.agents.length === 0) return;
  const now = performance.now();
  const candidates = representativeAgents().filter(agent => {
    const element = $("agents").querySelector(`[data-agent-id="${agent.uid}"]`);
    return element && !activeWalks.has(agent.uid) && (agentHolds.get(agent.uid) || 0) <= now;
  });
  if (!candidates.length) return;

  // Sometimes a resting agent just breaks into a little dance instead of walking.
  const dancers = candidates.filter(() => Math.random() < 0.10).slice(0, 2);
  dancers.forEach(agent => {
    startAgentDance(agent.uid, 2600 + Math.random() * 2200);
    if (Math.random() < 0.25) showSpeech(agent.uid, pick(DANCE_LINES), 2600);
  });

  const movers = candidates.filter(agent => !dancers.includes(agent));
  if (!movers.length) return;
  const moves = Math.max(1, Math.ceil(movers.length * 0.45));
  const shuffled = movers.slice().sort(() => Math.random() - 0.5).slice(0, moves);

  shuffled.forEach((agent, index) => {
    if (Math.random() < 0.28 && beginIntentWalk(agent)) return;
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
  if ((interactionCooldowns.get(agent.uid) || 0) > now || Math.random() > 0.35) return;
  interactionCooldowns.set(agent.uid, now + 16000);
  agentHolds.set(agent.uid, now + 1400 + Math.random() * 2000);
  const line = pick(ENVIRONMENT_LINES[type]);
  showSpeech(agent.uid, line, 3400);
  pulseEnvironment(type, node);
  if (type === "relay" || type === "fountain" || type === "beacon" || type === "meadow") {
    if (Math.random() < 0.4) startAgentDance(agent.uid, 2800 + Math.random() * 1600);
  }
  if (Math.random() < 0.15) log(modelById(agent.modelId).shortName + " checked " + type + ".", "g");
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
  setInterval(wanderMinions, 3200);
  const chatterLoop = () => {
    runConversation();
    setTimeout(chatterLoop, 16000 + Math.random() * 14000);
  };
  setTimeout(chatterLoop, 6000);
  // Rare org-wide ambient remark — the campus mostly works in comfortable silence.
  setInterval(() => {
    if (!motionAllowed() || !state.agents.length) return;
    const idle = representativeAgents().filter(agent => !activeWalks.has(agent.uid));
    if (!idle.length || Math.random() > 0.2) return;
    const agent = pick(idle);
    const model = modelById(agent.modelId);
    showSpeech(agent.uid, pick(MODEL_CHATTER[model.sprite] || CHATTER), 3200);
  }, 12000);
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
  $("reviewv").textContent = state.debt > 0 ? "−" + fmt(reviewClearAmount(m)) : "queue clean";

  const plateau = defects > clears ? (defects - clears) / CFG.debtDecay : 0;
  const plateauIntegrity = Math.round(100 / (1 + plateau / CFG.debtHalfPoint));
  $("debtnote").textContent = defects <= clears
    ? (state.debt > 0 ? "Review is ahead; debt falling" : "Clean queue")
    : "Trend: " + fmt(plateau) + " debt · " + plateauIntegrity + "% integrity";

  const levelInfo = orgLevelInfo();
  if ($("org-level")) $("org-level").textContent = "Lv " + levelInfo.level;
  if ($("org-exp")) $("org-exp").textContent = levelInfo.into + "/" + levelInfo.need + " XP";
  if ($("org-exp-bar")) $("org-exp-bar").style.width = Math.round(levelInfo.progress * 100) + "%";
  updateGuide();

  MODELS.forEach(updateModelCard);
  TIERS.forEach(tier => {
    const tierModels = MODELS.filter(model => model.tier === tier.id);
    const open = tierUnlocked(tier) || tierModels.some(model => countOf(model.id) > 0);
    const section = $("tier-" + tier.id);
    const status = $("tier-status-" + tier.id);
    if (section) section.classList.toggle("is-locked", !open);
    if (status) {
      status.textContent = open
        ? "Online"
        : "Need Lv " + (tier.unlockLevel || 1) + " (you: " + levelInfo.level + ")";
    }
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
  const attuned = attunedModelIds();
  const glitchy = quality < 0.72;
  $("agents").querySelectorAll(".agent").forEach(element => {
    const agent = agentsById.get(element.dataset.agentId);
    element.classList.toggle("is-browned", !!agent && state.brownout && agentStats(agent).burn > 0);
    element.classList.toggle("is-attuned", !!agent && attuned.has(agent.modelId));
    element.classList.toggle("is-glitched", !!agent && glitchy && agentStats(agent).defects > 0);
  });
  updatePylons();
  updateRelay();
  updateHabitats();
  updateInspectorStats();
}

function updateBurstUI() {
  const meter = $("burst-meter");
  const hint = $("burst-hint");
  if (!meter || !hint) return;
  const ready = burstCharge >= 1;
  meter.style.width = Math.round(Math.min(1, burstCharge) * 100) + "%";
  meter.parentElement.classList.toggle("is-ready", ready);
  const hasOrg = state.agents.length > 0;
  hint.textContent = !hasOrg ? "recruit to unlock sprints"
    : ready ? "sprint ready ×" + focusFactor().toFixed(2)
    : "sprint " + Math.round(burstCharge * 100) + "%";
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
  else if (pixelWorldRenderer) pixelWorldRenderer.draw((performance.now() - pixelWorldRenderer.startTime) / 1000, 0.016);
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

function exportSave() {
  save(false);
  try {
    const payload = localStorage.getItem(CFG.saveKey) || JSON.stringify(state);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agent-org-idle-save.json";
    a.click();
    URL.revokeObjectURL(url);
    if ($("saved")) $("saved").textContent = "Save downloaded";
    announce("Save file downloaded. Keep it safe — you can import it later.");
  } catch (error) {
    announce("Could not export save from this browser.");
  }
}

function importSave(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      state = hydrate(parsed || {});
      runtimePositions.clear();
      roamRoutes.clear();
      walkGenerations.clear();
      activeWalks.clear();
      agentHolds.clear();
      interactionCooldowns.clear();
      selectedAgentId = null;
      burstCharge = 1;
      relayBuffLeft = 0;
      buildStore();
      buildUpgrades();
      buildPylons();
      buildPlots();
      buildHabitats();
      renderMinions();
      renderAgents();
      buildInspector();
      buildRoster();
      render();
      save(true);
      announce("Save imported. Welcome back.");
      log("save imported · level " + orgLevel() + ".", "s");
    } catch (error) {
      announce("That file was not a valid Agent Org Idle save.");
    }
  };
  reader.readAsText(file);
}

function bindUI() {
  $("work").addEventListener("click", doWork);
  $("review").addEventListener("click", doReview);
  const relayBtn = $("field-relay");
  if (relayBtn) {
    relayBtn.addEventListener("click", event => {
      event.stopPropagation();
      if (activateRelay()) return;
      const charge = Math.round((state.relayCharge || 0) * 100);
      const near = agentsNearRelay().length;
      announce(near
        ? "Field Relay " + charge + "% — visitors are charging it faster. Tap when ready."
        : "Field Relay " + charge + "% — send agents into the open meadow to charge it, then broadcast.");
    });
  }
  if ($("export-save")) $("export-save").addEventListener("click", exportSave);
  if ($("import-save")) {
    $("import-save").addEventListener("click", () => $("import-file") && $("import-file").click());
  }
  if ($("import-file")) {
    $("import-file").addEventListener("change", event => {
      const file = event.target.files && event.target.files[0];
      importSave(file);
      event.target.value = "";
    });
  }
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
    burstCharge = 1;
    relayBuffLeft = 0;
    logLines.length = 0;
    buildStore();
    buildUpgrades();
    buildPlots();
    buildHabitats();
    renderMinions();
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
  buildUpgrades();
  buildPylons();
  buildPlots();
  buildHabitats();
  renderMinions();
  renderAgents();
  buildInspector();
  buildRoster();
  logLines.forEach(() => {});
  render();
  startLivingWorld();

  updateGuide();
  let previous = performance.now();
  setInterval(() => {
    const now = performance.now();
    const dt = Math.min(1, (now - previous) / 1000);
    previous = now;
    step(dt, false);
    burstCharge = Math.min(1, burstCharge + dt / CFG.burstCooldownS);
    updateBurstUI();
    render();
    saveAcc += dt;
    if (saveAcc >= CFG.saveEveryMs / 1000) { saveAcc = 0; save(true); }
  }, CFG.tickMs);
}

// Exposed for the balance harness; the browser game still boots normally.
globalThis.__AGENT_ORG__ = {
  get state() { return state; },
  setState(next) { state = hydrate(next || {}); },
  get burstCharge() { return burstCharge; },
  setBurstCharge(value) { burstCharge = value; },
  freshState, hydrate, step, doWork, doReview, buy, buyUp, costOf, upCostOf,
  countOf, representativeAgents, setModelFamilyMode, prodPerSec, burnPerSec, fullBurnPerSec, defectsPerSec, clearsPerSec,
  integrity, mods, unlocked, modelUnlocked, activeSynergies, agentStats, projectToWalkway,
  buyPlot, buyUnit, activatePylon, buyCcLevel, foundationPerSec, attunedModelIds, focusFactor,
  unitCostOf, unitCount, plotState, reviewClearAmount, findPath, isWalkablePoint, segmentCrossesWater,
  MODELS, TIERS, REASONING, MAP_BOUNDS, PATH_NODES, PATH_EDGES, CAMPUS_PATHS, UPGRADES, SYNERGIES,
  FOUNDRY, PLOTS, PYLONS, CC_LEVELS, CFG, WORLD
};

if (typeof document !== "undefined" && document.getElementById("game")) initUI();
