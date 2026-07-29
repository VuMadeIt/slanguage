# Slanguage

**A galaxy of slang.** Travel planet to planet learning how internet slang actually works — through branching video stories where the wrong word has consequences.

Think Duolingo meets Urban Dictionary meets Telltale, wrapped in a playful space theme: each planet is a dialect world (hallway slang, workplace tone, dating chat…), and you land on one to learn by *being in the room*.

This repo is a **demoable v1 prototype**: mobile-first web app, space-themed UI, crude cutout visuals in the spirit of South Park, one fully authored school scenario with Higgsfield + ElevenLabs generation specs, stub screens for the rest.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — defaults work out of the box
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Try the core loop:** Galaxy → **Touch down** on *First Bell* (or Planets → Scholaris). Make choices, hunt endings, watch aura points swing.

Other commands:

```bash
npm run build
npm run lint
npm run format
npm run generate:assets                              # dry-run the video/audio worklist
npm run generate:assets -- --run                     # call Higgsfield + ElevenLabs
npm run generate:assets -- --run --scenario first-day-of-class
npm run preview:art                                  # render scene art to .preview/*.png
npm run preview:art -- lunch-table ending-table      # …or specific nodes
```

---

## The vibe

- **Deep space UI** — void indigo, plasma cyan, nova violet, nebula magenta
- **Starfield + bobbing planets** — each dialect is a world you travel to
- **Nav labels** — Galaxy / Planets / Comms / Logbook / Cadet
- **Aura points** — playful score for how a choice lands
- **Freshness tags** — every slang term is `trending` / `classic` / `fading`
- **Cutout animation** — construction-paper kids with jerky two-frame bobbing; each beat draws the room it is actually in

### Planets (content packs)

| Planet | Dialect | Status |
|---|---|---|
| **Scholaris** | Hallway Standard | Live — *First Bell* |
| **Clout Prime** | Camera-Facing | Live — *Rico in the Wild* |
| Cubicle IX | Workplace Casual | Coming soon |
| Situationship | Dry-Text Dialect | Coming soon |
| Irie | Patois Basics | Coming soon |

---

## Sample scenario: *First Bell*

`src/data/scenarios/first-day-of-class.ts` — immigrant student, first day of US high school.

- **4 decision points**, **5 endings** (table / almost / glazer / NPC / solo)
- Teaches hallway essentials: *bet, no cap, lowkey, vibe check, bussin', mid, fanum tax, glaze, sigma, NPC…*
- Failure is about using *more* slang than the moment asked for — fluency ≠ volume
- Comedy is South Park-shaped (deadpan kids, catastrophically fast social fallout, an adult who never notices) but the feedback and lessons play straight
- Every node carries **cutout `art`**, a **Higgsfield video prompt** (locked cast + seed + cutout style contract), and **ElevenLabs dialogue lines**

---

## Cutout art (why the videos finally relate)

Until real Higgsfield clips exist, every beat used to fall back to the same stock footage. That broke the branching illusion at exactly the moment it needed to sell.

Now each clip carries a structured `art` spec — setting, cast, expression, prop, optional gag card — and `SceneArtStage` draws it as crude SVG cutout animation while mock mode is on. The same art doubles as structured direction for the Higgsfield prompt, so the generated clip and the placeholder depict the same thing.

- `NEXT_PUBLIC_USE_SCENE_ART=true` (default) + mock videos → cutout stage
- Flip `NEXT_PUBLIC_USE_MOCK_VIDEOS=false` once the CDN is filled → real video stage, art stays as a fallback for any unresolved clip

`npm run preview:art` rasterises beats to `.preview/` so you can eyeball geometry without a browser.

---

## Higgsfield + ElevenLabs pipeline

Higgsfield returns **silent** video. ElevenLabs supplies the funny high-school dialogue as a separate synced layer. That split is intentional:

- Re-record a line after a slang term ages out → one TTS call, no re-shoot
- Re-render a shot with a better prompt → video swap, audio stays
- Cast consistency across nodes via a shared character block + per-node `seed`
- Visual consistency via one shared style contract (`src/data/scenarios/style.ts`) appended to every prompt

