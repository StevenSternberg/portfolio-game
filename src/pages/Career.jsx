import { useMemo, useState } from 'react'
import CareerGame from '../components/CareerGame'
import PixelLogo from '../components/PixelLogo'
import careerEntries from '../data/careerEntries'

const Career = () => {
  const [activeEntry, setActiveEntry] = useState(null)
  const [collectedIds, setCollectedIds] = useState([])

  const stats = useMemo(() => {
    const base = {
      agile: 0,
      monetization: 0,
      experimentation: 0,
      leadership: 0,
    }
    collectedIds.forEach((id) => {
      const entry = careerEntries.find((item) => item.id === id)
      if (entry?.stat) {
        base[entry.stat] += 1
      }
    })
    return base
  }, [collectedIds])

  const handleCollect = (id) => {
    if (!id) {
      return
    }
    setCollectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="page-kicker">Career path</p>
          <h1>Career Quest</h1>
          <p>
            Traverse the milestones, explore impact, and discover how each role
            shaped product outcomes.
          </p>
        </div>
      </header>

      <section className="career-intro">
        <div className="career-intro-copy">
          <h2>Play as Steven</h2>
          <p>
            Navigate the timeline as a character. Touch each milestone to reveal
            the story behind the role.
          </p>
        </div>
      </section>

      <section className="career-stage">
        <CareerGame
          entries={careerEntries}
          collectedIds={collectedIds}
          stats={stats}
          onCollect={handleCollect}
          onSelect={setActiveEntry}
        />

        {activeEntry && (
          <div className="career-popup">
            <div className="career-popup-card">
              <button
                className="career-popup-close"
                type="button"
                onClick={() => setActiveEntry(null)}
                aria-label="Close details"
              >
                ×
              </button>
              <div className="career-card-top">
                <PixelLogo
                  src={activeEntry.logo}
                  alt={`${activeEntry.company} logo`}
                  width={170}
                  height={120}
                  pixelSize={2}
                  backgroundColor={
                    activeEntry.company === 'Zattoo' ? 'rgba(255, 255, 255, 0.9)' : undefined
                  }
                />
                <div>
                  <p className="career-company">{activeEntry.company}</p>
                  <h3 className="career-role">{activeEntry.role}</h3>
                  <p className="career-period">{activeEntry.period}</p>
                  {activeEntry.url && (
                    <a
                      className="career-link"
                      href={activeEntry.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit company site
                    </a>
                  )}
                </div>
              </div>
              <ul className="career-list">
                {activeEntry.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className="logo-strip">
        <div>
          <h2>Companies</h2>
          <p>Pixel-art logos that anchor the timeline visually.</p>
        </div>
        <div className="logo-grid">
          {careerEntries.map((entry) => (
            <a
              className="logo-card"
              key={entry.id}
              href={entry.url}
              target="_blank"
              rel="noreferrer"
            >
              <PixelLogo
                src={entry.logo}
                alt={`${entry.company} logo`}
                width={220}
                height={140}
                pixelSize={2}
                backgroundColor={
                  entry.company === 'Zattoo' ? 'rgba(255, 255, 255, 0.9)' : undefined
                }
              />
              <span>{entry.company}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Career
