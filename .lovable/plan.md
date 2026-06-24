## Ziel

Soul Cinema gezielt hochwertiger, videolastiger und interaktiver gestalten — inspiriert von kling.ai, aber inhaltlich und visuell sauber im bestehenden Design-System. Kein Redesign der Tokens, keine neuen Libraries, keine zerstörerischen Eingriffe in Admin/Supabase/CMS/Routing.

## Geänderte und neue Dateien

Neu:
- `src/components/MiniHeroVideo.tsx`
- `src/components/ScrollFeatures.tsx`
- `src/components/CreatorCarousel.tsx`

Bearbeitet:
- `src/components/Hero.tsx` — nur der Nav-Block + Wording
- `src/components/CreativePromptSection.tsx` — visuell entschärfen
- `src/pages/Landing.tsx` — Imports + neue Section-Reihenfolge + IDs
- `src/index.css` — kleine additive Utility-Klassen (keine Token-Änderungen)

Bewusst NICHT angefasst: Hero-Video/Headline-Logik, Services, Portfolio, About, Awards, Pricing, FAQ-Komponente (nur Fallback-Texte in `Landing.tsx`), Contact-Formular, Footer, Admin, Supabase, Analytics, Routing, Tokens.

## Änderung 1 — Nav linksbündig (Hero.tsx)

Im `<motion.nav>`-Block (ca. Zeile 215–304):
- Outer Wrapper bleibt full-width.
- Inner Container von `w-full px-5 sm:px-8 lg:px-12` → `max-w-[1400px] ml-0 mr-auto px-5 sm:px-8 lg:px-12`.
- Logo-Größe, Mobile-Drawer, `solidNav`-Logik, Theme-Toggle, Sound-Button, ThemeToggle bleiben.
- Wording-Fix: `Product Videos & Social Ads` → `Produktvideos · Social Ads`.
- Keine Änderung an Tracking / `goContact`.

## Änderung 2 — MiniHeroVideo (neu)

Komponente: Section `id="mini-showcase"`, `bg-background text-foreground py-24 sm:py-32 px-4 overflow-hidden`.

Inhalt zentriert (`max-w-5xl mx-auto`):
- Pill-Label (Gold-Stil, vorhandene `bg-soft-coral text-primary` / Tracking aus Section-Labels übernehmen): „Aus echten Projekten".
- H2 (`font-brand text-4xl sm:text-6xl`): „Dein Produkt im _Einsatz_." — „Einsatz" als `italic text-gradient-brand`.
- Subtext (`text-muted-foreground max-w-xl mx-auto`): „Produktlink oder Bilder rein — fertiges Video raus."

Video-Container (`max-w-3xl mx-auto rounded-2xl overflow-hidden aspect-video border border-border media-card`):
- `<video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">`
- Quelle via `useSettings()` → `setting(s, 'hero_video_url', FALLBACK_VIDEO)` (gleiche Konstante wie Hero, ggf. lokal duplizieren).
- Fallback: dunkler Gradient-Placeholder mit „Video Preview".

Prompt-Overlay direkt unter Video (`relative z-10 -mt-8 mx-auto inline-flex max-w-[92vw]`):
- `rounded-full bg-[#1A1A1A] border border-[#C9963B]/40 px-5 py-3 backdrop-blur`
- Grüner Puls-Dot + `font-mono text-sm text-[#F4F0E8]/85` (Light-Lesbarkeit via expliziter Klasse, da Pill bewusst dunkel bleibt = ok).
- Text: `→ Produktvideo · Hook-Cut · 9:16 · Meta Ready`.

CTA darunter: Ghost-Button „Jetzt Projekt anfragen →", scrollt zu `#contact`, ruft `track({event_name:'cta_click', cta_id:'mini_showcase'})`.

## Änderung 3 — CreativePromptSection entschärfen

Reduzieren statt umbauen:
- Floating Sticker-Block (Desktop + Mobile-In-Flow) entfernen.
- Marquee dezenter: kleinere Schrift `text-xs`, `opacity-60`, Border subtiler (`border-border/60`), langsamere Animation 90s.
- Top-Background-Radial-Gradient stark abschwächen (`opacity-90` → `opacity-40`).
- Card-Shadow reduzieren.
- Restliche Code-Editor-Optik, Inhalte, Tracking, CTA bleiben — das ist jetzt der „Briefing/Workflow"-Moment, MiniHeroVideo ist der emotionale Showcase.

## Änderung 4 — ScrollFeatures (neu)

Section `id="scroll-features"`, eingefügt nach `<Portfolio />` und vor `<TrustSignals />` in `Landing.tsx`.

Layout: `max-w-7xl mx-auto py-32 px-4` + `grid grid-cols-1 lg:grid-cols-2 gap-16`.

Header: Label „Wie wir arbeiten" / H2 „Vom Briefing zum fertigen Creative." / Sub.

Linke Spalte: 4 Feature-Blöcke (Verstehen / Hook / Format / Lieferung — exakte Inhalte wie im Brief). Jedes mit `ref` im `useRef<HTMLDivElement[]>([])`.
- Aktiv: `opacity-100 border-l-4 border-[#C9963B] pl-6 story-step-active`.
- Inaktiv: `opacity-30 pl-6 story-step-muted hover:opacity-60`.

