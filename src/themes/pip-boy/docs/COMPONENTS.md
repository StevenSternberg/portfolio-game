Components - Portfolio Game (Pip-Boy UI)
========================================

Purpose
-------
Component specs for the Pip-Boy inspired UI. Use this as a reference when
building new sections or updating existing ones.

Frame
-----
Use for primary sections such as the CV and Career blocks.

Classes
-------
- pip-root
- career-shell

Structure (example)
-------------------
<section class="pip-root">
  <header class="pip-root-header">
    <h2>Section Title</h2>
    <p>Short uppercase descriptor</p>
  </header>
  <div class="pip-root-grid">
    ...
  </div>
</section>

Specs
-----
- Border: 1px solid var(--accent)
- Radius: 24px
- Padding: 12px
- Background: rgba(8, 14, 28, 0.75)
- Header divider: 1px solid rgba(252, 163, 17, 0.3)
- Header type: Press Start 2P, 14-16px, uppercase, letter-spacing 0.12em
- Subtitle type: 10-11px, uppercase, letter-spacing 0.08em

Panel
-----
Use for grouped content inside a frame.

Classes
-------
- pip-panel
- career-intro
- career-stage

Structure (example)
-------------------
<section class="pip-panel">
  <header class="pip-header">
    <h2>Panel Title</h2>
    <p>Short descriptor</p>
  </header>
  <div class="pip-body">
    ...
  </div>
</section>

Specs
-----
- Border: 1px solid rgba(248, 245, 242, 0.16-0.2)
- Radius: 16-20px
- Padding: 8-12px
- Background: rgba(12, 18, 35, 0.55-0.7)
- Header divider: 1px solid rgba(252, 163, 17, 0.3)
- Header type: Press Start 2P, 11-12px, uppercase
- Body type: Space Grotesk, 10-12px

Row
---
Use for label-value pairs with a dotted leader.

Classes
-------
- pip-row
- pip-label
- pip-dots
- pip-value

Structure (example)
-------------------
<div class="pip-row">
  <span class="pip-label">Label</span>
  <span class="pip-dots" aria-hidden="true"></span>
  <span class="pip-value">Value</span>
</div>

Specs
-----
- Label: uppercase, 10px, letter-spacing 0.08em
- Value: 11px, right-aligned
- Dots: 1px dotted line, muted white

Button / CTA
------------
Primary and ghost button styles.

Classes
-------
- pip-cta
- career-action
- career-action--ghost

Specs
-----
- Radius: 999px
- Padding: 6-14px
- Border: 1px solid var(--accent) or muted white for ghost
- Background: rgba(252, 163, 17, 0.2) or rgba(12, 18, 35, 0.6)
- Text: uppercase, 10-11px, letter-spacing 0.08em

HUD Chip
--------
Small indicator used for trophies and stats.

Classes
-------
- hud-trophy-chip
- stat-dot

Specs
-----
- Size: 28-34px (chip), 8px (dot)
- Border: 1px solid rgba(248, 245, 242, 0.2)
- Background: rgba(12, 18, 35, 0.6)
- Active: accent border + glow

Popup Card
----------
Career detail overlay.

Classes
-------
- career-popup
- career-popup-card

Specs
-----
- Overlay: full-screen with gradient tint
- Card width: min(720px, 92vw)
- Radius: 22px
- Border: 1px solid var(--border)
- Background: rgba(12, 18, 35, 0.7-0.98)
- Shadow: 0 24px 60px rgba(2, 6, 23, 0.6)

Logo Card
---------
Company grid tiles.

Classes
-------
- logo-card

Specs
-----
- Radius: 16px
- Border: 1px solid var(--border)
- Background: linear-gradient(180deg, rgba(12, 18, 35, 0.92), rgba(12, 18, 35, 0.55))
- Text: uppercase, 12px, letter-spacing 0.08em

Game Shell
----------
Interactive timeline container.

Classes
-------
- game-shell
- game-overlay
- mobile-controls

Specs
-----
- Radius: 24px
- Border: 1px solid var(--border)
- Background: radial gradient with scanline overlay
- Overlay HUD: top padding 18-22px, pointer-events none
*** End Patch}
