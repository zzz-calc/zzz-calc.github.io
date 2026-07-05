# zzz-calc

Korean-first calculator for Zenless Zone Zero.

## Scope

- Damage calculator with manual stat, W-Engine, Drive Disc, enemy, and buff inputs
- Growth material planner for Agents, skills, core skill, and W-Engines
- Data tables for Agents, W-Engines, Drive Discs, and material categories
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

The first version keeps data in `app.js` so GitHub Pages can serve it without a build step. Material count tables are marked as v0 and should be replaced with verified tables as the database work continues.
