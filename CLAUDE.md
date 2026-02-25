# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fanscore is a Greek-language sports fan scouting app targeting Balkan football/basketball leagues. Users earn XP and vote weight by accurately scouting players.

## Stack & Development

**No build system.** This is plain HTML/CSS/JS — open files directly in a browser or via a local static server:

```bash
# Serve locally (any of these work)
npx serve .
python -m http.server 8080
```

There are no tests, no linting, and no package.json.

**Backend**: Supabase (CDN-loaded via `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`)

The Supabase project URL and publishable key are hardcoded in `onboarding.html` and `index.html`.

## Architecture

### File Structure

- **`index.html`** — Main app: all CSS and JS are inlined in a single file. Contains the full feed, player voting UI, match cards, etc.
- **`onboarding.html`** — 5-step onboarding wizard (sport → country → team → username → summary), writes to Supabase `profiles` table on completion.
- **`js/state.js`** — Global `State` object with `user`, `profile`, and a `phase()` method (0 = anonymous, 1 = logged in no team, 2 = logged in with team).
- **`js/world.js`** — `World` object: game rule constants — `canVote(phase)` and `xpFor(action)` XP reward table.
- **`js/engine.js`** — `Engine.dispatch(action, payload)`: validates phase permissions, computes XP, persists XP to Supabase.

### Core Logic Flow

```
User action → Engine.dispatch()
  → World.canVote(State.phase())   // permission check
  → World.xpFor(action)            // XP lookup
  → Supabase profiles.update(xp)  // persist
```

### Supabase Tables

- `profiles` — user data: `id`, `username`, `fav_team_id`, `fav_country_id`, `tier`, `vote_weight`, `xp`
- `countries` — `id`, `code` (ISO, uppercase)
- `teams` — `id`, `name`, `short_name`, `country_id`, `active`

### XP / Scout Tier System

Users start as Tier 1 Scout with `vote_weight = 1.0`. XP rewards (defined in `js/world.js`):
- `VOTE_PLAYER`: 5 XP
- `H2H_VOTE`: 8 XP
- `ONBOARDING_COMPLETE`: 20 XP

### UI Conventions

- UI language is **Greek (el)**
- `index.html` uses CSS custom properties with a dark teal/gold theme (`--teal: #00f0c8`, `--gold: #f5c842`)
- `onboarding.html` uses a green/dark theme (`--green: #00e676`)
- Both use Google Fonts: `index.html` → Rajdhani + Exo 2; `onboarding.html` → Bebas Neue + Barlow Condensed + Barlow
- Toast notifications use `showToast(msg)` helper defined inline in each HTML file
