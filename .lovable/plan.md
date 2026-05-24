# Plan: Level Up LeetCode Validator

Transform the tool from a single-profile analyzer into a polished, public-facing platform where users can verify, showcase, and share their LeetCode talent.

## Goals
1. **Clarity** — make what the app does obvious in 5 seconds
2. **Public use** — easier discovery, sharing, and re-use
3. **Showcase talent** — give strong profiles a way to stand out

---

## Phase 1 — Clarity & First Impression
- **Rewrite the hero**: clear H1 ("Verify & Showcase Your LeetCode Talent"), 1-line subhead, single prominent search input with example usernames as chips ("Try: striver_79, neal_wu")
- **"How it works" strip** (3 steps with icons): Enter username → AI analyzes → Share your card
- **Live demo profile** auto-loaded on first visit so users see real output instantly
- **Trust signals**: "X profiles analyzed" counter pulled from the `searches` table
- **Sticky search bar** on scroll so users can analyze another profile anytime

## Phase 2 — Talent Showcase
- **Public Profile Pages** at `/p/:username` — shareable, SEO-indexed permalink for every analyzed profile (canonical URL, OG image, JSON-LD `Person` schema)
- **Talent Score Badge** — auto-generated SVG badge users can embed in GitHub READMEs (`<img src=".../badge/username.svg">`)
- **Leaderboard** (`/leaderboard`) — top recently-analyzed profiles by overall score, with filters (consistency / complexity / diversity). Opt-in via a "Feature me" toggle to respect privacy
- **Improved share card** — refine the existing ShareableCard: cleaner layout, generated dynamic OG image so Twitter/LinkedIn previews look pro
- **Compare mode polish** — promote the existing ProfileComparison as a "1v1 battle" feature with a shareable result URL

## Phase 3 — Public Usability
- **SEO**: per-route titles/descriptions, sitemap, robots, structured data on profile pages
- **Mobile polish** — search, results, and share card fully responsive
- **Empty / error states** — friendly copy when a username isn't found, with suggestions
- **Rate-limit messaging** — clear feedback when LeetCode throttles
- **Onboarding tooltip** on the first score card explaining the methodology

## Phase 4 — Engagement Loops
- **Recent searches** sidebar (already partially built) → upgrade to "Trending profiles today"
- **Share buttons** wired up properly (X, LinkedIn, WhatsApp, copy link) with pre-filled text
- **"Analyze a friend"** CTA after results

---

## Technical Notes
- Add `featured` boolean + `display_name` to `searches` (or new `public_profiles` table) for leaderboard opt-in
- New routes: `/p/:username`, `/leaderboard`, `/badge/:username.svg` (edge function returning SVG)
- New edge function `og-image` returning a dynamic PNG share card
- Use existing Lovable AI Gateway for any new AI copy
- Keep admin panel hidden as-is

---

## Suggested Build Order
I'd ship this in 3 small iterations so you can review each:

1. **Iter 1 — Clarity**: hero rewrite, how-it-works, demo profile, trust counter, sticky search
2. **Iter 2 — Showcase**: public profile pages + SEO + improved share card + embed badge
3. **Iter 3 — Community**: leaderboard, compare-mode polish, share buttons, trending sidebar

Reply with which iteration to start with (or "all" to do them in sequence), and I'll begin.