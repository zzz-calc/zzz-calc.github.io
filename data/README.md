# Effect DB

This folder is for calculator-ready effect data that can be shipped on GitHub Pages.

## Official data status

As of 2026-07-05, I could confirm the official Zenless Zone Zero website and HoYoWiki pages, but I could not confirm a documented official JSON or CSV API for calculator data such as Agent Mindscape effects or W-Engine refinement values.

That means the practical approach is:

- keep a normalized JSON database in this repo;
- store source references next to every effect group;
- import source text first, then parse structured numeric rows separately;
- mark rows with missing source text as `mockValue: true`;
- only flip an entry to `verification: "verified"` after checking official human-readable pages or in-game values;
- keep raw source text as `rawText` and store auto-parsed calculator stats in `stats`.

## Files

- `effect-db.schema.json`: schema for Agent Mindscape and W-Engine refinement effects.
- `effects.mock.json`: current Agent and W-Engine coverage, with imported raw source text where available.

## Regeneration

Run this after the built-in Agent or W-Engine list changes:

```powershell
node scripts/import-nanoka-effects.mjs
```

The importer creates M0-M6 rows for every Agent and R1-R5 rows for every W-Engine, using the app's current English names to match community static data. It also auto-parses supported numeric buffs such as ATK, DMG, CRIT, PEN, DEF reduction, RES shred, Anomaly Proficiency, Anomaly Mastery, Impact, Energy Regen, and Stun DMG. Add `--version=latest` or `--version=3.0` when a specific source version is needed.

The older placeholder generator is still available:

```powershell
node scripts/generate-effect-mock.mjs
```

## Consumption shape

Damage code should read:

- `mindscapes[agentId].levels[mindscapeLevel]`
- `wEngines[engineId].refinements[refinement - 1]`

Each level/refinement can contribute:

- `buffs`: ordinary stat buffs like `atkPct`, `dmgBonus`, `critRate`, `critDmg`, `penRatio`, `resShred`;
- `damageHooks`: formula-level changes that cannot be represented as a simple stat buff, such as skill multiplier changes or special final multipliers.

Skill-level effects such as many M3/M5 nodes should eventually connect to a separate skill multiplier table instead of being hard-coded as a flat damage buff.