Rechte Spalte: `lg:sticky lg:top-32 aspect-video rounded-2xl overflow-hidden border border-border media-card`
- Ein einziges Video (Hero-Fallback-URL), Overlay-Badge + Prompt-Bar wechseln mit `activeIndex`.
- Prompt-Bar unten: `prompt-glass` mit `font-mono text-xs sm:text-sm`, Inhalt aus aktivem Feature.

State: `IntersectionObserver` mit `rootMargin: '-40% 0px -40% 0px'` setzt `activeIndex`.
Reduced motion: keine Transition auf Badge/Prompt-Wechsel.
Mobile (`<lg`): kein sticky, jedes Feature mit eigener kompakter Preview drunter.

## Änderung 5 — CreatorCarousel (neu)

Section `id="creative-styles"` zwischen `Awards` und `Pricing`.
- Label „Gemacht für" / H2 „Marken, die _wachsen_ wollen." (italic + brand-gradient) / Sub wie Brief.
- Tile-Reihe nutzt `team-member-1..7.png` als abstrakte Stil-Tiles (Labels: UGC Hook, Cinematic Product, App Demo, E-Commerce Reel, Launch Teaser, Founder Ad, Before / After) — keine Bezeichnung als Personen/Kunden/Testimonials.
- Desktop: `flex items-end justify-center gap-4`, Mittelstück `w-24 h-24 ring-2 ring-[#C9963B] ring-offset-2 ring-offset-background`, Nachbarn `w-16 h-16`, Außen `w-12 h-12 opacity-60`. Hover `scale-110 opacity-100`.
- Mobile: `flex overflow-x-auto snap-x gap-3 px-4` (kein Page-Overflow durch Wrapper `overflow-hidden`).
- Optional unten: Badge `✦ Dein Projekt hier` → scroll zu `#contact`.

## Änderung 6 — Wording-Fixes (Landing.tsx FAQ-Fallback + Hero)

In `Landing.tsx` `FAQS`:
- „Alles weitere" → „Alles Weitere".
- „Ein einzelnes Video typischerweise …" → „Ein einzelnes Video dauert typischerweise 1–2 Wochen, Kampagnenpakete entsprechend länger."
- „Macht ihr auch laufenden Content?" → „Produziert ihr auch regelmäßig Content?"

In `Hero.tsx` Fallback `hero_subline`: „Sende uns" → „Schick uns". (Nur Fallback-String, CMS-Werte überschreiben weiterhin.)

Allgemeine Wortwahl in neuen Komponenten gemäß Brief (Videokonzept, Kampagnenpakete).

## Änderung 7 — Landing-Reihenfolge

`src/pages/Landing.tsx` `<main>`:
1. Hero
2. MiniHeroVideo (`#mini-showcase`)
3. CreativePromptSection
4. Services
5. Portfolio
6. ScrollFeatures (`#scroll-features`)
7. TrustSignals
8. About (`#process`)
9. Awards (`#why`)
10. CreatorCarousel (`#creative-styles`)
11. Pricing
12. FAQ
13. Contact
14. Footer

Bestehende Section-IDs (`#services`, `#portfolio`, `#trust`, `#process`, `#why`, `#pricing`, `#faq`, `#contact`, `#hero`) bleiben unverändert.

## Änderung 8 — index.css Utilities (additiv)

Im `@layer utilities` ergänzen, ohne bestehende Tokens/Mappings zu berühren:
```
.stage-section   { @apply bg-background text-foreground; }
.media-card      { box-shadow: 0 30px 80px -40px rgba(0,0,0,0.35); }
.prompt-glass    { background: rgba(26,26,26,0.85); backdrop-filter: blur(10px); border: 1px solid color-mix(in srgb, #C9963B 40%, transparent); }
.soft-nav-shell  { /* placeholder, currently unused but future-proof */ }
.story-step-active { transition: opacity .3s ease, border-color .3s ease; }
.story-step-muted  { transition: opacity .3s ease; }
```

## Änderung 9 — A11y / Performance

- Alle neuen `<video>`: `muted playsInline loop autoPlay preload="metadata"`, fester `aspect-video` Container → keine Layout-Shifts.
- `aria-label` an CTAs, `alt=""` an dekorativen Tiles.
- `prefers-reduced-motion`: ScrollFeatures-Transitionen + Marquee abschalten.
- Wrapper `overflow-hidden` an Carousel-Section gegen horizontalen Scroll.

## Verifikation

- Build via Harness.
- Playwright-Screenshots `/` Light + Dark, Desktop 1280×900 und Mobile 390×844, oben + nach Scroll an MiniHeroVideo + ScrollFeatures + CreatorCarousel + Nav (linksbündig).
- Manuell: Nav-Anker, CTA → `#contact`, kein horizontaler Overflow, Theme-Toggle.

## Bewusst nicht im Scope

Keine neuen Farben/Tokens, keine neuen Libraries, keine echten Kunden-/Testimonial-Daten, keine Übernahme von Kling-Assets, keine Hero-Headline-Logik, keine Admin/Supabase/Edge-Function-Änderungen.
