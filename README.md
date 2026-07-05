# zzz-calc

Korean-first calculator for Zenless Zone Zero.

## Scope

- Character gallery with image cards, Korean names, quick detail view, and starter team presets
- Damage calculator with manual stat, W-Engine, Drive Disc, enemy, and buff inputs
- Growth material planner for Agents, skills, core skill, and W-Engines
- Community guide draft storage with JSON import/export and a GitHub Issue handoff link
- Data tables for Agents, 93 W-Engines, 28 Drive Disc sets, and material categories
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

The first version keeps data in `app.js` so GitHub Pages can serve it without a build step. Character images use remote wiki redirect URLs with text fallbacks. W-Engine and Drive Disc coverage follows Prydwen's 2026-06-16 database snapshot. English W-Engine names are kept where Korean official names are not yet manually verified, to avoid shipping incorrect translations.

Material count tables and team presets are marked as v0 and should be replaced with verified tables as the database work continues.

GitHub Pages cannot accept public uploads by itself. The community tab stores guides in the user's browser, supports JSON sharing, and prepares a GitHub Issue link for public submissions.
