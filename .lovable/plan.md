## Ziel

Soul Cinema visuell minimal lebendiger machen — inspiriert von agentur-popkorn.de, aber **keine Kopie**. Bestehender Hero, Navigation, Backend, Musik, Portfolio, Contact bleiben unverändert.

## Scope (was passiert)

1. **Neues Wordmark-Logo** als React-SVG-Komponente
2. **CreativePromptSection** als neuer Block direkt unter dem Hero
3. **Motion-Sticker / Tags** dezent in der neuen Section
4. **Optionaler Marquee** mit Format-Stichworten unter der Prompt-Section
5. **Minimaler Nav-Polish** (nur Logo-Tausch + Hover-Feinheiten)

## Out of Scope (bewusst nicht)

- Hero-Video, Hero-Layout, Musik-System
- Navigation-Struktur, Mobile-Menu-Umbau
- Portfolio, Pricing, Contact, Footer-Logik
- Supabase, Edge Functions, Storage, Admin, Analytics, Mail
- Routing, SEO-Seiten, Datenschutz/Impressum/AGB
- Keine neuen DB-Tabellen, keine neuen Settings-Keys

---

## 1. SoulCinemaWordmark (neu)

**Datei:** `src/components/brand/SoulCinemaWordmark.tsx`

- Reines SVG, `currentColor`-basiert → funktioniert in Light & Dark
- `SOUL` in `font-brand` (Cormorant Garamond) als `<text>` mit leicht weicherem Tracking
- `CINEMA` cleaner, editorial, etwas weiteres letter-spacing
- Kleiner Akzent: dezenter Play-Dreieck oder Frame-Punkt in `var(--primary)` (Coral) zwischen den Wörtern
- Optional ein winziger Ice-Blue Spark als zweiter Akzent
- Props: `className`, `size` (height in px, default ~28)
- ARIA: `role="img"` + `aria-label="Soul Cinema"`

**Einsatz:**
- Hero-Header (Zeile 223 in `src/components/Hero.tsx`): Text `Soul Cinema` → `<SoulCinemaWordmark />`
- Footer (`src/components/Footer.tsx` Zeile 15): gleiches Wordmark, kleinere Größe
- Header-Layout, Spacing, Mobile-Menu bleiben unverändert

Optional zusätzlich `public/soul-cinema-wordmark.svg` als statisches Asset (für OG/Favicon-Wiederverwendung, nicht zwingend).

---

## 2. CreativePromptSection (neu)

**Datei:** `src/components/CreativePromptSection.tsx`

**Einbau:** in `src/pages/Landing.tsx` direkt nach `<section id="hero">` und vor `<section id="services">`, als eigene `<section id="creative-prompt">`.

**Aufbau:**

```text
┌─ Section (py-24, bg-background) ──────────────────────┐
│  [floating sticker: "Hook First"  ↗ rotated -6deg]    │
│                                                       │
│      H2: "So entsteht dein Scroll-Stopper."           │
│      (große Headline, font-brand, mit                 │
│       text-gradient-brand auf einem Wort)             │
│                                                       │
│  ┌─ Glass Card (rounded-2xl, border, shadow) ──────┐  │
│  │  ● ● ●   creative-brief.txt        [Status pill]│  │
│  │  ──────────────────────────────────────────────  │  │
│  │  Prompt:                                         │  │
│  │   > Mach aus meinem Produkt einen Scroll-Stopper.│  │
│  │                                                  │  │
│  │  Input:                                          │  │
│  │   Produkt   → Dein Produkt / App / Shop          │  │
│  │   Ziel      → Mehr Aufmerksamkeit & Klicks       │  │
│  │   Format    → 9:16 · 1:1 · 16:9                  │  │
│  │   Style     → UGC · cinematic · clean · bold     │  │
│  │                                                  │  │
│  │  Output:                                         │  │
│  │   ▸ Hook 01  Problem → Produkt → CTA             │  │
│  │   ▸ Hook 02  Unboxing → Benefit → Proof          │  │
│  │   ▸ Hook 03  Fast Cut → Feature → Action         │  │
│  │   ▸ Hero Clip + Social Cutdowns                  │  │
│  │                                                  │  │
│  │  Status: ▮ Ready to launch_                      │  │
│  │                                                  │  │
│  │  [ Projekt briefen → ]                           │  │
│  └──────────────────────────────────────────────────┘  │
│   [sticker: "9:16"]      [sticker: "UGC Look"]        │
└───────────────────────────────────────────────────────┘
```

