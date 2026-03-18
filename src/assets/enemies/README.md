# Enemy Concepts

These are handcrafted fallback enemy assets for the Pip-Boy career game.

Source sheet:

- `Gemini_Generated_Image_omwqnsomwqnsomwq.png`

Extracted outputs:

- `extracted/glitch_bug_sheet.png`
- `extracted/legacy_beast_sheet.png`
- `extracted/stakeholder_sheet.png`
- `extracted/stakeholder_asap_projectile.png`

Files:

- `glitch-bug.svg`: small grunt enemy representing software bugs and noisy backlog chaos
- `legacy-beast.svg`: heavy brute enemy representing technical debt and legacy systems
- `stakeholder-scope-creeper.svg`: ranged elite enemy representing last-minute scope pressure

Art direction notes:

- Kept as pixel-style SVGs so they stay editable and can be scaled cleanly during prototyping.
- Backgrounds are dark to match the current game theme; in-game usage will likely want transparent exports later.
- These are concept-usable now, but if you want production sprite sheets next, the right follow-up is to convert each into multi-frame animated sheets.
- `scripts/extract_enemy_sprites.py` recreates the extracted PNGs from the source sheet.

Suggested gameplay roles:

- Glitch Bug: fast teleporter / short-range harasser
- Legacy Beast: slow blocker / damage sponge
- Stakeholder: ranged projectile enemy firing exclamation icons or shockwaves
