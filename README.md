# Agent Org Idle

A map-first idle game about building an AI agent organization. Each owned model
family gets one draggable field robot, with a count badge representing every
purchased seat in that family. Placement now matters: representatives standing
inside a resonance pylon's aura (or at the central fountain) buff their whole
family (+15% output, −20% defect drift), and good positioning multiplies the
manual sprint burst.

## Play locally

There is no build step and no package install. Serve the folder with any static
server, then open the local URL:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`.

## Start playing

1. Click **Ship a task** 15 times to earn the first 15 tokens.
2. Select the central building to enter the **Command Center**, then deploy a
   **Qwen2.5-0.5B-Instruct**. It starts generating tokens automatically.
3. Select a robot on the map to see its total ownership and aggregate stats, or
   apply Quick, Standard, or Deep reasoning to that whole model team.
4. Watch output, burn, defects, and integrity before buying paid models.
5. Use **Review queue** when defect debt rises, then adopt Systems upgrades as
   their roster requirements unlock.

Representative robots walk, talk, pause at scenic spots, and route to points of
interest with A* on their own. Buying more of the same model increases its badge
and aggregate stats instead of crowding the map. Pick a robot up (the god hand)
and drop it anywhere: on walkable stone it settles in place; on grass, water, or
scenery it walks back to the nearest reachable path without wading through the
river. Use **Motion on/off** or press `M` to control world animation, and press
`H` for the map-only view. The first visit follows the system motion preference;
an explicit in-game choice is saved.

New systems in v2:

- **Resonance pylons** (the blue beacons): passive auras that buff nearby model
  teams, plus a slow charge — tap a charged pylon for a token burst and a
  defect sweep. The Command Center level speeds up charging.
- **Field Relay** (open eastern meadow): charges passively and faster when
  agents visit. Tap when ready to broadcast a token splash plus a temporary
  org-wide production / sprint boost. Agents may dance and chat while there.
- **Habitat plots**: the four beige plots activate into deployment zones for
  foundation-era models (ELIZA, Word2Vec, LSTM, BERT, GPT-2, T5). They are pure
  passive generators — no burn, no defects, immune to integrity.
- **Sprints**: Ship a task always pays honest work; every few seconds it also
  ships a sprint worth several seconds of production, multiplied by a focus
  factor derived from how many families are attuned or near the Command Center.
- **Command Center levels**: three upgrades that raise org output and pylon
  charge speed (Systems tab).

## Progress, levels, and saves

The game now has a linear mission guide plus an **org level / EXP** ladder.
Shipping tasks, deploying models, reviewing defects, and firing pylons/relays
all grant EXP. Higher model tiers unlock at level milestones (or the original
lifetime thresholds, whichever you hit first).

Progress **autosaves in this browser**. Use **Export save** / **Import save**
in the Command Center footer to keep a downloadable backup.

## The strategy

The market contains 20 real, officially named model releases across five tiers,
starting with small Chinese open-weight models and GPT-3-era systems and growing
into reasoning and frontier teams. The availability labels describe the real
release; costs and output are fictional game balance values.

Each model has Quick, Standard, and Deep reasoning. Quick makes more output but
creates much more defect drift. Deep is slower and costs more burn, but produces
far cleaner work. Reasoning is managed for each model family through its single
field representative, while purchase cost is based on total ownership of that
model. Changing modes never resets the exponential cost curve, and updates every
owned seat of that model family together.

The original economy remains intact:

- Output earns tokens.
- Paid seats burn tokens continuously and rest during brownouts.
- Defects reduce integrity with `integrity = 1 / (1 + debt / 50)`.
- Defect debt is an exact leaky-bucket model with 5%/second decay.
- Manual work bypasses integrity, and manual review always remains available.

## Architecture

- `index.html` — semantic game shell.
- `styles.css` — full-screen map, pixel-RPG field kit, canvas presentation, the
  full/dockable Command Center, and responsive layouts.
- `game.js` — tiered real-model catalog, reasoning, economy, collision-safe
  placement, path-only roaming, environment interactions, a native pixel-canvas
  renderer, roster synergies, and v1/v2 save migration. The renderer uses one
  coordinated frame clock for directional water flow, background-fitted
  waterfalls, quiet canopy movement, and beacon light without transforming the
  underlying map.
- `assets/ops-campus.png` — original generated campus artwork.
- `assets/robot-atlas.png` — standing sprite atlas used in the market.
- `assets/robot-walk-atlas.png` — generated four-frame walk cycles for all seven
  robot archetypes.
- `assets/robots/` — additional archetypes (`volt`, `ember`, `prism`, `sage`,
  `wrench`, `relic`) with standing portraits and four-frame walk strips for
  later-tier and foundation models.
- `tools/sim.js` — balance and invariant harness.

Run the balance check after changing model or upgrade numbers:

```sh
node tools/sim.js
```

The harness compares free-tier spam, disciplined play, and a two-hour scale
strategy. It also checks tick-size stability, tier locks, path projection, graph
connectivity, and v1/v2 save migration.
