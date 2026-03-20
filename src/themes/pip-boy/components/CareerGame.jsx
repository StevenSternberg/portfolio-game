import { useEffect, useMemo, useRef, useState } from 'react'
import Phaser from 'phaser'
import playerSprite from '../../../assets/Character/Sprite_frames_white.png'
import skyLayer from '../../../assets/backgrounds/Sky_final.png'
import midLayer from '../../../assets/backgrounds/Mid_final.png'
import foreLayer from '../../../assets/backgrounds/fore_final.png'

const PLAYER_FRAME_WIDTH = 576
const PLAYER_FRAME_HEIGHT = 928
const PLAYER_SCALE = 0.11
const DEFAULT_INFO_TEXT = 'Arrow keys to move. Space to jump. Land on logos.'
const DESKTOP_JUMP_VELOCITY = -420
const COMPACT_LANDSCAPE_JUMP_VELOCITY = -780

const sceneStore = {
  callbacksRef: null,
  collectedIds: [],
  entries: [],
  inputRef: null,
  scene: null,
  startedRef: null,
}

const setDebugHooks = (game) => {
  window.render_game_to_text = () => {
    const scene = sceneStore.scene
    const body = scene?.player?.body
    const payload = {
      coordinateSystem: 'origin top-left; x increases right; y increases downward',
      mode: scene ? 'running' : 'loading',
      objective: `Collect ${sceneStore.entries.length} milestones`,
      started: Boolean(sceneStore.startedRef?.current),
      player: scene?.player
        ? {
            x: Math.round(scene.player.x),
            y: Math.round(scene.player.y),
            velocityX: Math.round(body?.velocity?.x ?? 0),
            velocityY: Math.round(body?.velocity?.y ?? 0),
            onGround: Boolean(body?.blocked?.down),
          }
        : null,
      activeMilestone: scene?.activeMilestone?.id ?? null,
      collectedIds: sceneStore.collectedIds,
    }

    return JSON.stringify(payload)
  }

  window.advanceTime = (ms = 16) => {
    if (!game || typeof game.step !== 'function') {
      return
    }

    const steps = Math.max(1, Math.round(ms / (1000 / 60)))
    for (let index = 0; index < steps; index += 1) {
      game.step(index * (1000 / 60), 1000 / 60)
    }
  }
}

const clearDebugHooks = () => {
  delete window.render_game_to_text
  delete window.advanceTime
}

class CareerScene extends Phaser.Scene {
  constructor() {
    super('career')
    this.player = null
    this.cursors = null
    this.infoText = null
    this.milestones = []
    this.activeMilestone = null
    this.activeMarker = null
    this.spaceKey = null
    this.compactLandscape = false
  }

  preload() {
    sceneStore.entries.forEach((entry) => {
      this.load.image(entry.logoKey, entry.logo)
    })
    this.load.spritesheet('player', playerSprite, {
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
    })
    this.load.image('bg-sky', skyLayer)
    this.load.image('bg-mid', midLayer)
    this.load.image('bg-fore', foreLayer)
  }

