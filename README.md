# Scholar's Sanctuary

<div align="center">
  <img width="1200" height="475" alt="Scholar's Sanctuary banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Scholar's Sanctuary is a fantasy-styled study dashboard built with React, Vite, Tailwind CSS v4, and Motion. The interface combines a retro RPG presentation with focused study tools such as a themed library dashboard, a study room with a Pomodoro timer, and a character-style refinement screen.

## Highlights

- Library dashboard with chamber cards, progress panels, and hero imagery
- Study room experience with a 25-minute focus timer and ambient controls
- Character refinement screen for outfits, artifacts, and lore panels
- Responsive layout with sidebar navigation for desktop and mobile

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Motion
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

## Environment Variables

This project currently renders a static UI. `vite.config.ts` exposes `GEMINI_API_KEY` if future AI features are wired in, but it is not required for the current interface.

If you want to define it anyway, create `.env.local`:

```bash
GEMINI_API_KEY=your_key_here
```

## Available Scripts

- `npm run dev` starts the Vite dev server on port `3000`
- `npm run build` creates a production build
- `npm run preview` serves the production build locally
- `npm run lint` runs TypeScript type-checking with `tsc --noEmit`
- `npm run clean` removes the `dist` directory

## Project Structure

```text
src/
  components/   Reusable UI building blocks
  screens/      Main app views
  constants.ts  Asset and icon registry
  types.ts      Shared app types
```

## AI Studio

Original AI Studio app link: [ai.studio/apps/2e4ee65b-30ce-4d0d-bfb9-a3ffa274c1ec](https://ai.studio/apps/2e4ee65b-30ce-4d0d-bfb9-a3ffa274c1ec)
