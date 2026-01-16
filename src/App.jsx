import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import './App.css'

function App() {
  const containerRef = useRef(null)
  const gameRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return
    }

    const milestones = [
      {
        year: '2012',
        label: 'mybet',
        role: 'Product Owner',
        detail: 'Built sportsbook features and integrations in Scrum.',
      },
      {
        year: '2018',
        label: 'Spark Networks',
        role: 'PM Monetization',
        detail: 'Led billing + affiliate platform migration.',
      },
      {
        year: '2020',
        label: 'Quandoo',
        role: 'Senior PO B2B',
        detail: 'Defined roadmap, MVPs, and OKR delivery.',
      },
      {
        year: '2020',
        label: 'Zattoo',
        role: 'Senior PO DTC',
        detail: 'A/B testing to lift conversion and retention.',
      },
      {
        year: '2025',
        label: 'Zattoo',
        role: 'Principal PM',
        detail: 'Stakeholder alignment and strategic roadmap ownership.',
      },
    ]

    class CareerScene extends Phaser.Scene {
      constructor() {
        super('career')
        this.player = null
        this.cursors = null
        this.infoText = null
        this.milestones = []
        this.activeMilestone = null
      }

      create() {
        const { width, height } = this.scale

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

        const startX = 170
        const endX = width - 120
        const step = (endX - startX) / (milestones.length - 1)

        this.milestones = milestones.map((entry, index) => {
          const x = startX + step * index
          const y = height * 0.6 + (index % 2 === 0 ? -40 : 30)
          const marker = this.add.rectangle(x, y, 20, 20, 0x3a86ff)
          this.physics.add.existing(marker, true)

          const tag = this.add.text(x - 40, y - 34, entry.year, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#f8f5f2',
          })

          const name = this.add.text(x - 56, y + 22, entry.label, {
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '12px',
            color: '#fca311',
          })

          this.physics.add.overlap(player, marker, () => {
            if (this.activeMilestone !== entry) {
              this.activeMilestone = entry
              this.infoText.setText(
                `${entry.year} | ${entry.label} - ${entry.role}\n${entry.detail}`,
              )
            }
          })

          return { marker, tag, name, entry }
        })

        this.infoText = this.add.text(24, height - 92, '', {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '16px',
          color: '#f8f5f2',
          lineSpacing: 8,
          wordWrap: { width: width - 48 },
        })
        this.infoText.setText(
          'Move with arrow keys. Touch milestones to reveal career highlights.',
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
    <div className="app">
      <header className="hero">
        <div>
          <p className="hero-kicker">Steven Sternberg</p>
          <h1>Senior Product Manager</h1>
          <p className="hero-subtitle">
            I turn customer problems into measurable outcomes through strategy,
            stakeholder alignment, and decisive prioritization.
          </p>
        </div>
        <div className="hero-meta">
          <p>Berlin, Germany</p>
          <p>10+ years in B2C/B2B SaaS, streaming, and marketplaces</p>
          <div className="hero-links">
            <a href="mailto:stevensternberg2105@gmail.com">Email</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <section className="game-shell">
        <div className="game-overlay">
          <div className="hud">
            <span className="hud-title">Career Quest</span>
            <span className="hud-text">
              Playable timeline of product impact.
            </span>
          </div>
          <div className="hud-legend">
            <span>Arrow keys to move</span>
            <span>Touch markers for highlights</span>
          </div>
        </div>
        <div className="game-container" ref={containerRef} />
      </section>

      <footer className="footer">
        <div>
          <h2>Now</h2>
          <p>
            Principal PM at Zattoo, leading stakeholder alignment and roadmap
            prioritization for DTC growth.
          </p>
        </div>
        <div>
          <h2>Focus</h2>
          <p>Conversion optimization, monetization, and team enablement.</p>
        </div>
        <div>
          <h2>Links</h2>
          <p>
            <a href="mailto:stevensternberg2105@gmail.com">Email</a> ·{' '}
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