  create() {
    sceneStore.scene = this

    const entries = sceneStore.entries
    const { width, height } = this.scale
    const compactLandscape = width > height && height <= 320
    this.compactLandscape = compactLandscape
    const topViewPadding = compactLandscape ? 180 : 0
    const levelWidth = Math.max(width, 360 * (entries.length + 1))
    let groundY = height * 0.78
    const baseMarkerHeight = compactLandscape ? 72 : 92

    const skyScale = 0.6
    const sky = this.add.image(0, compactLandscape ? -topViewPadding : 0, 'bg-sky')
    sky.setOrigin(0, 0)
    sky.setDisplaySize(levelWidth, (height + topViewPadding) * 0.7 * skyScale)
    sky.setScrollFactor(0)
    sky.setDepth(0)

    const midScale = 0.8
    const midBaseHeight = Math.round(height * 0.55 * midScale)
    const midHeight = Math.round((height + topViewPadding) * 0.55 * midScale)
    const mid = this.add.image(0, compactLandscape ? -topViewPadding * 0.35 : 0, 'bg-mid')
    mid.setOrigin(0, 0)
    mid.setDisplaySize(levelWidth, midHeight)
    mid.setScrollFactor(0.35)
    mid.setDepth(1)

    const foreTexture = this.textures.get('bg-fore')
    const foreSource = foreTexture.getSourceImage()
    const foreScale = 0.5
    const foreHeight = Math.round(foreSource.height * foreScale)
    const foreY = Math.round(height - foreHeight - 12)
    const fore = this.add.tileSprite(0, foreY, levelWidth / foreScale, foreSource.height, 'bg-fore')
    fore.setOrigin(0, 0)
    fore.setScale(foreScale)
    fore.setScrollFactor(0.7)
    fore.setDepth(2)

    this.cameras.main.setBounds(0, -topViewPadding, levelWidth, height + topViewPadding)
    this.physics.world.setBounds(0, 0, levelWidth, height)

    const midBaseY = foreY - midBaseHeight
    mid.setY(midBaseY + (compactLandscape ? -topViewPadding * 0.15 : 0))
    const midFloorOffset = Math.round(height * 0.42)
    groundY = midBaseY + midFloorOffset

    const ground = this.add.rectangle(levelWidth / 2, groundY, levelWidth, 24, 0x101a30)
    this.physics.add.existing(ground, true)
    ground.setDepth(3)

    const playerTexture = this.textures.get('player')
    playerTexture.setFilter(Phaser.Textures.FilterMode.NEAREST)

    const player = this.physics.add.sprite(80, groundY - 80, 'player', 0)
    player.setScale(PLAYER_SCALE)
    player.body.setSize(player.displayWidth * 0.5, player.displayHeight * 0.7, true)
    player.body.setCollideWorldBounds(true)
    player.body.setDrag(800, 0)
    player.body.setMaxVelocity(260, this.compactLandscape ? 900 : 520)
    player.body.setGravityY(this.compactLandscape ? -120 : 0)
    player.setDepth(6)
    this.player = player

    if (!this.anims.exists('player-idle')) {
      this.anims.create({
        key: 'player-idle',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
        frameRate: 4,
        repeat: -1,
      })
    }

    if (!this.anims.exists('player-run')) {
      this.anims.create({
        key: 'player-run',
        frames: this.anims.generateFrameNumbers('player', { start: 2, end: 5 }),
        frameRate: 10,
        repeat: -1,
      })
    }

    if (!this.anims.exists('player-jump')) {
      this.anims.create({
        key: 'player-jump',
        frames: [{ key: 'player', frame: 6 }],
        frameRate: 1,
        repeat: 0,
      })
    }

    if (!this.anims.exists('player-fall')) {
      this.anims.create({
        key: 'player-fall',
        frames: [{ key: 'player', frame: 7 }],
        frameRate: 1,
        repeat: 0,
      })
    }

    if (compactLandscape) {
      this.cameras.main.setZoom(0.82)
      this.cameras.main.setFollowOffset(0, 172)
    }

    this.cameras.main.startFollow(player, true, 0.08, 0.08)

    const startX = 220
    const step = entries.length > 1 ? (levelWidth - startX - 120) / (entries.length - 1) : 0
    const platformGroup = this.physics.add.staticGroup()

    this.milestones = entries.map((entry, index) => {
      const x = startX + step * index
      const platformLift = this.compactLandscape
        ? entry.lane === 1
          ? 42
          : 28
        : entry.lane === 1
          ? 90
          : 60
      const markerLift = this.compactLandscape ? 28 : 46
      const yearLift = this.compactLandscape ? 72 : 116
      const companyLabelOffset = this.compactLandscape ? 10 : 14
      const laneOffset = this.compactLandscape
        ? platformLift
        : entry.lane === 1
          ? 90
          : 60
      const y = groundY - laneOffset

      const platformWidth = 170
      const platform = this.add.rectangle(x, y, platformWidth, 18, 0x1a243d)
      this.physics.add.existing(platform, true)
      platformGroup.add(platform)

      const texture = this.textures.get(entry.logoKey)
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
      const source = texture.getSourceImage()
      const ratio = source ? source.width / source.height : 1
      const baseMarkerWidth = Math.min(180, Math.round(baseMarkerHeight * ratio))
      const isZattoo = entry.company === 'Zattoo'
      const badgeColor = isZattoo ? 0xffffff : 0x0b1020
      const badgeAlpha = isZattoo ? 0.9 : 0.75
      const badge = this.add.rectangle(
        x,
        y - markerLift,
        baseMarkerWidth + 16,
        baseMarkerHeight + 16,
        badgeColor,
        badgeAlpha,
      )
      badge.setStrokeStyle(2, 0xfca311, 0.5)
      badge.setDepth(4)

      const marker = this.add.image(x, y - markerLift, entry.logoKey)
      marker.setDisplaySize(baseMarkerWidth, baseMarkerHeight)
      marker.setDepth(5)

      const tag = this.add.text(x - 40, y - yearLift, entry.year, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#f8f5f2',
      })
      tag.setDepth(5)

      const name = this.add.text(x - 56, y + companyLabelOffset, entry.company, {
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '12px',
        color: '#fca311',
      })
      name.setDepth(5)

      platform.entry = entry
      platform.marker = marker
      platform.badge = badge
      platform.baseWidth = baseMarkerWidth
      platform.baseHeight = baseMarkerHeight
      return { platform, marker, badge, tag, name, entry }
    })

