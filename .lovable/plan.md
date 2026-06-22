# Plan: TrustSignals-Sektion (ehrlicher Social Proof ohne Fakes)

Ziel: Eine vertrauensbildende Sektion zwischen Portfolio und Pricing, die als Zielgruppen-/Wirkungs-Cards formuliert ist — ohne erfundene Namen, Logos, Sternebewertungen oder Performance-Metriken.

## Scope

**Neu:**
- `src/components/TrustSignals.tsx` — komplette Sektion (Headline, 3 Wirkungs-Cards, Trust-Pills, CTA)

**Geändert:**
- `src/pages/Landing.tsx` — `<TrustSignals />` zwischen Portfolio und Pricing einbauen, alten `<Testimonials />` Aufruf entfernen
- `.lovable/plan.md` — Plan-Dokument aktualisieren

**Bewusst NICHT geändert:** `src/components/Testimonials.tsx` selbst (bleibt im Repo, nur nicht mehr eingebunden — verhindert Datenverlust für später, falls echte Testimonials in der DB stehen). Keine DB-Tabelle angefasst. Keine Edge Function, kein Routing, keine Navigation, kein Hero, kein Pricing, kein Contact, kein Admin, kein Musik-System, kein Storage.

## 1. Position in Landing.tsx

Reihenfolge bleibt: Hero → CreativePrompt → Services → Portfolio → **TrustSignals (neu)** → Process → Awards → Pricing → FAQ → Contact.

`<Testimonials />` wird aus dem Render-Tree entfernt (Komponente bleibt als Datei erhalten, damit später wieder aktivierbar — kein Code-Verlust).

## 2. Inhalte (1:1 aus Brief)

**Eyebrow:** `Wirkung` · **Headline:** `Was starke Creatives auslösen.` · **Subline:** `Soul Cinema verbindet Produktfokus, klare Hooks und moderne Formate für Website, Shop und Social Ads.`

**Card 1 — D2C Brand**
- Headline: „Vom Produktbild zur Kampagnen-Idee."
- Text: „Aus vorhandenem Material entsteht ein Creative, das nicht nur schön aussieht, sondern direkt als Social Ad, Shop-Video oder Launch-Clip gedacht ist."
- Highlight-Pill: „Hook-Varianten statt nur ein einzelner Clip"
- Micro-Quote: „Endlich sieht das Produkt so aus, wie es sich anfühlen soll." (kursiv, **ohne** Name/Rolle/Stern)
- Avatar: SVG-Gradient-Kreis (Coral→Pink) mit Spark-Icon

**Card 2 — App / SaaS**
- Headline: „Komplexe Produkte werden schnell verständlich."
- Text: „Funktionen, Vorteile und Use Cases werden so reduziert, dass Nutzer in wenigen Sekunden verstehen, warum das Produkt relevant ist."
- Highlight-Pill: „Ideal für Landingpage, Demo und Paid Ads"
- Micro-Quote: „Man versteht die App, bevor man überhaupt scrollt."
- Avatar: SVG-Gradient-Kreis (Ice Blue→Lavender) mit UI-Frame-Icon

**Card 3 — E-Commerce**
- Headline: „Mehr Energie für Shop, Reels und Ads."
- Text: „Produktvideos bekommen den richtigen Rhythmus für moderne Feeds: schnell genug für TikTok und Reels, hochwertig genug für Website und Brand-Auftritt."
- Highlight-Pill: „9:16, 1:1 und 16:9 Cutdowns"
- Micro-Quote: „Das wirkt wie Content — nicht wie klassische Werbung."
- Avatar: SVG-Gradient-Kreis (Tangerine→Pink) mit Play-Icon

## 3. Trust-Pills (unter den Cards)

`Klare Hooks` · `Social-Ready Formate` · `Produktfokus` · `Schneller Briefing-Prozess`

Kleine Pills mit dezenten Soft-Coral/Pink/Blue/Lavender-Hintergründen (`bg-[hsl(var(--soft-coral)/0.15)]` etc.), `border border-white/10`, `text-xs`, abgerundet. Keine Zahlen, keine Logos.

