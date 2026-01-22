import { useState } from 'react'
import './theme.css'
import Career from './pages/Career'
import Home from './pages/Home'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [secondaryOpen, setSecondaryOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
    setSecondaryOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-row">
          <a className="brand" href="#profile" onClick={closeMenu}>
            <span className="brand-mark">SS</span>
            <span className="brand-text">Steven Sternberg</span>
          </a>
          <button
            className="nav-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`menu-panel ${menuOpen ? 'menu-open' : ''}`}>
          <p className="menu-title">Main Menu</p>
          <nav className="nav nav-primary">
            <a className="nav-link" href="#profile" onClick={closeMenu}>
              Profile
            </a>
            <a className="nav-link" href="#career" onClick={closeMenu}>
              Experience
            </a>
            <a className="nav-link" href="#languages" onClick={closeMenu}>
              Languages
            </a>
            <a className="nav-link" href="#contact" onClick={closeMenu}>
              Contact
            </a>
          </nav>
          <button
            className="menu-more"
            type="button"
            onClick={() => setSecondaryOpen((open) => !open)}
            aria-expanded={secondaryOpen}
          >
            {secondaryOpen ? 'Show less' : 'More sections'}
          </button>
          <nav className={`nav nav-secondary ${secondaryOpen ? 'nav-secondary-open' : ''}`}>
            <a className="nav-link" href="#education" onClick={closeMenu}>
              Education
            </a>
            <a className="nav-link" href="#certifications" onClick={closeMenu}>
              Certifications
            </a>
            <a className="nav-link" href="#skills" onClick={closeMenu}>
              Skills
            </a>
            <a className="nav-link" href="#hobbies" onClick={closeMenu}>
              Hobbies
            </a>
          </nav>
        </div>
      </header>

      <main className="app">
        <section id="home">
          <Home />
        </section>
        <section id="career">
          <Career />
        </section>
      </main>
    </div>
  )
}

export default App