    this.infoText = this.add.text(24, height - 92, '', {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '16px',
      color: '#f8f5f2',
      lineSpacing: 8,
      wordWrap: { width: width - 48 },
    })
    this.infoText.setText(DEFAULT_INFO_TEXT)
    this.infoText.setScrollFactor(0)

    this.physics.add.collider(player, ground)
    this.physics.add.collider(player, platformGroup, (playerBody, platformBody) => {
      const platform = platformBody
      const entry = platform.entry
      if (!entry || this.activeMilestone === entry) {
        return
      }

      if (playerBody.body.velocity.y >= 0 && playerBody.y < platform.y) {
        this.activateMilestone(entry, platform)
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.events.once('shutdown', () => {
      if (sceneStore.scene === this) {
        sceneStore.scene = null
      }
    })
  }

  activateMilestone(entry, platform) {
    this.activeMilestone = entry
    this.activeMarker = platform
    platform.marker.setDisplaySize(platform.baseWidth + 14, platform.baseHeight + 14)
    platform.badge.setStrokeStyle(2, 0xfca311, 0.9)
    this.infoText.setText(`${entry.year} | ${entry.company} - ${entry.role}\nTap the card below for details.`)

    const callbacks = sceneStore.callbacksRef?.current
    callbacks?.onCollect?.(entry.id)
    callbacks?.onSelect?.(entry)
  }

  clearActiveMilestone() {
    if (!this.activeMilestone || !this.activeMarker) {
      return
    }

    this.activeMarker.marker.setDisplaySize(this.activeMarker.baseWidth, this.activeMarker.baseHeight)
    this.activeMarker.badge.setStrokeStyle(2, 0xfca311, 0.5)
    this.activeMilestone = null
    this.activeMarker = null
    this.infoText.setText(DEFAULT_INFO_TEXT)

    const callbacks = sceneStore.callbacksRef?.current
    callbacks?.onSelect?.(null)
  }

  update() {
    if (!this.player) {
      return
    }

    const speed = 200
    const body = this.player.body
    const hasStarted = sceneStore.startedRef?.current ?? false
    const input = hasStarted
      ? sceneStore.inputRef?.current ?? { jump: false, left: false, right: false }
      : { jump: false, left: false, right: false }

    const leftPressed = hasStarted && (this.cursors.left.isDown || input.left)
    const rightPressed = hasStarted && (this.cursors.right.isDown || input.right)

    if (leftPressed) {
      body.setVelocityX(-speed)
      this.player.setFlipX(true)
    } else if (rightPressed) {
      body.setVelocityX(speed)
      this.player.setFlipX(false)
    } else {
      body.setVelocityX(0)
    }

    if (hasStarted && (this.spaceKey.isDown || input.jump) && body.blocked.down) {
      body.setVelocityY(
        this.compactLandscape ? COMPACT_LANDSCAPE_JUMP_VELOCITY : DESKTOP_JUMP_VELOCITY,
      )
    }

    if (!body.blocked.down) {
      if (body.velocity.y < 0) {
        this.player.anims.play('player-jump', true)
      } else {
        this.player.anims.play('player-fall', true)
      }
    } else if (Math.abs(body.velocity.x) > 5) {
      this.player.anims.play('player-run', true)
    } else {
      this.player.anims.play('player-idle', true)
    }

    if (this.activeMilestone && this.activeMarker) {
      const dx = this.player.x - this.activeMarker.marker.x
      const dy = this.player.y - this.activeMarker.marker.y
      const distance = Math.hypot(dx, dy)
      const threshold = Math.max(this.activeMarker.baseWidth, this.activeMarker.baseHeight) * 0.75
      if (distance > threshold) {
        this.clearActiveMilestone()
      }
    }
  }
}

const CareerGame = ({
  entries = [],
  collectedIds = [],
  lastCollectedId,
  onCollect,
  onSelect,
}) => {
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const inputRef = useRef({ left: false, right: false, jump: false })
  const callbacksRef = useRef({ onCollect, onSelect })
  const startedRef = useRef(false)
  const lastSizeRef = useRef({ width: 0, height: 0 })
  const [hasStarted, setHasStarted] = useState(false)
  const [metaOpen, setMetaOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const landscapeMobileQuery = window.matchMedia('(max-width: 900px) and (orientation: landscape)')
    const syncAutoStart = () => {
      if (landscapeMobileQuery.matches) {
        setHasStarted(true)
      }
    }

    syncAutoStart()
    landscapeMobileQuery.addEventListener('change', syncAutoStart)

    return () => {
      landscapeMobileQuery.removeEventListener('change', syncAutoStart)
    }
  }, [])

  const latestEntry = useMemo(
    () => entries.find((entry) => entry.id === lastCollectedId) ?? null,
    [entries, lastCollectedId],
  )

  useEffect(() => {
    callbacksRef.current = { onCollect, onSelect }
  }, [onCollect, onSelect])

  useEffect(() => {
    startedRef.current = hasStarted
  }, [hasStarted])

  useEffect(() => {
    sceneStore.collectedIds = collectedIds
  }, [collectedIds])

  useEffect(() => {
    if (!containerRef.current || gameRef.current || entries.length === 0) {
      return undefined
    }

    sceneStore.entries = entries
    sceneStore.inputRef = inputRef
    sceneStore.callbacksRef = callbacksRef
    sceneStore.startedRef = startedRef

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#0b1020',
      input: {
        mouse: {
          capture: false,
          preventDefaultDown: false,
          preventDefaultMove: false,
          preventDefaultUp: false,
          preventDefaultWheel: false,
        },
        touch: {
          capture: false,
          preventDefault: false,
        },
        keyboard: { capture: [] },
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 720 },
          debug: false,
        },
      },
      scene: [CareerScene],
    })

    gameRef.current = game
    setDebugHooks(game)

    const handleResize = () => {
      if (!containerRef.current || !gameRef.current) {
        return
      }

      const { clientWidth, clientHeight } = containerRef.current
      if (!clientWidth || !clientHeight) {
        return
      }

      const widthChanged = Math.abs(clientWidth - lastSizeRef.current.width) > 2
      const heightChanged = Math.abs(clientHeight - lastSizeRef.current.height) > 2

      if (!widthChanged && !heightChanged) {
        return
      }

      lastSizeRef.current = { width: clientWidth, height: clientHeight }
      gameRef.current.scale.resize(clientWidth, clientHeight)

      const activeScene = gameRef.current.scene.getScene('career')
      if (activeScene) {
        activeScene.scene.restart()
      }
    }

    const handleResponsiveResize = () => {
      window.requestAnimationFrame(() => {
        handleResize()
        window.setTimeout(handleResize, 120)
      })
    }

    window.addEventListener('resize', handleResponsiveResize)
    window.addEventListener('orientationchange', handleResponsiveResize)
    window.visualViewport?.addEventListener('resize', handleResponsiveResize)

    const resizeObserver = new ResizeObserver(() => {
      handleResponsiveResize()
    })
    resizeObserver.observe(containerRef.current)

    handleResponsiveResize()

    return () => {
      window.removeEventListener('resize', handleResponsiveResize)
      window.removeEventListener('orientationchange', handleResponsiveResize)
      window.visualViewport?.removeEventListener('resize', handleResponsiveResize)
      resizeObserver.disconnect()
      clearDebugHooks()
      game.destroy(true)
      gameRef.current = null
      sceneStore.scene = null
    }
  }, [entries])

  return (
    <section className="game-shell">
      <div className={`game-meta-bar${metaOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          className="game-meta-toggle"
          onClick={() => setMetaOpen((value) => !value)}
          aria-expanded={metaOpen}
          aria-controls="game-meta-content"
        >
          {metaOpen ? 'Hide mission info' : 'Show mission info'}
        </button>
        <div className="game-meta-content" id="game-meta-content">
        <div className="game-meta-card">
          <p className="hud-label">Objective</p>
          <p className="hud-text">Collect all {entries.length} milestones and open each story card.</p>
        </div>
        <div className="game-meta-card">
          <p className="hud-label">Controls</p>
          <div className="hud-legend">
            <span>Desktop: arrows + space</span>
            <span>Touch: move pad + jump</span>
          </div>
        </div>
        </div>
      </div>
      <div className="game-overlay">
        <div className="hud">
          <span className="hud-title">Career Quest</span>
        </div>
        <div className="hud-right">
          <div className="hud-panel hud-panel--compact">
            <p className="hud-label">Progress</p>
            <p className="hud-progress">{collectedIds.length}/{entries.length} milestones unlocked</p>
          </div>
          <div className="hud-trophy-row">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`hud-trophy-chip${collectedIds.includes(entry.id) ? ' is-on' : ''}`}
                title={entry.badge}
              >
                <img src={entry.trophy} alt={`${entry.badge} trophy`} />
              </div>
            ))}
          </div>
          {entries.length > 0 && collectedIds.length === entries.length && (
            <div className="hud-complete">Quest Complete</div>
          )}
          {lastCollectedId && latestEntry && (
            <div className="hud-trophy">
              <img src={latestEntry.trophy} alt="Latest trophy" />
              <span>{latestEntry.badge} unlocked</span>
            </div>
          )}
        </div>
      </div>
      {!hasStarted && (
        <div className="game-start-panel">
          <div className="game-start-card">
            <p className="game-start-kicker">Quest briefing</p>
            <h3>Traverse the career timeline</h3>
            <p>
              Start at the left, jump onto each company marker, and open the detail card to
              inspect the role, impact, and unlocked product skill.
            </p>
            <div className="game-start-list">
              <span>Goal: unlock all {entries.length} milestones</span>
              <span>Desktop: arrows to move, space to jump</span>
              <span>Touch: use the on-screen controls</span>
            </div>
            <button
              type="button"
              className="game-start-action"
              onClick={() => {
                setHasStarted(true)
                containerRef.current?.focus()
              }}
            >
              Begin quest
            </button>
          </div>
        </div>
      )}
      {lastCollectedId && latestEntry && hasStarted && (
        <div key={lastCollectedId} className="game-toast" role="status" aria-live="polite">
          <span className="game-toast-label">Milestone unlocked</span>
          <strong>{latestEntry.company}</strong>
          <span>{latestEntry.badge} skill added</span>
        </div>
      )}
      <div className="mobile-controls">
        <div className="control-cluster control-cluster--move">
          <button
            type="button"
            className="control-btn"
            disabled={!hasStarted}
            onPointerDown={(event) => {
              event.preventDefault()
              inputRef.current.left = true
            }}
            onPointerUp={(event) => {
              event.preventDefault()
              inputRef.current.left = false
            }}
            onPointerLeave={(event) => {
              event.preventDefault()
              inputRef.current.left = false
            }}
            onContextMenu={(event) => event.preventDefault()}
          >
            ◀
          </button>
          <button
            type="button"
            className="control-btn"
            disabled={!hasStarted}
            onPointerDown={(event) => {
              event.preventDefault()
              inputRef.current.right = true
            }}
            onPointerUp={(event) => {
              event.preventDefault()
              inputRef.current.right = false
            }}
            onPointerLeave={(event) => {
              event.preventDefault()
              inputRef.current.right = false
            }}
            onContextMenu={(event) => event.preventDefault()}
          >
            ▶
          </button>
        </div>
        <button
          type="button"
          className="control-btn control-jump"
          disabled={!hasStarted}
          onPointerDown={(event) => {
            event.preventDefault()
            inputRef.current.jump = true
          }}
          onPointerUp={(event) => {
            event.preventDefault()
            inputRef.current.jump = false
          }}
          onPointerLeave={(event) => {
            event.preventDefault()
            inputRef.current.jump = false
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          ⤒
        </button>
      </div>
      <div className="game-container" ref={containerRef} tabIndex={-1} />
    </section>
  )
}

export default CareerGame
