# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `pnpm start` - Full development setup (installs dependencies, starts dev server, browser integration)
- `pnpm dev` - Start Vite development server only
- `pnpm build` - Build for production
- `pnpm sync` - Start Phion cloud sync only
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

### Quality Assurance
Always run type checking after implementing features:
```bash
pnpm type-check
```

## Project Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **State Management**: React hooks (useState, useContext)
- **Cloud Sync**: Phion for real-time collaboration
- **Toolbar**: @21st-extension for browser integration

### Project Structure
- `src/App.tsx` - Main app with onboarding flow and localStorage-based state
- `src/components/ui/` - Reusable UI components (shadcn/ui based)
- `src/components/Onboarding.tsx` - First-time user experience
- `src/lib/utils.ts` - Utility functions (cn for className merging)
- `src/hooks/` - Custom React hooks

### Key Features
- **Onboarding System**: First-time users see guided setup, returning users see main app
- **Theme System**: Dark/light mode toggle with CSS custom properties
- **Phion Integration**: Real-time sync and collaboration toolbar
- **Responsive Design**: Mobile-first approach with Tailwind utilities

### Import Patterns
Components use path aliases:
- `@/components/ui/button` for UI components
- `@/lib/utils` for utilities
- `@/hooks/use-mobile` for custom hooks

### Development Process Rules
- NEVER run development servers automatically - they're managed externally
- NEVER run build processes without explicit user request
- Always run type checking after completing functions
- Functions are not complete until they pass TypeScript compilation
- Use functional components with hooks exclusively
- Follow shadcn/ui patterns for new components

### Phion Configuration
- Project syncs to cloud automatically when `pnpm sync` is running
- Toolbar enabled by default in top position
- WebSocket connection to `wss://api.phion.dev`