## 4. CTA-Block am Ende der Sektion

- Headline: „Bereit für dein erstes Creative?"
- Subline: „Schick uns Produktlink, Bilder oder App — wir denken daraus dein erstes Video-Konzept."
- Primary Button `lg`: `Projekt briefen` → Smooth-Scroll zu `#contact`
- Secondary Link (ghost/outline): `Portfolio ansehen` → Smooth-Scroll zu `#portfolio`

## 5. Design

- Light Mode default, Section-Hintergrund: `bg-background` mit dezentem Radial-Gradient (Soft Coral oben links, Soft Blue unten rechts, je ~0.18 Opacity)
- Cards: `bg-card`, `border border-white/10`, `rounded-2xl`, `p-7 md:p-8`, dezenter Shadow, Hover: `translate-y-[-2px]` + stärkerer Shadow + Border-Tint
- Card-Aufbau (von oben): Avatar (56px Gradient-Circle mit Inline-SVG-Icon) · Label-Pill (z. B. „D2C Brand") · Headline (`text-xl font-semibold tracking-tight`) · Text (`text-sm text-muted-foreground leading-relaxed`) · Highlight-Pill mit Häkchen-Icon · trennende `border-t border-white/5` · Micro-Quote kursiv (`text-sm italic text-foreground/80`) ohne Person/Stern/Badge
- Grid: `grid-cols-1 md:grid-cols-3 gap-5`, max-w-7xl zentriert
- Mobile: Cards untereinander, `p-6`, ausreichend Touch-Spacing, keine horizontale Scrollbar
- Dark Mode: über semantische Tokens automatisch korrekt (kein hartcodiertes Weiß/Schwarz)
- Animation: `FadeUp` (bestehende Komponente) mit Stagger 0.05s, `prefers-reduced-motion` respektiert

## 6. Avatare / Icons

Reine Inline-SVG, keine externen URLs, keine Fotos, keine KI-Gesichter, keine Initialen:
- 56×56 Circle mit `linearGradient` (Tokens: `--soft-coral` / `--soft-pink` / `--soft-blue` / `--soft-lavender` / `--soft-tangerine` falls vorhanden, sonst Fallback Coral/Pink)
- Zentriertes weißes Icon (Spark / Frame / Play) als Inline-SVG-Path
- Keine `lucide-react`-Avatare nötig — eigene Mini-Komponente `<GradientAvatar variant="..." />`

## 7. Analytics

CTA-Klicks lösen das bestehende `track({ event_name: 'cta_click', location: 'trust_section', ... })` aus (gleiches Schema wie CreativePromptSection). Keine neuen Events, keine Cookies, keine PII.

## 8. Bestehende Testimonials

`src/components/Testimonials.tsx` lädt aus `testimonials`-Tabelle und rendert nur, wenn Einträge `visible=true` existieren. **Aktuell kein Fake-Inhalt im Code**, aber um die TrustSignals-Sektion als alleinigen Social-Proof-Block zu etablieren, wird der Aufruf aus `Landing.tsx` entfernt. Datei + Tabelle bleiben unangetastet — kein Datenverlust, später reaktivierbar.

## Verification

- `npm run build` (TS + Imports)
- Manuell Light/Dark × Desktop/Mobile: Sektion sichtbar zwischen Portfolio und Pricing, keine horizontale Scrollbar, Cards hover-fähig, beide CTAs scrollen korrekt
- Keine sichtbaren „Demo"/„fiktiv"-Badges, keine Sterne, keine Namen, keine Logos, keine Zahlen
- Hero-Video, Musik, Portfolio-Playback, Contact-Form, Admin, Mailversand unverändert

## Bewusst NICHT enthalten

Contact, Mail, SMTP, Portfolio-Upload, Storage, Musik, Admin, CRM, DB-Tabellen, Edge Functions, Legal, Pricing, Hero-Video, Routing, Sitemap, Robots, Navigation, ThemeProvider, neue Tracking-Systeme, externe Bilder, Stockfotos, KI-Gesichter, Sterne-Ratings, Verified-Badges, Fake-Logos, Fake-Metriken.
