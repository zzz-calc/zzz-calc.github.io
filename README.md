# zzz-calc

English-first calculator for Zenless Zone Zero.

## Scope

- Agent gallery with image cards, source names, quick detail view, and starter team presets
- Damage calculator with manual stats, W-Engine, Drive Disc, enemy, and buff inputs
- Growth material planner for Agents, skills, core skill, and W-Engines
- Community guide draft storage with JSON import/export and a GitHub Issue handoff link
- Data tables for 40 Agents, 93 W-Engines, 21 active Drive Disc sets, and material categories
- Static GitHub Pages deployment

## Local Preview

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## GitHub Pages

This repository includes `.github/workflows/pages.yml`. Push `main` to GitHub, then enable GitHub Pages with "GitHub Actions" as the source.

```powershell
gh auth refresh -h github.com -s repo -s workflow
gh repo create zzz-calc --public --source . --remote origin --push
```

## Data Notes

The app keeps data in `app.js` so GitHub Pages can serve it without a build step. The current profile uses English source names throughout the UI and export payload.

Version 3.0 data adds Pyrois, Velina Airgid, and Norma Hollowell from English community database sources. Pyrois and Velina are treated as released Version 3.0 agents; Norma is marked as a preview/upcoming entry until fuller release data is published.

Material count tables and team presets are marked as v0 and should be replaced with verified tables as database work continues.

GitHub Pages cannot accept public uploads by itself. The community tab stores guides in the user's browser, supports JSON sharing, and prepares a GitHub Issue link for public submissions.
