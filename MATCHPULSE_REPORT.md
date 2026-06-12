# MatchPulse MVP — Integration Report

**Date:** June 12, 2026  
**Production:** https://matchpulse-mvp.vercel.app  
**Repository:** https://github.com/andersonlebon/matchpulse-mvp

---

## Executive Summary

MatchPulse was missing complete World Cup 2026 squad data (e.g. **DR Congo**), had no live data feed, group cards lacked full detail views, AI recaps were static-only, and the landing page played **two audio tracks** from duplicate video elements. This release fixes those gaps and wires **API-Football** (free tier) plus **OpenRouter** for AI.

---

## 1. Data Gap Analysis

| Issue | Root Cause | Fix |
|-------|------------|-----|
| DR Congo not searchable | Not in static `teams.ts` | Added `COD` (DR Congo 🇨🇩) to Group O |
| Incomplete squads | 48 fictional 3-team groups, static seed | API-Football live merge + static fallback |
| Scores not updating | Hardcoded `matches.ts` | 30s polling via `/api/football/fixtures` |
| Group click → no details | Only inline expand | `GroupDetailModal` with squads, standings, all matches |
| Match click → no details | No modal | `MatchDetailModal` with venue, time, export |
| Double audio on landing | Two `<video>` elements playing same file | Single video + CSS intro overlay |
| AI recaps static | No LLM integration | OpenRouter via `/api/ai/recap` |

---

## 2. Recommended Free API — API-Football

**Provider:** [API-Football](https://www.api-football.com/) (API-Sports)  
**Plan:** Free — 100 requests/day, no credit card  
**World Cup 2026:** `league=1`, `season=2026`

### Why this API

| Feature | API-Football Free | football-data.org Free |
|---------|-------------------|------------------------|
| World Cup 2026 fixtures | ✅ | Limited |
| Live scores (15s refresh) | ✅ | Paid only |
| Standings / groups | ✅ | Basic |
| Team list (all 48 nations) | ✅ | Partial |
| Events / lineups | ✅ | Paid |

### Endpoints used

```
GET /fixtures?league=1&season=2026     — full schedule
GET /fixtures?live=all                 — live matches
GET /teams?league=1&season=2026        — all qualified teams
GET /standings?league=1&season=2026    — group tables
```

### Setup

1. Register at https://dashboard.api-football.com/register  
2. Copy your API key  
3. Add to **Vercel** (server-only, not `VITE_`):

```
API_FOOTBALL_KEY=your-key-here
```

Without the key, the app falls back to static seed data automatically.

---

## 3. OpenRouter AI Integration

**Provider:** [OpenRouter](https://openrouter.ai/)  
**Endpoint:** `POST /api/ai/recap` (server proxy — key never exposed to browser)

### Env vars (Vercel)

```
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### Usage in app

- **AI Recaps** page → open any recap → **AI Insight** tab → **Generate with OpenRouter AI**
- Sends match summary to OpenRouter; returns tactical recap text
- Falls back to static `recaps.ts` content if key not set

### Security

- Keys stored as Vercel server env vars only
- Client calls `/api/ai/recap` — no direct OpenRouter exposure

---

## 4. Architecture Changes

```
Browser (React + React Query)
    │
    ├── /api/football/fixtures  ──► API-Football (WC 2026)
    ├── /api/football/teams     ──► API-Football teams
    ├── /api/football/standings ──► API-Football standings
    └── /api/ai/recap           ──► OpenRouter

Supabase (auth + favorite teams) — unchanged
Static fallback (matches.ts, teams.ts) — when API unavailable
```

### New files

- `api/football/fixtures.ts`, `teams.ts`, `standings.ts`
- `api/ai/recap.ts`
- `src/hooks/useFootballData.ts`, `useAiRecap.ts`
- `src/app/context/FootballContext.tsx`
- `src/lib/footballMapper.ts`
- `src/app/components/GroupDetailModal.tsx`
- `src/app/components/MatchDetailModal.tsx`

### Modified files

- `HeroVideo.tsx` — single audio source
- `Schedule.tsx` — live data, group/match modals, DR Congo search
- `teams.ts` / `matches.ts` — COD added
- `AIRecap.tsx` — OpenRouter generation
- `Onboarding.tsx` — API-merged team list
- `vercel.json` — API routes excluded from SPA rewrite

---

## 5. Landing Page Audio Fix

**Problem:** `HeroVideo` used two `<video>` elements (fullscreen intro + hero slot) both playing `Say_the_word_FIFA_Cup_use.mp4` → overlapping audio.

**Fix:** One `<video>` element. Intro animation uses a CSS background placeholder; only the hero video plays audio.

---

## 6. Vercel Environment Checklist

| Variable | Environment | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Production, Development | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Production, Development | ✅ Yes |
| `API_FOOTBALL_KEY` | Production, Development | Recommended |
| `OPENROUTER_API_KEY` | Production, Development | For AI recaps |
| `OPENROUTER_MODEL` | Production, Development | Optional (default: gpt-4o-mini) |

### Supabase Auth URLs

Add to Supabase → Authentication → URL Configuration:

- Site URL: `https://matchpulse-mvp.vercel.app`
- Redirect URLs: `https://matchpulse-mvp.vercel.app`, `http://localhost:5173`

---

## 7. Verification Steps

- [ ] Search **DR Congo** or **COD** on Schedule page
- [ ] Click any **Group** card → full modal with squads, standings, matches
- [ ] Click any **Match** card → detail modal with venue + calendar export
- [ ] Landing page loads with **single** audio track
- [ ] With `API_FOOTBALL_KEY` set → green **Live data** badge on Schedule
- [ ] With `OPENROUTER_API_KEY` set → AI Recap generates fresh insight
- [ ] Sign up → pick teams → refresh → session persists
- [ ] Export calendar → valid `.ics` file

---

## 8. Remaining Work (Post-MVP)

| Priority | Item |
|----------|------|
| Medium | Add Preview env vars on Vercel for PR deploys |
| Medium | Migrate to Next.js App Router if required for SSR |
| Low | WebSocket push instead of 30s polling |
| Low | Full 12×4 group restructure when official draw data confirmed |
| Low | Pause/unpause `avec` Supabase project if needed |

---

## 9. Database

**Supabase project:** `matchpulse-mvp` (`cjzbikhvmhxmjjqfddyn`)  
**Migration applied:** `profiles` table with RLS  
**Note:** `avec` project was paused to free a slot on the 2-project free tier.

---

*Report generated as part of MatchPulse MVP completion sprint.*
