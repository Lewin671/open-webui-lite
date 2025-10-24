# Open WebUI Lite

A lightweight, modern web chat UI built with React, Vite, and Tailwind CSS for OpenAI-compatible APIs. Inspired by [Open WebUI](https://github.com/open-webui/open-webui), this repository contains the web frontend organized to keep UI components modular and easy to extend.

## Features

- Modern React-based UI
- Fast development with Vite and pnpm
- Responsive design using Tailwind CSS
- Component-based architecture for easy extension
- Lightweight and efficient for local or hosted deployments
- OpenAI-compatible API support

## Prerequisites

- Node.js v18 or higher
- pnpm (we use pnpm in this workspace)

If you don't have pnpm installed, you can install it globally:

```bash
npm install -g pnpm
```

## Quickstart

1. Clone the repository:

```bash
git clone <repo-url>
cd open-webui-lite/web
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The dev server defaults to http://localhost:5173.

4. Build for production:

```bash
pnpm build
pnpm preview
```

## Project Structure

Source code lives under `src/`:

- `src/main.jsx` — app bootstrap
- `src/App.jsx` — main application layout
- `src/components/` — UI components (e.g. `ChatContainer.jsx`, `Sidebar/`)
- `src/assets/` — fonts and other static assets
- `public/` — static files served by Vite

When a folder grows beyond a few components, consider adding an `index.js` to re-export members and keep imports tidy.

## Available Commands

- `pnpm install` — install dependencies
- `pnpm dev` — start Vite development server (hot reload)
- `pnpm build` — produce production `dist/` bundle
- `pnpm preview` — locally preview the production build
- `pnpm lint` — run ESLint using the repo's shared configuration

## Coding Style & Naming Conventions

- Follow existing project conventions found in the codebase
- React components and filenames: PascalCase (e.g. `Suggestion.jsx`)
- Utilities and hooks: camelCase
- Use Tailwind utility classes primarily; use CSS files for complex overrides
- Run `pnpm lint` before committing to catch style and syntax issues

**Note:** The repository's ESLint and Tailwind configuration files (`eslint.config.js`, `tailwind.config.js`) are the source of truth for stylistic rules.

## Testing Guidelines

There is no test harness configured yet. When adding tests, prefer:

- Vitest with React Testing Library
- Naming: `*.test.jsx` and colocate tests beside components or under `src/__tests__`

Include a brief QA note in PRs until an automated test harness is added.

## Commit & Pull Request Guidelines

- Use Conventional Commit prefixes (e.g., `feat(Chat): add input handler`)
- Keep commits focused and messages imperative
- For PRs: describe the problem, the change, testing steps, and attach screenshots for UI changes
- Ensure `pnpm lint` and the dev server run without errors before requesting review

## Contributing

Contributions are welcome! Please open an issue first for larger changes. For small fixes and improvements, submit a PR with a clear description and testing notes.

## License

This project is open source and available under the MIT License.
