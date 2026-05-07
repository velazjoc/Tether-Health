# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tether-Health is a React Native cross-platform mobile app (iOS, Android, Web) built with Expo. It's a UW Informatics Capstone project (Team Husky Bloom) that helps patients make sense of fragmented health information through document uploads and AI-powered summaries.

## Commands

```bash
npm install          # Install dependencies
npx expo start       # Start dev server (opens QR code for Expo Go / dev builds)
npm run android      # Run on Android emulator
npm run ios          # Run on iOS simulator
npm run web          # Run in browser
npm run lint         # Run ESLint via Expo
```

## Architecture

**Routing**: Expo Router (file-based). All screens live under `src/app/`. The root `_layout.tsx` wraps everything in a Stack; the `(tabs)/` group drives the bottom tab bar.

**Tab structure** (`src/app/(tabs)/`):
- `index.tsx` — Home
- `my-health.tsx` — My Health (document uploads)
- `chat.tsx` — Tether (AI chat) — *not yet created*
- `progress.tsx` — Progress — *not yet created*
- `profile.tsx` — Profile — *not yet created*

**Path alias**: `@/*` resolves to `src/*` (configured in `tsconfig.json`). Use `@/components/...`, `@/hooks/...`, etc. for imports.

**Example code**: The `example/` directory contains reference implementations of components, hooks (`useColorScheme`, `useTheme`), and constants. Use these as guides when building new screens, not as production imports.

**Assets**: Tab icons are in `assets/images/tabIcons/`. The active tint color for tabs is `#1D9E75`.

## Tech Stack

- **React Native 0.83.6** + **React 19** + **Expo 55** (managed workflow)
- **Expo Router** for file-based navigation
- **React Navigation** bottom tabs
- **TypeScript** (strict mode)
- **React Native Reanimated** for animations
- **Ionicons** via `@expo/vector-icons` for icons
- No backend/database packages installed yet — these need to be added

## Key Constraints

- Portrait orientation only (`app.json`)
- React Compiler and Typed Routes experiments are enabled in `app.json`
- This is an MVP; the planned features are: chat interface, document upload (5 PDFs + 10 text inputs), structured health summaries via LLM API
