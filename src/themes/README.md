Themes
======

This project supports separate builds per theme. Each theme owns its own
components, pages, and styles.

Structure
---------
- pip-boy/
  - App.jsx
  - theme.css
  - pages/
  - components/
- modern-slate/
  - App.jsx
  - theme.css

Add a New Theme
--------------
1) Duplicate `src/themes/pip-boy` to `src/themes/<theme-name>`.
2) Update the styles and components in the new theme folder.
3) Register the theme in `src/App.jsx`.
4) Add scripts to `package.json` if you want a named build command.

Build / Run a Theme
-------------------
- Dev: `VITE_THEME=<theme-name> npm run dev`
- Build: `VITE_THEME=<theme-name> npm run build`
- Preview: `VITE_THEME=<theme-name> npm run preview`

GitHub Pages Deployment
-----------------------
The Pages workflow builds each theme into `dist/<theme-name>`, so URLs look like:
- `https://stevensternberg.github.io/portfolio-game/pip-boy/`
- `https://stevensternberg.github.io/portfolio-game/modern-slate/`
- `https://stevensternberg.github.io/portfolio-game/<theme-name>/`

Add new themes to the `themes` array in `.github/workflows/deploy.yml`.
