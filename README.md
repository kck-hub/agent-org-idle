# Agent Org Idle

A map-first idle game about building an AI agent organization. Each owned model
family gets one draggable field robot, with a count badge representing every
purchased seat in that family. Map position is playful and cosmetic; model
choice and reasoning depth drive the economy.

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

Representative robots walk, talk, and stop at the fountain, cave, solar array,
beacons, bridges, training yard, and Command Center on their own. Buying more of
the same model increases its badge and aggregate stats instead of crowding the
map. Dragging snaps the representative to the nearest safe path segment; it can
never be placed in water or scenery and its location never changes production
math. Use **Motion on/off** or press
`M` to control world animation, and press `H` for the map-only view. The first
visit follows the system motion preference; an explicit in-game choice is saved.

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
  coordinated frame clock for water flow, waterfalls, wind-reactive flowers and
  tree tips, and falling leaves without transforming the underlying map.
- `assets/ops-campus.png` — original generated campus artwork.
- `assets/robot-atlas.png` — standing sprite atlas used in the market.
- `assets/robot-walk-atlas.png` — generated four-frame walk cycles for all seven
  robot archetypes.
- `tools/sim.js` — balance and invariant harness.

Run the balance check after changing model or upgrade numbers:

```sh
node tools/sim.js
```

The harness compares free-tier spam, disciplined play, and a two-hour scale
strategy. It also checks tick-size stability, tier locks, path projection, graph
connectivity, and v1/v2 save migration.