### Generate assets

1. Fill `.env.local` with keys and ElevenLabs voice ids (see `.env.example`)
2. `npm run generate:assets` — prints the worklist
3. `npm run generate:assets -- --run` — writes into `public/generated/`
4. Set `NEXT_PUBLIC_VIDEO_BASE_URL` (CDN, or `/generated` via your host) and `NEXT_PUBLIC_USE_MOCK_VIDEOS=false`

> **Note on Higgsfield:** their public API surface has shifted as the product matured. The client in `src/services/video/higgsfield.ts` is deliberately thin (create + poll) so endpoint paths can be adjusted in one file when their API moves. Same idea for ElevenLabs voice ids — scenarios reference *keys* (`dez`, `priya`…), never raw ids.

---

## Architectural decisions

### Stack: Next.js (App Router) + TypeScript + Tailwind

Web-first for TikTok/IG link-in-bio traffic. Server routes keep Claude / ElevenLabs / Higgsfield keys off the client. Capacitor wrap later is additive.

### Video: double-buffered HTML5 `<video>` + cutout art stage + separate audio track

- `VideoStage` parks the next clip in an idle buffer
- `SceneArtStage` stands in with cutout animation while clips are un-generated — same cue/out-point contract as the video stage
- `preload.ts` warms every reachable branch
- `StoryAudioTrack` plays the ElevenLabs dialogue in sync
- Trim/cue points clamp to real asset duration so a short re-render never stalls the story

### State: Zustand + persist + local story reducer

Run state dies with the player. Journal, progress, and entitlements persist to localStorage.

### Scenario data: directed graph + Zod + generation specs + art

`scene` / `beat` / `ending` nodes. Generation metadata and `art` live *on the node*, so a clip can never drift from the beat it illustrates.

### Entitlements: pure gate functions

`gatePlanet()` / `gatePlaygroundMessage()` / `gateFluencyScoring()`. Billing only calls `setTier()`.

---

## Project structure

```
src/
├── app/                     # Routes: Galaxy, Planets, Comms, Logbook, Cadet
├── components/
│   ├── layout/              # AppShell, BottomNav
│   ├── space/               # Starfield, PlanetOrb
│   └── ui/                  # Button, Card, Badge…
├── config/                  # Public + server env
├── data/
│   ├── planets.ts           # The galaxy
│   ├── characters.ts        # Cutout cast visual defs
│   ├── scenarios/           # Story graphs (art + generation specs)
│   ├── slang/terms.ts       # Term library + freshness
│   └── voices.ts            # ElevenLabs cast
├── domain/                  # Zod schemas, graph utils, gates
├── features/story/          # Player, cutout stage, overlays, audio, engine
├── services/
│   ├── ai/                  # Playground providers
│   ├── audio/               # ElevenLabs + audio URL resolver
│   ├── video/               # Higgsfield, clip resolver, preload
│   ├── storage/             # Persist adapter seam
│   └── analytics/
└── stores/
scripts/
├── generate-assets.ts       # Higgsfield + ElevenLabs batch runner
└── preview-scene-art.tsx    # Rasterise cutout beats to .preview/
```

---

## Environment variables

See `.env.example`. Highlights:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_USE_MOCK_VIDEOS` | Stock / art stand-ins (default `true`) |
| `NEXT_PUBLIC_USE_SCENE_ART` | Draw un-generated beats as cutouts (default `true`) |
| `NEXT_PUBLIC_VIDEO_BASE_URL` | CDN / generated-assets origin |
| `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_*` | Dialogue TTS |
| `HIGGSFIELD_API_KEY` | Text-to-video |
| `ANTHROPIC_API_KEY` | Live Comms replies |

---

## Assumptions

- Web-first for pitch/demo; native is a wrap later
- Videos are CDN-hosted vertical MP4s; Higgsfield prompts target 9:16 cutout style
- Higgsfield API paths may need a one-file tweak against their latest docs
- Payment is stubbed — Cadet page tier toggle demos entitlements
- Until you run `generate:assets`, mock mode draws each beat as cutout art rather than stock video
