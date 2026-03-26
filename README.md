# Scholar's Sanctuary

<div align="center">
  <img width="1200" height="475" alt="Scholar's Sanctuary banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Scholar's Sanctuary is a fantasy-styled study dashboard built with Astro, Tailwind CSS v4, and a small React island for the Pomodoro timer. The interface combines a retro RPG presentation with focused study tools such as a themed library dashboard, a study room with a Pomodoro timer, and a character-style refinement screen.

The current version ships the interface in Spanish while preserving the original visual identity and brand name.

## Highlights

- Biblioteca with chamber cards, progress panels, and hero imagery
- Sala de estudio with a 25-minute focus timer and ambient controls
- Pantalla de refinamiento with outfits, artifacts, and lore panels
- Crónicas with timeline, cadence, milestones, and archive-style metrics
- Responsive layout with sidebar navigation for desktop and mobile
- Real routes with Astro and client-side hydration only where interactivity is needed

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
src/
  components/   Reusable Astro UI building blocks
  data/         Centralized Spanish content and asset references
  islands/      Interactive React islands
  layouts/      Shared Astro layouts
  pages/        Astro routes
  lib/          Shared runtime helpers such as icon mapping
```

## AI Studio

Original AI Studio app link: [ai.studio/apps/2e4ee65b-30ce-4d0d-bfb9-a3ffa274c1ec](https://ai.studio/apps/2e4ee65b-30ce-4d0d-bfb9-a3ffa274c1ec)
