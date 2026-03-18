import glitchBugSheet from '../assets/enemies/extracted/glitch_bug_art_only.png'
import legacyBeastSheet from '../assets/enemies/extracted/legacy_beast_art_only.png'
import stakeholderSheet from '../assets/enemies/extracted/stakeholder_art_only.png'
import stakeholderProjectile from '../assets/enemies/extracted/stakeholder_asap_projectile.png'

const enemySprites = {
  glitchBug: {
    id: 'glitch-bug',
    label: 'The Glitch-Bug',
    role: 'grunt',
    sheet: glitchBugSheet,
  },
  legacyBeast: {
    id: 'legacy-beast',
    label: 'The Legacy Beast',
    role: 'brute',
    sheet: legacyBeastSheet,
  },
  stakeholder: {
    id: 'stakeholder',
    label: 'The Stakeholder',
    role: 'elite-ranged',
    sheet: stakeholderSheet,
    projectile: stakeholderProjectile,
    frameWidth: 256,
    frameHeight: 256,
  },
}

export default enemySprites
