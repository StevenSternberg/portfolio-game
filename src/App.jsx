import { Suspense, lazy } from 'react'

const themeLoaders = {
  'pip-boy': () => import('./themes/pip-boy/App.jsx'),
  'modern-slate': () => import('./themes/modern-slate/App.jsx'),
}

const themeKey = import.meta.env.VITE_THEME
const loadTheme = themeLoaders[themeKey]
const ThemeApp = loadTheme ? lazy(loadTheme) : null

function App() {
  if (!ThemeApp) {
    return (
      <main style={{ padding: '24px' }}>
        <h1>Theme not found</h1>
        <p>Set VITE_THEME to a valid theme key.</p>
      </main>
    )
  }

  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading theme...</div>}>
      <ThemeApp />
    </Suspense>
  )
}

export default App
