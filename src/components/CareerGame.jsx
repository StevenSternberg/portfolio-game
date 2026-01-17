import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import playerSprite from '../assets/Character/Bildschirmfoto 2026-01-17 um 00.40.11.png'
import skyLayer from '../assets/backgrounds/ChatGPT Image 17. Jan. 2026, 22_44_55.png'
import midLayer from '../assets/backgrounds/ChatGPT Image 17. Jan. 2026, 22_46_11.png'
import foreLayer from '../assets/backgrounds/ChatGPT Image 17. Jan. 2026, 22_46_16.png'

const CareerGame = ({ entries = [], collectedIds = [], stats, onCollect, onSelect }) => {
  const containerRef = useRef(null)
  const gameRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current || entries.length === 0) {
      return
    }

    class CareerScene extends Phaser.Scene {
      constructor() {
        super('career')
        this.player = null
        this.playerLabel = null
        this.cursors = null
        this.infoText = null
        this.milestones = []
        this.activeMilestone = null
        this.activeMarker = null
        this.spaceKey = null
      }

      preload() {
        entries.forEach((entry) => {
          this.load.image(entry.logoKey, entry.logo)
        })
        this.load.image('player', playerSprite)
        this.load.image('bg-sky', skyLayer)
        this.load.image('bg-mid', midLayer)
        this.load.image('bg-fore', foreLayer)
      }

      create() {
        const { width, height } = this.scale
        const levelWidth = Math.max(width, 360 * (entries.length + 1))
        const groundY = height * 0.78
        const baseMarkerHeight = 92

        const mid = this.add.tileSprite(0, 0, levelWidth, height, 'bg-mid')
        mid.setOrigin(0, 0)
        mid.setScrollFactor(0.45)
        mid.setDepth(0)

        this.cameras.main.setBounds(0, 0, levelWidth, height)
        this.physics.world.setBounds(0, 0, levelWidth, height)

        const grid = this.add.graphics()
        grid.lineStyle(1, 0x1d2b48, 0.5)
        for (let x = 0; x < levelWidth; x += 32) {
          grid.lineBetween(x, 0, x, height)
        }
        for (let y = 0; y < height; y += 32) {
          grid.lineBetween(0, y, levelWidth, y)
        }

        const horizon = this.add.rectangle(
          levelWidth / 2,
          height * 0.68,
          levelWidth,
          4,
          0xfca311,
        )
        horizon.setAlpha(0.6)

        const ground = this.add.rectangle(levelWidth / 2, groundY, levelWidth, 24, 0x101a30)
        this.physics.add.existing(ground, true)
        ground.setDepth(3)

        const player = this.physics.add.image(80, groundY - 80, 'player')
        player.setDisplaySize(56, 56)
        player.body.setSize(player.displayWidth * 0.6, player.displayHeight * 0.7, true)
        player.body.setCollideWorldBounds(true)
        player.body.setDrag(800, 0)
        player.body.setMaxVelocity(260, 520)
        player.setDepth(6)
        this.player = player

        this.cameras.main.startFollow(player, true, 0.08, 0.08)

        this.playerLabel = this.add.text(player.x - 28, player.y - 52, 'Steven', {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '9px',
          color: '#fca311',
        })
        this.playerLabel.setDepth(6)

        const startX = 220
        const step = (levelWidth - startX - 120) / (entries.length - 1)
        const platformGroup = this.physics.add.staticGroup()

        this.milestones = entries.map((entry, index) => {
          const x = startX + step * index
        const laneOffset = entry.lane === 1 ? 90 : 60
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
            y - 46,
            baseMarkerWidth + 16,
            baseMarkerHeight + 16,
            badgeColor,
            badgeAlpha,
          )
          badge.setStrokeStyle(2, 0xfca311, 0.5)
          badge.setDepth(4)

          const marker = this.add.image(x, y - 46, entry.logoKey)
          marker.setDisplaySize(baseMarkerWidth, baseMarkerHeight)
          marker.setDepth(5)
          marker.hitRadius = Math.max(baseMarkerWidth, baseMarkerHeight) / 2

          const tag = this.add.text(x - 40, y - 116, entry.year, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#f8f5f2',
          })
          tag.setDepth(5)

          const name = this.add.text(x - 56, y + 14, entry.company, {
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
        this.infoText.setText('Arrow keys to move. Space to jump. Land on logos.')
        this.infoText.setScrollFactor(0)

        this.physics.add.collider(player, ground)
        this.physics.add.collider(player, platformGroup, (playerBody, platformBody) => {
          const platform = platformBody
          const entry = platform.entry
          if (!entry || this.activeMilestone === entry) {
            return
          }
          if (playerBody.body.velocity.y >= 0 && playerBody.y < platform.y) {
            this.activeMilestone = entry
            this.activeMarker = platform
            platform.marker.setDisplaySize(
              platform.baseWidth + 14,
              platform.baseHeight + 14,
            )
            platform.badge.setStrokeStyle(2, 0xfca311, 0.9)
            this.infoText.setText(
              `${entry.year} | ${entry.company} - ${entry.role}\nTap the card below for details.`,
            )
            if (onCollect) {
              onCollect(entry.id)
            }
            if (onSelect) {
              onSelect(entry)
            }
          }
        })

        this.cursors = this.input.keyboard.createCursorKeys()
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      }

      update() {
        const speed = 200
        const body = this.player.body

        if (this.cursors.left.isDown) {
          body.setVelocityX(-speed)
        } else if (this.cursors.right.isDown) {
          body.setVelocityX(speed)
        } else {
          body.setVelocityX(0)
        }

        if (this.spaceKey.isDown && body.blocked.down) {
          body.setVelocityY(-420)
        }

        if (this.playerLabel) {
          this.playerLabel.setPosition(this.player.x - 24, this.player.y - 38)
        }

        if (this.activeMilestone && this.activeMarker) {
          const dx = this.player.x - this.activeMarker.marker.x
          const dy = this.player.y - this.activeMarker.marker.y
          const distance = Math.hypot(dx, dy)
          const threshold =
            Math.max(this.activeMarker.baseWidth, this.activeMarker.baseHeight) * 0.75
          if (distance > threshold) {
            this.activeMarker.marker.setDisplaySize(
              this.activeMarker.baseWidth,
              this.activeMarker.baseHeight,
            )
            this.activeMarker.badge.setStrokeStyle(2, 0xfca311, 0.5)
            this.activeMilestone = null
            this.activeMarker = null
            this.infoText.setText('Arrow keys to move. Space to jump. Land on logos.')
            if (onSelect) {
              onSelect(null)
            }
          }
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#0b1020',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 720 },
          debug: false,
        },
      },
      scene: [CareerScene],
    }

    const game = new Phaser.Game(config)
    gameRef.current = game

    const handleResize = () => {
      if (!containerRef.current || !gameRef.current) {
        return
      }
      const { clientWidth, clientHeight } = containerRef.current
      gameRef.current.scale.resize(clientWidth, clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <section className="game-shell">
      <div className="game-overlay">
        <div className="hud">
          <span className="hud-title">Career Quest</span>
          <span className="hud-text">Playable timeline of product impact.</span>
        </div>
        <div className="hud-right">
          <div className="hud-badges">
            {entries.map((entry) => (
              <span
                key={entry.id}
                className={`hud-badge${collectedIds.includes(entry.id) ? ' is-on' : ''}`}
              >
                {entry.badge}
              </span>
            ))}
          </div>
          <div className="hud-stats">
            {stats && (
              <>
                <div className="stat-row">
                  <span>Agile</span>
                  <div className="stat-dots">
                    <span className={`stat-dot${stats.agile ? ' is-on' : ''}`} />
                  </div>
                </div>
                <div className="stat-row">
                  <span>Monetization</span>
                  <div className="stat-dots">
                    <span className={`stat-dot${stats.monetization ? ' is-on' : ''}`} />
                  </div>
                </div>
                <div className="stat-row">
                  <span>Experimentation</span>
                  <div className="stat-dots">
                    <span className={`stat-dot${stats.experimentation ? ' is-on' : ''}`} />
                  </div>
                </div>
                <div className="stat-row">
                  <span>Leadership</span>
                  <div className="stat-dots">
                    <span className={`stat-dot${stats.leadership ? ' is-on' : ''}`} />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="hud-legend">
            <span>Arrow keys to move</span>
            <span>Touch markers for highlights</span>
          </div>
        </div>
      </div>
      <div className="game-container" ref={containerRef} />
    </section>
  )
}

export default CareerGame
