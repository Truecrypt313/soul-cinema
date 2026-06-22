# Plan: Logo-Auftritt + CreativePromptSection optimieren

Zwei gezielte, kleine Eingriffe. Kein Redesign, keine Nav-Struktur-Änderung, keine Backend-/Funktions-Änderung.

## Scope

**Geändert wird ausschließlich:**
- `src/components/brand/SoulCinemaWordmark.tsx` — optische Feinjustierung
- `src/components/Hero.tsx` — nur Logo-Größe + minimale Header-Abstände (Zeile 223–224)
- `src/components/Footer.tsx` — Logo-Größe leicht angepasst (Konsistenz)
- `src/components/CreativePromptSection.tsx` — Wording + visuelle Hierarchie + Sticker + Marquee

**Nicht angefasst:** Navigation, Hero-Video, Musik-System, Portfolio, Contact, Mail, Admin, Analytics, Supabase, Routing, Pricing, Theme, Legal Pages.

---

## 1. Logo / Wordmark präsenter machen

### `SoulCinemaWordmark.tsx` (Feintuning, keine Neuerfindung)
- "Soul" italic serif bleibt, Gewicht 600 → **700** für mehr Präsenz
- "CINEMA" letter-spacing leicht offener (0.22em → **0.26em**) und vertikal sauber auf gleiche Baseline mit "Soul" ausgerichtet
- Play-Dreieck etwas größer (16×20 → **20×24**), Ice-Blue-Spark von r=2 → **r=2.5**, Position leicht nachjustiert
- viewBox bleibt `0 0 360 64`, Aspect Ratio unverändert → keine Layout-Shifts an Einbau-Stellen
- Bleibt `currentColor`-basiert → Light/Dark + über Hero-Video weiterhin gut

### `Hero.tsx` (eine Zeile)
Aktuell: `<SoulCinemaWordmark size={26} className="md:h-7 h-6 w-auto" />`
Neu: `<SoulCinemaWordmark size={32} className="md:!h-[38px] h-[30px] w-auto" />`
→ Desktop ~38px, Mobile ~30px. Header-Padding (`py-4`) bleibt — Nav-Layout unverändert.

### `Footer.tsx`
Footer-Logo: `size={24}` → `size={28}` (Konsistenz mit präsenter Marke, bleibt aber kleiner als Header).

**Was bewusst NICHT passiert:** kein Logo-Ersatz, kein Bild-Import, keine Nav-Item-Änderung, kein Spacing-Umbau, kein neues SVG-Konzept.

---

## 2. CreativePromptSection — Wording & Inhalte

### Neue Texte (1:1 übernommen aus Brief)
- **Eyebrow:** `Creative Brief`
- **Headline:** `Aus Produkt wird Performance-Creative.` — Wort `Performance-Creative` mit `text-gradient-brand italic`
- **Subline:** `Du gibst uns Produktlink, Bilder oder vorhandenes Material. Wir entwickeln daraus Hooks, Formate und Video-Ads, die in Feeds auffallen.`
- **Prompt-Zeile:** `Mach aus meinem Produkt ein Ad, das hängen bleibt.`
- **Input:** Produkt / Ziel / Plattform / Look / Material (5 Zeilen, neue Werte aus Brief)
- **Output:** Hook 01–03 + Hero Clip + Cutdowns (5 Zeilen, neues Wording)
- **Status:** `Ready for launch` (statt `Ready to launch`)
- **Hinweistext unter CTA:** `Kein Template. Kein Standard-Ad. Jedes Video startet mit einer klaren Creative-Idee.`
- **CTA:** `Projekt briefen` (bleibt)

`Scroll-Stopper` wird als Sticker/Tag prominent platziert (nicht mehr als Headline-Word).

### Sticker-Set (neu kuratiert, 4 Tags statt 4 generische)
- `Scroll-Stopper` — Soft Coral
- `Hook First` — Soft Pink
- `Shop Ready` — Soft Blue
- `Launch Clip` — Soft Lavender

### Marquee (neues Wording + Reihenfolge)
`Product Videos · Social Ads · Hook Variants · UGC Style · Launch Clips · Shop Creatives · App Videos · Cinematic Cuts · 9:16 Cutdowns`

