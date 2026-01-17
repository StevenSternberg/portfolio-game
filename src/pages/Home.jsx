import { useState } from 'react'
import worldMap from '../assets/map/Gemini.png'
import flagGermany from '../assets/map/flags/germany.png'
import flagUnitedStates from '../assets/map/flags/united-states.png'
import flagFrance from '../assets/map/flags/france.png'
import flagSpain from '../assets/map/flags/spain.png'

const languagePins = [
  {
    id: 'german',
    label: 'German',
    level: 'Native',
    strength: 4,
    flag: flagGermany,
    x: 48.8,
    y: 43,
    side: 'right',
    offset: -26,
  },
  {
    id: 'english',
    label: 'English',
    level: 'Fluent',
    strength: 3,
    flag: flagUnitedStates,
    x: 26.6,
    y: 48.5,
    side: 'right',
    offset: -10,
  },
  {
    id: 'french',
    label: 'French',
    level: 'Basic',
    strength: 2,
    flag: flagFrance,
    x: 47.5,
    y: 45.5,
    side: 'left',
    offset: 8,
  },
  {
    id: 'spanish',
    label: 'Spanish',
    level: 'Basic',
    strength: 2,
    flag: flagSpain,
    x: 46.3,
    y: 49,
    side: 'right',
    offset: 28,
  },
]

const Home = () => {
  const [activePin, setActivePin] = useState(null)

  return (
    <div className="page">
      <header className="hero" id="profile">
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

      <section className="cv-section" id="education">
        <div className="cv-heading">
          <h2>Education</h2>
          <p>Design foundation that powers product leadership.</p>
        </div>
        <div className="cv-grid">
          <article className="cv-card">
            <h3>Mediadesign Hochschule Berlin</h3>
            <p className="cv-role">Bachelor of Arts in Media Design · 2009 - 2011</p>
          </article>
        </div>
      </section>

      <section className="cv-section" id="certifications">
        <div className="cv-heading">
          <h2>Certifications</h2>
          <p>Validated product leadership and discovery expertise.</p>
        </div>
        <div className="cv-grid">
          <article className="cv-card">
            <h3>Certified Scrum Product Owner</h3>
          </article>
          <article className="cv-card">
            <h3>Pendo Product Discovery</h3>
          </article>
        </div>
      </section>

      <section className="cv-section" id="skills">
        <div className="cv-heading">
          <h2>Skills</h2>
          <p>Tools and methodologies that fuel execution.</p>
        </div>
        <div className="cv-grid">
          <article className="cv-card">
            <h3>Tools</h3>
            <p>Jira, Confluence, Tableau, Indicative, SQL Developer, Figma, Photoshop</p>
          </article>
          <article className="cv-card">
            <h3>Product</h3>
            <p>Agile, Scrum, A/B Testing, Roadmapping, KPI Definition</p>
          </article>
        </div>
      </section>

      <section className="cv-section" id="languages">
        <div className="cv-heading">
          <h2>Languages</h2>
          <p>Global collaboration and customer empathy.</p>
        </div>
        <div className="language-map">
          <div className="language-map-figure">
            <img
              src={worldMap}
              alt="World map with country labels"
              className="language-map-image"
            />
            {languagePins.map((pin) => {
              const isActive = activePin === pin.id
              return (
              <div
                key={pin.id}
                className={`language-pin level-${pin.strength} pin-${pin.side}${
                  isActive ? ' is-active' : ''
                }`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onClick={() => {
                  setActivePin(isActive ? null : pin.id)
                }}
              >
                <div className="language-pin-indicator">
                  <span className="pin-pulse" />
                  <img src={pin.flag} alt={`${pin.label} flag`} />
                </div>
                <div
                  className="language-pin-card"
                  style={{
                    '--card-offset': `${pin.offset || 0}px`,
                  }}
                >
                  <div className="language-pin-label">
                    <span>{pin.label}</span>
                  </div>
                  <div className="language-pin-meter">
                    <span className="meter-text">{pin.level}</span>
                    <div className="meter-dots">
                      {[1, 2, 3, 4].map((step) => (
                        <span
                          key={step}
                          className={`meter-dot${step <= pin.strength ? ' is-on' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="cv-section" id="hobbies">
        <div className="cv-heading">
          <h2>Hobbies</h2>
          <p>Creative fuel outside the product world.</p>
        </div>
        <div className="cv-grid">
          <article className="cv-card">
            <h3>Photography</h3>
          </article>
          <article className="cv-card">
            <h3>Music</h3>
          </article>
          <article className="cv-card">
            <h3>Travel</h3>
          </article>
        </div>
      </section>

      <section className="cta-card">
        <div>
          <p className="cta-kicker">Career path</p>
          <h2>Play through the milestones</h2>
          <p>
            Explore the highlights, metrics, and impact across roles with an
            interactive timeline.
          </p>
        </div>
        <a className="cta-button" href="#career">
          Open Career Quest
        </a>
      </section>

      <section className="cv-section" id="contact">
        <div className="cv-heading">
          <h2>Contact</h2>
          <p>Open to new product challenges and collaborations.</p>
        </div>
        <div className="cv-grid">
          <article className="cv-card">
            <h3>Phone</h3>
            <p>Available on request</p>
          </article>
          <article className="cv-card">
            <h3>Email</h3>
            <p>stevensternberg2105@gmail.com</p>
          </article>
          <article className="cv-card">
            <h3>LinkedIn</h3>
            <p>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                linkedin.com/in/stevensternberg
              </a>
            </p>
          </article>
        </div>
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

export default Home
