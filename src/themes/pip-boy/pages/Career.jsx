import { useEffect, useMemo, useState } from 'react'
import CareerGame from '../components/CareerGame'
import PixelLogo from '../components/PixelLogo'
import careerEntries from '../../../data/careerEntries'

const Career = () => {
  const [activeEntry, setActiveEntry] = useState(null)
  const [collectedIds, setCollectedIds] = useState([])
  const [lastCollectedId, setLastCollectedId] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [isPortraitMobile, setIsPortraitMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const portraitMobileQuery = window.matchMedia('(max-width: 900px) and (orientation: portrait)')
    const syncPortraitMode = () => {
      setIsPortraitMobile(portraitMobileQuery.matches)
    }

    syncPortraitMode()
    portraitMobileQuery.addEventListener('change', syncPortraitMode)
    window.addEventListener('resize', syncPortraitMode)
    window.addEventListener('orientationchange', syncPortraitMode)

    return () => {
      portraitMobileQuery.removeEventListener('change', syncPortraitMode)
      window.removeEventListener('resize', syncPortraitMode)
      window.removeEventListener('orientationchange', syncPortraitMode)
    }
  }, [])

  const handleSelectEntry = (entry) => {
    setActiveEntry(entry)
    setShowMore(false)
  }

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
    setLastCollectedId(id)
  }

  const visibleHighlights = activeEntry ? activeEntry.highlights.slice(0, 3) : []
  const extraHighlights = activeEntry ? activeEntry.highlights.slice(3) : []

  return (
    <div className="page">
      <section className="career-shell">
        <header className="career-shell-header">
          <div className="career-shell-title">
            <h1>Career Quest</h1>
          </div>
          <p className="career-shell-subtitle">
            Traverse the milestones, explore impact, and discover how each role
            shaped product outcomes.
          </p>
        </header>

        <section className="career-stage">
          <div className="career-mobile-rotate-overlay" aria-hidden="true">
            <div className="career-mobile-rotate-hint">
              <span className="career-mobile-kicker">Arcade Mode</span>
              <h2>Rotate your phone to landscape to play Career Quest.</h2>
              <p>
                Portrait mode shows the touch timeline. Turn your phone sideways if you want the
                game version.
              </p>
            </div>
          </div>
          <div className="career-mobile-flow">
            <div className="career-mobile-intro">
              <span className="career-mobile-kicker">Touch Timeline</span>
              <h2>Tap a role to inspect the milestone.</h2>
              <p>
                On mobile, the career story works best as a guided timeline. Open any role to
                inspect the outcome, highlights, and unlocked skill.
              </p>
            </div>
            <div className="career-mobile-list" role="list" aria-label="Career timeline">
              {careerEntries.map((entry, index) => {
                const isActive = activeEntry?.id === entry.id
                const isCollected = collectedIds.includes(entry.id)

                return (
                  <button
                    key={entry.id}
                    type="button"
                    className={`career-mobile-card${isActive ? ' is-active' : ''}${
                      isCollected ? ' is-collected' : ''
                    }`}
                    onClick={() => {
                      handleCollect(entry.id)
                      handleSelectEntry(entry)
                    }}
                  >
                    <span className="career-mobile-step">{String(index + 1).padStart(2, '0')}</span>
                    <div className="career-mobile-copy">
                      <div className="career-mobile-head">
                        <p className="career-mobile-company">{entry.company}</p>
                        <span className="career-mobile-badge">{entry.badge}</span>
                      </div>
                      <h3 className="career-mobile-role">{entry.role}</h3>
                      <p className="career-mobile-period">{entry.period}</p>
                      <p className="career-mobile-outcome">{entry.outcome}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          {!isPortraitMobile && (
            <CareerGame
              entries={careerEntries}
              collectedIds={collectedIds}
              lastCollectedId={lastCollectedId}
              onCollect={handleCollect}
              onSelect={handleSelectEntry}
            />
          )}

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
                <div className="career-card-main">
                  <p className="career-company">{activeEntry.company}</p>
                  <h3 className="career-role">{activeEntry.role}</h3>
                  <p className="career-period">{activeEntry.period}</p>
                  <div className="career-tags">
                    <span className="career-tag">{activeEntry.badge}</span>
                  </div>
                </div>
                <div className="career-card-meta">
                  <div className="career-meta-pill">
                    <span className="career-meta-label">Progress</span>
                    <strong className="career-meta-value">
                      {collectedIds.length}/{careerEntries.length}
                    </strong>
                  </div>
                  <div className="career-meta-pill">
                    <span className="career-meta-label">Milestone</span>
                    <strong className="career-meta-value">
                      {collectedIds.includes(activeEntry.id) ? 'Unlocked' : 'Preview'}
                    </strong>
                  </div>
                  </div>
                </div>
              <div className="career-popup-scroll">
                <div className="career-popup-body">
                  <div className="career-popup-side">
                    <div className="career-outcome">
                      <p>Outcome</p>
                      <span>{activeEntry.outcome}</span>
                    </div>
                    {activeEntry.trophy && (
                      <div className="career-trophy">
                        <img src={activeEntry.trophy} alt={`${activeEntry.badge} trophy`} />
                        <span>{activeEntry.badge} unlocked</span>
                      </div>
                    )}
                    {showMore && (
                      <div className="career-details-drawer">
                        <p className="career-details-title">Role Details</p>
                        <ul className="career-list">
                          {visibleHighlights.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                          {extraHighlights.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="career-popup-stats">
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
                </div>
                <div className="career-popup-actions">
                  {extraHighlights.length > 0 && (
                    <button
                      className="career-action career-action--ghost"
                      type="button"
                      onClick={() => setShowMore((value) => !value)}
                    >
                      {showMore ? 'Show less' : 'More details'}
                    </button>
                  )}
                  {activeEntry.url && (
                    <a
                      className="career-action career-action--ghost"
                      href={activeEntry.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit company
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </section>
      </section>
    </div>
  )
}

export default Career
