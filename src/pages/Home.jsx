import { useState } from 'react'
import worldMap from '../assets/map/Gemini.png'
import flagGermany from '../assets/map/flags/germany.png'
import flagUnitedStates from '../assets/map/flags/united-states.png'
import flagFrance from '../assets/map/flags/france.png'
import flagSpain from '../assets/map/flags/spain.png'
import phoneIcon from '../assets/logos/Phone_icon.png'
import emailIcon from '../assets/logos/Email.png'
import linkedinIcon from '../assets/logos/quadratisches-linkedin-logo-isolated-on-white-background_469489-892.avif'
import careerEntries from '../data/careerEntries'
import AvatarSprite from '../components/AvatarSprite'
import kmpiCertificate from '../assets/certificates/KMPI_Sternberg.pdf'
import scrumCertificate from '../assets/certificates/afc8f0a2-4625-4a35-8a4b-167442dde7f0.jpg'

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
          <div className="hero-spacer" aria-hidden="true" />
        </div>
      </header>

      <section className="pip-root" id="cv">
        <header className="pip-root-header">
          <h2>Steven Sternberg</h2>
          <p>
            I turn customer problems into measurable outcomes through strategy,
            stakeholder alignment, and decisive prioritization.
          </p>
        </header>
        <div className="pip-root-grid">
          <section className="pip-column" id="profile-panel">
            <header className="pip-column-header">
              <h3>Profile</h3>
            </header>
            <div className="pip-column-body">
              <div className="pip-avatar-card">
                <AvatarSprite />
                <div>
                  <p className="pip-avatar-title">Character Base</p>
                  <p className="pip-avatar-subtitle">Leveling through product milestones.</p>
                  <div className="pip-avatar-meta">
                    <p>Berlin, Germany</p>
                    <p>10+ years in B2C/B2B SaaS, streaming, and marketplaces</p>
                  </div>
                </div>
              </div>

              <section className="pip-panel" id="contact">
                <header className="pip-header">
                  <h2>Contact</h2>
                  <p>Open to new product challenges and collaborations.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    <div className="pip-row">
                      <span className="pip-label">Phone</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value contact-item">
                        <img className="contact-icon" src={phoneIcon} alt="" aria-hidden="true" />
                        Available on request
                      </span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">Email</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value contact-item">
                        <img className="contact-icon" src={emailIcon} alt="" aria-hidden="true" />
                        stevensternberg2105@gmail.com
                      </span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">LinkedIn</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value contact-item">
                        <img
                          className="contact-icon"
                          src={linkedinIcon}
                          alt=""
                          aria-hidden="true"
                        />
                        <a
                          href="https://www.linkedin.com/in/stevensternberg"
                          target="_blank"
                          rel="noreferrer"
                        >
                          linkedin.com/in/stevensternberg
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="pip-panel" id="hobbies">
                <header className="pip-header">
                  <h2>Hobbies</h2>
                  <p>Creative fuel outside the product world.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    <div className="pip-row">
                      <span className="pip-label">01</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">Photography</span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">02</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">Music</span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">03</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">Travel</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="pip-panel" id="languages-cta">
                <header className="pip-header">
                  <h2>Languages</h2>
                  <p>Global collaboration and customer empathy.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    {languagePins.map((pin) => (
                      <div className="pip-row" key={pin.id}>
                        <span className="pip-label">{pin.label}</span>
                        <span className="pip-dots" aria-hidden="true" />
                        <span className="pip-value">
                          {pin.level}
                          <span
                            className="language-battery-inline"
                            aria-label={`${pin.label} proficiency ${pin.level}`}
                          >
                            <span className="language-battery-cells">
                              {[1, 2, 3, 4].map((step) => (
                                <span
                                  key={step}
                                  className={`language-battery-cell${
                                    step <= pin.strength ? ' is-on' : ''
                                  }`}
                                />
                              ))}
                            </span>
                            <span className="language-battery-cap" aria-hidden="true" />
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <a className="pip-cta" href="#languages">
                    Open Language Map
                  </a>
                </div>
              </section>
            </div>
          </section>

          <section className="pip-column" id="role">
            <header className="pip-column-header">
              <h3>Senior Product Manager</h3>
            </header>
            <div className="pip-column-body">
              <section className="pip-panel" id="experience">
                <header className="pip-header">
                  <h2>Experience</h2>
                  <p>Timeline summary before the quest.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    {careerEntries.map((entry) => (
                      <div className="pip-row" key={entry.id}>
                        <span className="pip-label">{entry.company}</span>
                        <span className="pip-dots" aria-hidden="true" />
                        <span className="pip-value">
                          {entry.role} · {entry.period}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a className="pip-cta" href="#career">
                    Launch Career Quest
                  </a>
                </div>
              </section>

              <section className="pip-panel" id="education">
                <header className="pip-header">
                  <h2>Education</h2>
                  <p>Design foundation that powers product leadership.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    <div className="pip-row">
                      <span className="pip-label">School</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">Mediadesign Hochschule Berlin</span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">Degree</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">BA Media Design</span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">Years</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">2009–2011</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="pip-panel" id="certifications">
                <header className="pip-header">
                  <h2>Certifications</h2>
                  <p>Validated product leadership and discovery expertise.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    <div className="pip-row">
                      <span className="pip-label">CSPO</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">
                        <a href={scrumCertificate} target="_blank" rel="noreferrer">
                          Scrum Product Owner
                        </a>
                      </span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">Pendo</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">Product Discovery</span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">KMPI</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">
                        <a href={kmpiCertificate} target="_blank" rel="noreferrer">
                          Kanban verstehen
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="pip-panel" id="skills">
                <header className="pip-header">
                  <h2>Skills</h2>
                  <p>Tools and methodologies that fuel execution.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    <div className="pip-row">
                      <span className="pip-label">Tools</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">
                        Jira, Confluence, Tableau, Indicative, SQL Dev, Figma, Photoshop
                      </span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">Product</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">
                        Agile, Scrum, A/B Testing, Roadmapping, KPIs
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
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
          <h2>Highlights</h2>
          <p>Product, streaming, marketplaces, and growth outcomes.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
