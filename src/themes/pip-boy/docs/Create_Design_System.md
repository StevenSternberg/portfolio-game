Design System - Portfolio Game (Pip-Boy UI)
===========================================

Purpose
-------
Create a coherent Pip-Boy inspired interface for a personal portfolio game.
This document captures the current visual system so new sections align with
the existing UI language.

Brand Pillars
-------------
- Retro terminal UI with modern clarity.
- Strong borders and framed panels.
- Uppercase utility text with pixel accents.
- Warm amber accent for focus and action.

Typography
----------
- Display / Accent: "Press Start 2P" (uppercase, letter-spaced)
  Usage: section kickers, HUD titles, small headers
- Body / UI: "Space Grotesk"
  Usage: paragraphs, labels, metrics, nav, card copy

Type Scale (CSS reference)
--------------------------
- H1: 32-62px (clamp) for hero only
- H2: 16-32px depending on section
- H3: 12-18px for panel headers
- UI labels: 10-12px, uppercase, letter-spacing 0.08-0.12em
- Body copy: 11-16px

Color Tokens (from src/index.css)
---------------------------------
- --ink: #f8f5f2 (primary text)
- --ink-muted: #e2e8f0 (secondary text)
- --accent: #fca311 (primary accent)
- --accent-strong: #ffb84d (hover / emphasis)
- --surface: rgba(12, 18, 35, 0.7)
- --surface-strong: rgba(12, 18, 35, 0.9)
- --border: rgba(248, 245, 242, 0.12)
- --border-strong: rgba(248, 245, 242, 0.3)
- --shadow: 0 22px 50px rgba(2, 6, 23, 0.5)
- Page background: radial-gradient(circle at top left, #12213d, #0b1020 50%)

Spacing and Layout
------------------
- Frame padding: 10-12px (pip-root, career-shell)
- Panel padding: 8-12px (pip-panel, career-intro)
- Card padding: 16-24px
- Section gap: 12-24px
- Border radius: 16px (panel) to 24px (frame)
- Grid gaps: 10-18px

Borders and Frames
------------------
- Primary frame: 1px solid var(--accent)
- Panel frame: 1px solid rgba(248, 245, 242, 0.16-0.2)
- Divider: 1px solid rgba(252, 163, 17, 0.3)
- Use subtle gradient surfaces for depth

Core Components
---------------
1) Frame (pip-root / career-shell)
   - Outer border: accent
   - Background: rgba(8, 14, 28, 0.75)
   - Header with divider and uppercase label text

2) Panel (pip-panel / career-intro)
   - Inner border: soft white
   - Background: rgba(12, 18, 35, 0.55-0.7)
   - Header with thin divider

3) Row (pip-row)
   - Label (left), dotted line, value (right)
   - Uppercase labels, compact font size

4) CTA / Button (pip-cta, career-action)
   - Capsule shape (999px)
   - Accent border + translucent fill
   - Uppercase text

5) HUD Chip (hud-trophy-chip)
   - Small square with border, low opacity by default
   - Accent border and glow when active

Iconography and Imagery
-----------------------
- Pixel-art or retro-styled icons
- Rounded corners on icon containers (6-12px)
- Use nearest-neighbor / pixelated rendering for sprites

Motion
------
- Subtle entry animation: fadeIn / floatUp
- Pulse ring for highlights and badge callouts

Do / Do Not
-----------
- Do use uppercase with letter spacing for UI labels.
- Do keep borders visible and consistent.
- Do keep copy concise to match the terminal UI feel.
- Do not introduce new accent colors.
- Do not use thin, low-contrast text.

Implementation Notes
--------------------
Base resets live in `src/index.css`.
Pip-boy theme styles live in `src/themes/pip-boy/theme.css`.
Use `pip-root` and `career-shell` for new framed sections.
Design tokens JSON lives in `src/themes/pip-boy/docs/design-tokens.json`.