**Animationen:**
- Zeile-für-Zeile Reveal via `framer-motion` `useInView` + staggered opacity/y
- Blinkender Cursor `_` am Ende der Status-Zeile (CSS keyframes)
- Floating Sticker: leichte y-Oszillation (6s ease infinite)
- Komplett deaktiviert via `@media (prefers-reduced-motion: reduce)` (existiert schon global in `index.css`)

**CTA:**
- Button (`variant="default"`): `Projekt briefen`
- `onClick`: smooth scroll zu `#contact` via `document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})`
- Tracking: `track('cta_click', { source: 'creative_prompt' })` aus `@/lib/analytics` (vorhandene Funktion, keine neuen Events nötig)

**Design-Tokens (bestehend):**
- Card: `bg-card border border-border` + `glass-effect` Variante
- Akzente: `var(--primary)` Coral, `var(--secondary)` Pink, `var(--color-accent-blue)` Ice Blue, `var(--color-accent-lavender)`
- Status-Pill: `bg-soft-coral` mit `text-primary`
- Keine Hardcoded Hex

---

## 3. Motion-Sticker / Tags

Kleine Pill-Komponente inline in `CreativePromptSection` (kein separates File nötig):

```tsx
<span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                 bg-soft-pink text-secondary rotate-[-4deg] shadow-sm">
  9:16 Ads
</span>
```

Varianten: Coral, Pink, Ice Blue, Lavender — 4–6 Sticker rund um die Card verteilt, leicht rotiert (-6° bis +6°), absolute Position auf Desktop, statisch im Flow auf Mobile.

**Nur in der neuen Section** — Hero, Services, Portfolio bleiben sticker-frei.

---

## 4. Marquee (optional, am Ende der Section)

Schmales Band unter der Card:

```text
9:16 Ads · Product Videos · Launch Clips · UGC Style · Social Cutdowns · Hook Variants · Shop Creatives · ...
```

- CSS-only keyframes `translateX(0 → -50%)`, Duration ~40s linear infinite
- `overflow-hidden`, doppelter Inhalt für nahtlosen Loop
- `text-muted-foreground` mit Trenner `·` in `text-primary`
- Pausiert bei `prefers-reduced-motion`

---

## 5. Nav-Polish (minimal)

In `src/components/Hero.tsx` (enthält den Header):
- **Nur** Text `Soul Cinema` (Zeile 223) durch `<SoulCinemaWordmark />` ersetzen
- Keine Änderungen an `NAV`-Array, Mobile-Menu, Spacing, Toggle, Sound-Button

---

## Mobile-Checks

- Card: `max-w-2xl mx-auto`, padding `p-6 md:p-10`
- Sticker auf Mobile: `static` statt `absolute`, in flex-wrap unter der Card
- Prompt-Zeilen: `text-sm md:text-base`, `break-words`
- Marquee: `text-xs md:text-sm`
- Wordmark: `h-7 md:h-8`

---

## Geänderte/neue Dateien

**Neu:**
- `src/components/brand/SoulCinemaWordmark.tsx`
- `src/components/CreativePromptSection.tsx`

**Geändert (minimal):**
- `src/pages/Landing.tsx` — eine `<section>`-Zeile + Import
- `src/components/Hero.tsx` — Logo-Text → Wordmark-Komponente (1 Zeile)
- `src/components/Footer.tsx` — Logo-Text → Wordmark-Komponente (1 Zeile)

**Nicht angefasst:** Hero-Video-Logik, Music-System, Theme, Routing, Supabase, Admin, alle UI-Primitives, Contact, Portfolio, Pricing, FAQ.

---

## Verification

- `npm run build` (vom Harness) — TypeScript & Imports
- Manuelle Sichtprüfung Light + Dark, Desktop + Mobile (Preview)
- Visual-Regression-Snapshots werden beim nächsten Workflow-Run neu generiert (Hero/Pricing/Portfolio/FAQ/Contact bleiben — nur Hero könnte minimal abweichen durch Wordmark-Tausch; neue Section ist nicht in der Snapshot-Liste, also keine Test-Breaks)

---

## Was bewusst NICHT von PopKorn übernommen wird

- Keine Inhalte/Texte/Cases/Logos/Bilder
- Kein PopKorn-Farbschema (bleibt Coral/Pink/Ice Blue von Soul Cinema)
- Keine wilden Cursor-Effekte, kein Custom-Cursor
- Kein Floating-Nav-Umbau
- Keine Marquee mit echten Kundennamen
- Keine übertriebenen Hover-Distortions oder WebGL-Effekte
