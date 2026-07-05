# Effect DB

This folder is for calculator-ready effect data that can be shipped on GitHub Pages.

## Official data status

As of 2026-07-05, I could confirm the official Zenless Zone Zero website and HoYoWiki pages, but I could not confirm a documented official JSON or CSV API for calculator data such as Agent Mindscape effects or W-Engine refinement values.

That means the practical approach is:

- keep a normalized JSON database in this repo;
- store source references next to every effect group;
- mark unverified rows with `mockValue: true`;
- only flip an entry to `verification: "verified"` after checking official human-readable pages or in-game values;
- avoid copying long official effect text verbatim; store structured numeric summaries and short notes.

## Files

- `effect-db.schema.json`: schema for Agent Mindscape and W-Engine refinement effects.
- `effects.mock.json`: full mock coverage for the app's current Agent and W-Engine IDs.

## Regeneration

Run this after the built-in Agent or W-Engine list changes:

```powershell
node scripts/generate-effect-mock.mjs
```

The generator creates M0-M6 rows for every Agent and R1-R5 rows for every W-Engine. Generated rows are source-pending placeholders, not verified gameplay values.

## Consumption shape

Damage code should read:

- `mindscapes[agentId].levels[mindscapeLevel]`
- `wEngines[engineId].refinements[refinement - 1]`

Each level/refinement can contribute:

- `buffs`: ordinary stat buffs like `atkPct`, `dmgBonus`, `critRate`, `critDmg`, `penRatio`;
- `damageHooks`: formula-level changes that cannot be represented as a simple stat buff, such as skill multiplier changes or special final multipliers.

Skill-level effects such as many M3/M5 nodes should eventually connect to a separate skill multiplier table instead of being hard-coded as a flat damage buff.
