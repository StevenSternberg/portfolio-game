# Pip-Boy Career Game Backlog

## Purpose

Turn the current "Career Quest" section into a more polished, replayable, and maintainable portfolio game without losing the fast-scanning recruiter value of the site.

## Current State Summary

- The game is a side-scrolling Phaser platformer embedded in the Pip-Boy theme.
- Core loop exists: move, jump, land on career milestones, open a detail card, collect trophies.
- The experience is visually distinctive, but still thin as a game and not yet robust enough for iterative feature work.

## Status Snapshot

### Completed

- Phaser scene moved out of the React component.
- Lint errors resolved and build is green.
- `window.render_game_to_text` and a first pass of `window.advanceTime(ms)` added.
- `progress.md` added.
- Start/briefing state added.
- Objective and control clarity improved.
- Milestone unlock feedback improved.
- Career popup compressed and cleaned up for laptop view.

### Still Open

- Playwright-based gameplay test loop is not installed/wired yet.
- Milestones still open from collision instead of explicit interact.
- Movement/collision feel has not been tuned yet.
- No checkpoint/restart flow.
- No end-of-quest summary card.
- Touch controls are still basic.
- No accessibility mode.
- No performance pass on large assets/chunks.
- No worldbuilding, sound, or optional collectibles yet.

## Foundation First

These items should be done before larger gameplay additions.

### 1. Stabilize the game architecture

Status: Mostly done

- Move the Phaser scene out of the React component in `src/themes/pip-boy/components/CareerGame.jsx`.
- Remove lint errors in `src/themes/pip-boy/pages/Career.jsx` and `vite.config.js`.
- Fix hook dependency warnings in `CareerGame.jsx` and `PixelLogo.jsx`.
- Isolate game state from presentational UI so gameplay changes are easier to ship.

Why this matters:
- The current inline scene setup is hard to test and React Compiler skips it.
- Small gameplay changes will get risky if the scene lifecycle stays mixed with React rendering.

### 2. Add a testable game interface

Status: Partially done

- Expose `window.render_game_to_text`.
- Expose deterministic `window.advanceTime(ms)`.
- Add a minimal `progress.md` for future iteration history.
- Install and wire Playwright-based gameplay checks.

Why this matters:
- Right now there is no reliable automated gameplay regression loop.
- This blocks fast iteration on movement, interactions, and mobile controls.

### 3. Improve baseline UX clarity

Status: Mostly done

- Add a visible start state or instruction card before gameplay begins.
- Make the objective explicit: collect all milestones to complete the quest.
- Clarify controls for desktop and touch separately.
- Add stronger feedback when a milestone is activated or completed.

Why this matters:
- The current game assumes the player will infer the goal from context.
- Recruiters will not spend time discovering mechanics.

## Priority Backlog

### P1. Game Feel and Core Interaction

#### 4. Tune movement and collision feel

Status: Open

- Tighten acceleration, jump height, landing response, and camera follow.
- Add coyote time and jump buffering.
- Improve collision reliability when landing on milestone platforms.

Expected impact:
- Makes the game feel intentional instead of "prototype-like".

#### 5. Convert milestones into explicit interactables

Status: Open

- Require proximity plus an interact action instead of only collision-triggered selection.
- Add a visible interaction prompt near the active milestone.
- Prevent accidental card opens during traversal.

Expected impact:
- Gives the player more control and makes the game loop easier to understand.

#### 6. Add checkpoint and restart flow

Status: Open

- Add a start point, restart button, and optional respawn behavior.
- Preserve collected milestones after a fall or allow restart from scratch.
- Add a "quest complete" summary state.

Expected impact:
- Turns the section into a complete loop instead of a single pass with no formal ending.

### P2. Portfolio Value Through Gameplay

#### 7. Replace generic trophy collection with skill progression

Status: Partially done

- Convert trophies into product-skill stats such as Experimentation, Monetization, Leadership, and Delivery.
- Animate stat increases when milestones are completed.
- Unlock short summary badges based on collected roles.

Expected impact:
- Better connects the game mechanic to Steven's actual product story.

#### 8. Add branching content per company

Status: Partially done

- Let each milestone reveal one of:
  - impact highlights
  - product challenges
  - tools used
  - outcomes/metrics
- Use tabs or card states instead of a single long text list.

Expected impact:
- Improves scanability and gives more depth without overwhelming the player.

#### 9. Add a final "career build" summary

Status: Open

- After all milestones are completed, generate a final profile card summarizing strengths and experience.
- Include a CTA to resume, LinkedIn, or contact.

Expected impact:
- Converts gameplay into a hiring-oriented payoff.

### P3. Mobile and Accessibility

#### 10. Redesign touch controls

Status: Open

- Replace the current three-button strip with a more ergonomic fixed control layout.
- Add pressed states and larger touch targets.
- Prevent stuck-input edge cases on pointer cancel and drag-off.

Expected impact:
- Mobile play becomes viable instead of merely supported.

#### 11. Add non-platformer accessibility mode

Status: Open

- Offer a reduced-motion or "guided mode" alternative where milestones can be explored without platforming.
- Keep the same content and progression logic.

Expected impact:
- Preserves the Pip-Boy concept while removing a hard interaction barrier for some visitors.

#### 12. Improve text legibility and HUD hierarchy

Status: Partially done

- Increase contrast and spacing in the overlay and popups.
- Reduce visual competition between game HUD and detail card.
- Ensure small-screen popup content is readable without crowding.

Expected impact:
- Keeps the theme but makes the content easier to consume quickly.

### P4. Worldbuilding and Delight

#### 13. Add environmental storytelling

Status: Open

- Add themed set dressing between roles: signage, terminals, billboards, timeline markers.
- Use environmental cues to reinforce company transitions and career progression.

Expected impact:
- Makes the level feel authored rather than a row of platforms.

#### 14. Add light collectible or quest mechanics

Status: Open

- Add optional pickups such as KPI chips, roadmap fragments, or experiment tokens.
- Use them to unlock side facts or bonus achievements.

Expected impact:
- Adds replayability without distracting from the portfolio purpose.

#### 15. Add sound and micro-feedback

Status: Open

- Add jump, collect, UI, and completion sounds.
- Add subtle screen shake, glow, or pulse on milestone unlock.

Expected impact:
- Raises perceived polish quickly.

## Recommended Implementation Order

1. Stabilize architecture and remove lint issues.
2. Add test hooks and automated gameplay validation.
3. Improve onboarding, controls, and objective clarity.
4. Refine movement and interaction model.
5. Rework progression into skill/stat-based storytelling.
6. Improve mobile/accessibility paths.
7. Add worldbuilding and polish.

## Good First Tasks I Can Implement Immediately

- Fix the lint and React structure issues.
- Add a clearer objective/instruction layer.
- Add interact prompts and better milestone feedback.
- Add a quest completion state.
- Improve mobile controls.
- Add `render_game_to_text` and deterministic stepping for testing.

## Notes

- The current build succeeds, but lint is not clean.
- Build output includes a very large JS chunk and several heavy image assets, so performance optimization should be considered after the core gameplay loop is stabilized.
