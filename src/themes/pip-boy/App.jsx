import { useRef, useState } from 'react'
import './theme.css'
import Career from './pages/Career'
import Home from './pages/Home'

const sections = [
  { id: 'profile', label: 'Profile', meta: 'Base stats' },
  { id: 'career', label: 'Career', meta: 'Quest log' },
  { id: 'languages', label: 'Languages', meta: 'Map view' },
  { id: 'ai', label: 'AI Workflow', meta: 'Build system' },
  { id: 'contact', label: 'Contact', meta: 'Signal link' },
]

function App() {
  const [activeSection, setActiveSection] = useState('profile')
  const tabListRef = useRef(null)
  const tabRefs = useRef({})

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId)
  }

  const handleTabKeyDown = (event, index) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % sections.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + sections.length) % sections.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = sections.length - 1
    }

    const nextSection = sections[nextIndex]
    handleSelectSection(nextSection.id)
    tabRefs.current[nextSection.id]?.focus()
  }

  return (
    <div className="app-shell">
      <main className="app">
        <div className="workspace-shell">
          <div className="tab-shell">
            <div className="browser-tabs-row">
              <nav className="browser-tablist" aria-label="Sections" role="tablist" ref={tabListRef}>
                {sections.map((section, index) => {
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      ref={(element) => {
                        tabRefs.current[section.id] = element
                      }}
                      id={`tab-${section.id}`}
                      className={`browser-tab${isActive ? ' is-active' : ''}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${section.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => handleSelectSection(section.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                    >
                      <span className="browser-tab-copy">
                        <span className="browser-tab-title">{section.label}</span>
                        <span className="browser-tab-meta">{section.meta}</span>
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
          <div className="workspace-body">
            <div
              className="section-stage"
              id={`panel-${activeSection}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeSection}`}
            >
              {activeSection === 'career' ? (
                <section id="career">
                  <Career />
                </section>
              ) : (
                <section id={activeSection}>
                  <Home
                    activeSection={activeSection}
                  />
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
