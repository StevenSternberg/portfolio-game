import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

const CareerGame = ({ entries = [], onSelect }) => {
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
      }

      preload() {
        entries.forEach((entry) => {
          this.load.image(entry.logoKey, entry.logo)
        })
      }

      create() {
        const { width, height } = this.scale
        const baseMarkerHeight = 42

        const grid = this.add.graphics()
        grid.lineStyle(1, 0x1d2b48, 0.6)
        for (let x = 0; x < width; x += 32) {
          grid.lineBetween(x, 0, x, height)
        }
        for (let y = 0; y < height; y += 32) {
          grid.lineBetween(0, y, width, y)
        }

        const horizon = this.add.rectangle(
          width / 2,
          height * 0.68,
          width,
          4,
          0xfca311,
        )
        horizon.setAlpha(0.7)

        const player = this.add.rectangle(90, height * 0.6, 22, 22, 0xf8f5f2)
        this.physics.add.existing(player)
        player.body.setCollideWorldBounds(true)
        player.body.setDrag(900, 900)
        player.body.setMaxVelocity(220, 220)
        this.player = player

        this.playerLabel = this.add.text(player.x - 20, player.y - 30, 'Steven', {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '9px',
          color: '#fca311',
        })

        const startX = 170
        const endX = width - 120
        const step = (endX - startX) / (entries.length - 1)

        this.milestones = entries.map((entry, index) => {
          const x = startX + step * index
          const y = height * 0.6 + (index % 2 === 0 ? -40 : 30)
          const texture = this.textures.get(entry.logoKey)
          texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
          const source = texture.getSourceImage()
          const ratio = source ? source.width / source.height : 1
          const baseMarkerWidth = Math.min(64, Math.round(baseMarkerHeight * ratio))
          const badgeWidth = baseMarkerWidth + 12
          const badgeHeight = baseMarkerHeight + 12
          const isZattoo = entry.company === 'Zattoo'
          const badgeColor = isZattoo ? 0xffffff : 0x0b1020
          const badgeAlpha = isZattoo ? 0.9 : 0.75
          const badge = this.add.rectangle(x, y, badgeWidth, badgeHeight, badgeColor, badgeAlpha)
          badge.setStrokeStyle(2, 0xfca311, 0.5)
          const marker = this.add.image(x, y, entry.logoKey)
          marker.setDisplaySize(baseMarkerWidth, baseMarkerHeight)
          this.physics.add.existing(marker, true)

          const tag = this.add.text(x - 40, y - 34, entry.year, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#f8f5f2',
          })

          const name = this.add.text(x - 56, y + 22, entry.company, {
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '12px',
            color: '#fca311',
          })

          this.physics.add.overlap(player, marker, () => {
            if (this.activeMilestone !== entry) {
              if (this.activeMarker) {
                this.activeMarker.setDisplaySize(
                  this.activeMarker.baseWidth,
                  this.activeMarker.baseHeight,
                )
                this.activeMarker.badge.setStrokeStyle(2, 0xfca311, 0.5)
              }
              this.activeMilestone = entry
              this.activeMarker = marker
              marker.setDisplaySize(marker.baseWidth + 8, marker.baseHeight + 8)
              badge.setStrokeStyle(2, 0xfca311, 0.9)
              this.infoText.setText(
                `${entry.year} | ${entry.company} - ${entry.role}\nTap the card below for details.`,
              )
              if (onSelect) {
                onSelect(entry)
              }
            }
          })

          marker.badge = badge
          marker.baseWidth = baseMarkerWidth
          marker.baseHeight = baseMarkerHeight
          return { marker, badge, tag, name, entry }
        })

        this.infoText = this.add.text(24, height - 92, '', {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '16px',
          color: '#f8f5f2',
          lineSpacing: 8,
          wordWrap: { width: width - 48 },
        })
        this.infoText.setText(
          'Move with arrow keys. Touch milestones to open details below.',
        )

        this.cursors = this.input.keyboard.createCursorKeys()
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

        if (this.cursors.up.isDown) {
          body.setVelocityY(-speed)
        } else if (this.cursors.down.isDown) {
          body.setVelocityY(speed)
        } else {
          body.setVelocityY(0)
        }

        if (this.playerLabel) {
          this.playerLabel.setPosition(this.player.x - 20, this.player.y - 30)
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
          gravity: { y: 0 },
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
        <div className="hud-legend">
          <span>Arrow keys to move</span>
          <span>Touch markers for highlights</span>
        </div>
      </div>
      <div className="game-container" ref={containerRef} />
    </section>
  )
}

export default CareerGame
