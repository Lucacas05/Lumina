# Lumina

<div align="center">
  <img width="1200" height="475" alt="Lumina banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Lumina is a fantasy-styled study product built with Astro, Tailwind CSS v4, and React islands for the interactive parts. The current direction is a social study sanctuary: a hub in the library, a private silent room, a shared library, a garden for breaks, a character editor, and chronicles that grow from real Pomodoro sessions.

The project currently ships its interface in Spanish while preserving the original visual identity and the `Lumina` brand.

## Highlights

- Biblioteca as a portal toward the sanctuary spaces
- Santuario silencioso with an editable Pomodoro timer
- Biblioteca compartida and jardin backed by local sanctuary state
- Refinar with a modular avatar editor
- Cronicas e hitos driven by real Pomodoro sessions stored in the browser
- Responsive Astro routes with client-only React islands where state is needed

## Tech Stack

- Astro 5
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

## Run Locally

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` starts the Astro dev server on port `3000`
- `npm run build` creates a production build
- `npm run preview` serves the production build locally
- `npm run lint` runs `astro check`
- `npm run clean` removes the `dist` directory

## Project Structure

```text
docs/         Workflow and integration notes for the repo
references/   Local design references that should not become Astro routes
src/
  components/   Reusable Astro UI building blocks
  data/         Centralized Spanish content and asset references
  islands/      Interactive React islands
  layouts/      Shared Astro layouts
  pages/        Astro routes
  lib/          Shared runtime helpers such as icon mapping
```

## Integration Guardrails

- `faby` is the working branch for product evolution.
- The Astro route structure is the baseline and must stay intact.
- Spanish is the source language for visible UI copy, except for the brand name.
- Future changes from `main` should be reviewed and ported selectively instead of merged blindly.
- Visual references should live outside `src/pages` so Astro does not publish them as routes.

See [`docs/faby-integration-workflow.md`](docs/faby-integration-workflow.md) for the sync workflow.

## AI Studio

Original AI Studio app link: [ai.studio/apps/2e4ee65b-30ce-4d0d-bfb9-a3ffa274c1ec](https://ai.studio/apps/2e4ee65b-30ce-4d0d-bfb9-a3ffa274c1ec)
