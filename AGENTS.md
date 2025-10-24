# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src`, with `main.jsx` bootstrapping React and `App.jsx` wiring the layout. Chat UI pieces sit in `src/components` (e.g., `ChatContainer.jsx`, `Sidebar/sidebar`), while shared styles are in `App.css`, `index.css`, and component-scoped `.css` files. Static assets go in `public`, and custom typefaces stay under `src/assets/fonts`. Keep new code co-located with related modules and export through an index file when a folder grows beyond a few components.

## Build, Test, and Development Commands
Run `npm install` once to set up. Use `npm run dev` for the hot-reloading Vite server (defaults to `http://localhost:5173`). Ship-ready bundles come from `npm run build`, which emits `dist/`. Validate the output locally with `npm run preview`. Guard style and syntax with `npm run lint`, which applies the shared ESLint config.

## Coding Style & Naming Conventions
Follow the existing two-space indentation, single quotes, and omission of trailing semicolons. React components and files stay in PascalCase (`Suggestion.jsx`); utilities and hooks use camelCase. Tailwind is the primary styling tool—compose utility classes first and fall back to CSS files only for complex overrides. Keep brand colors and typography aligned with `tailwind.config.js`, and run the linter before pushing to ensure `no-unused-vars` and React hook rules remain green.

## Testing Guidelines
Automated tests are not yet wired up. When adding them, prefer Vitest with React Testing Library, name files `*.test.jsx`, and either colocate beside the component or gather them under `src/__tests__`. Until tests land, include manual QA notes in PRs (e.g., “verified chat input and suggestion chips in dark mode”). Aim to cover new UI logic with component tests once the harness exists.

## Commit & Pull Request Guidelines
Commits use Conventional Commit prefixes (`feat(MessageArea): describe change`). Keep messages imperative and scoped to a single concern. For PRs, summarize the problem, note functional or visual impacts, attach screenshots for UI tweaks, and link any tracking issues. Confirm `npm run lint` and the development server both succeed before requesting review, and call out any configuration steps such as updates to `.env`.
