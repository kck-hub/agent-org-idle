# Agent Org Idle

An idle game about building an AI agent org. You start doing every task by hand,
then buy agents to do it for you. Cheap agents are cheap because they lie.

Open `index.html`. That's it — no build step, no npm, no CDN. It runs by
double-clicking the file and deploys to GitHub Pages as-is.

## The design

Three forces fight each other, and that triangle is the whole game:

- **Throughput** — seats generate tokens/sec.
- **Burn** — paid seats drain tokens/sec continuously. Net can go negative. Hit
  zero and paid seats brown out (they idle, they don't die) until reserves recover.
- **Defect debt** — free/cheap seats silently report DONE without doing the work.
  Debt never announces itself; it just strangles output via
  `integrity = 1 / (1 + debt/50)`. You feel the number slow before you understand why.

Free-agent spam looks optimal for about two minutes and then collapses. That
collapse is the point, not a bug.

Two escape hatches, both deliberate:
- **Clicks bypass integrity.** Manual work is always honest work — it's the only
  reason a collapsed org is recoverable.
- **Manual Review** clears debt by hand before you can afford a Reviewer seat.

## Architecture — the one rule

`SEATS` and `UPGRADES` at the top of the script are plain data. The engine loops
over them generically and **names no seat below the DATA block**.

Adding content = adding one row. If you ever have to edit the tick loop to add a
seat, something has gone wrong — that's the bet the whole file is built on.

Upgrade effects are data too (`{type, value}`), folded generically in `mods()`.

## Balance notes

- `cost(owned) = floor(baseCost * growth^owned)`
- `defects` on a seat is **per second, per seat** — not per tick. (Per-tick rolling
  at 10hz makes HY3 emit 1.5/sec/seat, which no Reviewer can outrun. This was a real
  bug in the original spec.)
- Defect accrual uses fractional accumulation, not a per-tick coinflip, so the
  advertised rate stays true regardless of tick rate.
- Review clearing is **not** throttled by integrity, or the death spiral is unescapable.
- Offline progress fast-forwards in real 1-second slices (capped 8h) rather than a
  closed-form estimate, so brownout and debt resolve honestly. Defects accrue while
  you're away. That's the joke.

## v2 — not built, hooked

`state.conventions` exists and `mods()` already reads it (`+2%` output each).
Prestige ("MIGRATE HOST": reset for permanent conventions) drops in without a rewrite.

Deliberately deferred: prestige designed before you've played your own numbers is
always wrong.
