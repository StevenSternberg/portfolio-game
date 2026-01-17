import { useEffect, useState } from 'react'
import CareerGame from '../components/CareerGame'
import PixelLogo from '../components/PixelLogo'
import careerEntries from '../data/careerEntries'

const Career = () => {
  const [activeEntry, setActiveEntry] = useState(null)

  useEffect(() => {
    if (!activeEntry) {
      return undefined
    }

    const timer = setTimeout(() => {
      setActiveEntry(null)
    }, 6000)

    return () => clearTimeout(timer)
  }, [activeEntry])

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
        <CareerGame entries={careerEntries} onSelect={setActiveEntry} />

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
            <div className="logo-card" key={entry.id}>
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
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Career