---

## 3. CreativePromptSection — Visuelles Layout

Bestehendes zentriertes Layout bleibt (kein 2-Spalten-Umbau, da Risiko für Layout-Bruch zu groß und Brief lässt beides zu). Card wird größer, hochwertiger, weniger Terminal-schwarz, mehr Creative-Brief.

### Konkrete visuelle Änderungen
- Section bekommt **dezenten Gradient-Hintergrund**: `bg-[radial-gradient(ellipse_at_top,hsl(var(--soft-coral)/0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,hsl(var(--soft-blue)/0.25),transparent_55%)]` über `bg-background`
- Headline-Größe leicht hoch: `text-4xl sm:text-5xl md:text-6xl` → `text-5xl sm:text-6xl md:text-7xl`, `tracking-tight`
- Card `max-w-3xl` → `max-w-4xl`, mehr Padding (`p-6 md:p-10` → `p-8 md:p-12`)
- Card-Hintergrund: `bg-card` → `bg-card/95 backdrop-blur-sm` mit zusätzlicher dezenter Top-Highlight-Linie (Coral → transparent)
- Window-Chrome moderner: Filename → `creative-brief.md`, Live-Pill bleibt, Chrome-Dots etwas kleiner und gedeckter
- Input/Output-Zeilen: Label-Spalte breiter (`w-20 md:w-24` → `w-24 md:w-28`), bessere `gap-y-1.5` zwischen Zeilen
- Output-Block bekommt linke Akzent-Border (`border-l-2 border-primary/40 pl-4`) für Storyboard-Feeling
- Status-Badge größer, mit Glow-Shadow (`shadow-[0_0_24px_-6px_hsl(var(--primary)/0.5)]`)
- CTA-Button: Größe `lg`, beibehaltener Smooth-Scroll zu `#contact`, Analytics-Tracking bleibt

### Mobile
- Card-Padding mobil `p-6` (nicht enger)
- Sticker bleiben in-flow unter Card (`md:hidden` + Desktop `absolute`)
- Headline auf Mobile `text-4xl` (nicht zu groß)
- `break-words` + `whitespace-normal` auf KV-Zeilen → keine horizontale Scrollbar
- Marquee unverändert mobil-tauglich

### Animationen
- Stagger-Delay 0.04s → **0.05s** (minimal ruhiger)
- Float-Y-Amplitude 6px → **4px** (weniger nervös)
- Marquee-Duration 40s → **55s** (ruhiger)
- `prefers-reduced-motion` bleibt respektiert

---

## Technische Details

- Keine neuen Dependencies
- Keine neuen DB-Felder, keine Settings-Keys
- Keine Änderung an `index.css` Tokens — alle Farben über bestehende Semantic Tokens (`--primary`, `--secondary`, `--color-accent-blue`, `--soft-coral`, `--soft-pink`, `--soft-blue`, `--soft-lavender`)
- Bestehende Imports + Analytics-Call (`track({ event_name: 'cta_click', ... })`) bleiben
- `framer-motion` bereits im Projekt
- TypeScript: Line-Type bleibt identisch, nur Inhalte ändern sich

## Verification

- `npm run build` (vom Harness) — TS + Imports
- Manuelle Sichtprüfung Light/Dark × Desktop/Mobile:
  - Header: Logo wirkt präsenter, überlappt nicht mit Nav/CTA
  - CreativePromptSection: Headline neu, keine horizontale Scrollbar mobil, CTA scrollt zu `#contact`
  - Hero-Video läuft, Musik-Toggle, Portfolio-Playback, Kontaktformular unverändert
- Visual-Regression-Snapshots: Hero ändert sich minimal (Logo größer) → Baseline bei nächstem Workflow-Run neu generieren

## Bewusst NICHT enthalten

Navigation-Struktur, Nav-Labels, Mobile-Menu, Hero-Video, Hero-Headline-Logik, Musik, Portfolio, Contact-Form, Mailversand, Admin, Analytics-Events, Supabase, Storage, Edge Functions, Pricing, Legal, Routing, Sitemap, Theme-Tokens, neues Logo-Konzept, 2-Spalten-Hero-Umbau, PopKorn-Übernahmen.
