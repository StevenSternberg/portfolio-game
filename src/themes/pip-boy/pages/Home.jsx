import { useState } from 'react'
import worldMap from '../../../assets/map/Gemini.png'
import flagGermany from '../../../assets/map/flags/germany.png'
import flagUnitedStates from '../../../assets/map/flags/united-states.png'
import flagFrance from '../../../assets/map/flags/france.png'
import flagSpain from '../../../assets/map/flags/spain.png'
import phoneIcon from '../../../assets/logos/Phone_icon.png'
import emailIcon from '../../../assets/logos/Email.png'
import linkedinIcon from '../../../assets/logos/quadratisches-linkedin-logo-isolated-on-white-background_469489-892.avif'
import careerEntries from '../../../data/careerEntries'
import AvatarSprite from '../components/AvatarSprite.jsx'
import kmpiCertificate from '../../../assets/certificates/KMPI_Sternberg.pdf'
import scrumCertificate from '../../../assets/certificates/afc8f0a2-4625-4a35-8a4b-167442dde7f0.jpg'

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

const Home = ({ activeSection }) => {
  const [activePin, setActivePin] = useState(null)

  const contactPanel = (
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
              <img className="contact-icon" src={linkedinIcon} alt="" aria-hidden="true" />
              <a
                href="https://www.linkedin.com/in/steven-sternberg-10180691/"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/steven-sternberg-10180691
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <div className="page">
      {activeSection === 'profile' && (
      <section className="pip-root" id="cv">
        <div className="pip-root-grid">
          <section className="pip-column" id="profile-panel">
            <div className="pip-column-body">
              <div className="pip-avatar-card">
                <AvatarSprite />
                <div className="pip-avatar-copy">
                  <p className="pip-avatar-kicker">Product Leader</p>
                  <h1 className="pip-avatar-name">Steven Sternberg</h1>
                  <p className="pip-avatar-subtitle">
                    I turn customer problems into measurable outcomes through strategy,
                    stakeholder alignment, and decisive prioritization.
                  </p>
                  <div className="pip-avatar-meta">
                    <p>Berlin, Germany</p>
                    <p>10+ years in B2C/B2B SaaS, streaming, and marketplaces</p>
                  </div>
                </div>
              </div>

              {contactPanel}

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
                </div>
              </section>
            </div>
          </section>

          <section className="pip-column" id="role">
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
                        Jira, Confluence, Tableau, SQL Developer, Figma, AI Coding Agents
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

              <section className="pip-panel" id="ai-workflow">
                <header className="pip-header">
                  <h2>AI Workflow</h2>
                  <p>Automation and acceleration across discovery and delivery.</p>
                </header>
                <div className="pip-body">
                  <div className="pip-rows">
                    <div className="pip-row">
                      <span className="pip-label">Research</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">Synthesis and insight clustering</span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">Requirements</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">PRD drafts and experiment plans</span>
                    </div>
                    <div className="pip-row">
                      <span className="pip-label">Automation</span>
                      <span className="pip-dots" aria-hidden="true" />
                      <span className="pip-value">Reports, roadmaps, summaries</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </section>
      )}

      {activeSection === 'languages' && (
      <section className="cv-section" id="languages">
        <div className="cv-heading">
          <div>
            <h2>Languages</h2>
            <p>Global collaboration and customer empathy.</p>
          </div>
        </div>
        <div className="language-map" id="language-map-panel">
          <div className="language-map-canvas">
            <div className="language-map-toolbar">
              <span className="language-map-kicker">Map View</span>
              <p>Tap a flag to inspect proficiency.</p>
            </div>
            <div className="language-map-figure">
              <img
                src={worldMap}
                alt="World map with country labels"
                className="language-map-image"
              />
              {languagePins.map((pin) => {
                const isActive = activePin === pin.id
                return (
                  <button
                    key={pin.id}
                    type="button"
                    className={`language-pin level-${pin.strength} pin-${pin.side}${
                      isActive ? ' is-active' : ''
                    }`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={() => {
                      setActivePin(isActive ? null : pin.id)
                    }}
                    aria-label={`${pin.label} ${pin.level}`}
                  >
                    <div className="language-pin-indicator">
                      <span className="pin-pulse" />
                      <img src={pin.flag} alt="" aria-hidden="true" />
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
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      )}

      {activeSection === 'ai' && (
      <section className="ai-proof" id="ai-proof">
        <div className="ai-proof-copy">
          <p className="ai-proof-kicker">AI-Assisted Product Work</p>
          <h2>This portfolio is part of the story.</h2>
          <p className="ai-proof-lead">
            I use AI to improve workflows, sharpen thinking, and move from idea to
            execution faster. This Pip-Boy experience is not just a concept. It is a
            working example of how I use AI to turn an idea into something tangible,
            interactive, and tailored to a clear narrative.
          </p>
          <p className="ai-proof-text">
            For me, AI is most valuable when it strengthens product work: structuring
            concepts, drafting assets, accelerating iteration, and expanding what one
            person can prototype without losing direction or quality.
          </p>
        </div>
      </section>
      )}

      {activeSection === 'contact' && (
      <section className="contact-shell">
        {contactPanel}
      </section>
      )}

    </div>
  )
}

export default Home
