## Ziel

Bestehende Navbar (lebt aktuell in `src/components/Hero.tsx`, Zeilen 215–278) kontrolliert veredeln — kein Redesign, kein Floating-Pill-Experiment. Klares Plus an Wertigkeit, Kreativität und Kontrast in Light & Dark Mode.

## Geänderte Datei

- `src/components/Hero.tsx` — nur der `<motion.nav>`-Block (Header + Mobile-Drawer) sowie die `NAV`-Konstante.
- Optional minimale Feinjustierung an `src/components/brand/SoulCinemaWordmark.tsx` (nur Proportionen/Spark-Sichtbarkeit, kein neues Konzept).

Alles andere bleibt unangetastet.

## Änderungen im Detail

### 1. Navigation reduzieren
`NAV` von 7 auf 4 Punkte kürzen:

```text
Leistungen   → #services
Portfolio    → #portfolio
Prozess      → #process
Preise       → #pricing
```

`Warum`, `FAQ`, `Kontakt` raus aus der Hauptnav (Sections bleiben auf der Seite). Kontakt ist nur noch der CTA rechts.

### 2. Logo präsenter
- Desktop: `size={40}` (vorher 32 / md:38).
- Mobile: `h-[32px]`.
- Klickbar bleibt (Anker `#hero`, smooth scroll).
- Optional: in der Wordmark Spark-Punkt minimal vergrößern (r 2.5 → 3) und CINEMA-Tracking 0.26em → 0.22em für etwas mehr Gewicht. Nur wenn unauffällig.

### 3. Theme-bewusster Glass-Header
Aktuell wird im Scroll-Zustand hart `bg-[#0A0A0A]/85` gesetzt — schlecht für Light Mode.

Neuer Ansatz, weiterhin sticky/fixed:

- **Unscrolled (über Hero):** `bg-transparent`, Text in `#F4F0E8` (Hero-Cream), wie heute. Damit über dem Video lesbar.
- **Scrolled:** theme-aware Glass via Tailwind `dark:`-Varianten:
  - Light: `bg-background/75 backdrop-blur-xl border-b border-border/60 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)]`, Text `text-foreground`.
  - Dark: `dark:bg-[#0A0A0A]/80 dark:border-white/5`.
- Übergang via `transition-colors duration-300`.
- Shadow nur im Scrolled-Zustand.

Damit verschwindet die Navbar weder auf Light- noch Dark-Hintergrund.

### 4. Nav-Links moderner
- Etwas kompakteres Gap (`gap-6`).
- Hover-State: kleiner Coral-Dot links + sanfte Color-Transition zu `text-primary`.
- Focus-Ring sichtbar (`focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full`).
- Kein neuer Scrollspy.

Markup-Skizze pro Link:
```tsx
<a className="group relative inline-flex items-center gap-2 text-sm font-medium
              text-[color:var(--nav-fg)] hover:text-primary transition-colors">
  <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0
                   group-hover:opacity-100 transition-opacity" />
  {n.label}
</a>
```

`--nav-fg` wird inline gesetzt: im unscrolled-Zustand cream, scrolled = `hsl(var(--foreground))`.

### 5. CTA stärker
- `rounded-full` statt `rounded-md`.
- Beibehalt der Coral-Brand-Farbe (`bg-primary text-primary-foreground` statt hardcoded `#C9963B`, damit theme-konsistent).
- Dezenter Shadow + Hover-Lift (`hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-12px_color-mix(in_srgb,var(--primary)_70%,transparent)]`).
- Label bleibt `Projekt anfragen`, optional `↗`-Icon (lucide `ArrowUpRight`).
- Funktion (`goContact`) unverändert — Tracking bleibt.

### 6. Brand-Microline (optional, dezent)
Neben dem Logo auf Desktop ab `xl:`:
```text
Product Videos & Social Ads
```
in `text-xs tracking-wide text-foreground/55 dark:text-white/55`, durch `border-l pl-3 ml-3` getrennt. Mobile + `<xl` ausgeblendet. Wird gestrichen, falls es im Build zu voll wirkt.

### 7. Mobile sanft
- Logo links 32px.
- Menübutton rechts: `rounded-full` Pill mit Icon + Label „Menü" ab `sm`, nur Icon darunter.
- Drawer-Struktur bleibt; aber:
  - Hintergrund theme-aware (`bg-background/95 dark:bg-[#0A0A0A]/95`, `border-l border-border/60`).
  - Links nutzen `text-foreground` mit hover `bg-primary/10` und `text-primary`.
  - Mobile-Links: Leistungen, Portfolio, Prozess, Preise, Kontakt.
  - CTA `Projekt anfragen` prominent (rounded-full, primary).
- Schließt nach Klick (bereits umgesetzt).

### 8. QA-Checks nach Umsetzung
- Build via Harness (kein manueller `npm run build`).
- Playwright-Screenshots `/` in Light & Dark, je oben + nach Scroll, Desktop (1280×900) und Mobile (390×844). Sicherstellen: Logo lesbar, Nav-Links sichtbar, CTA kontrastreich, keine White-on-White-Situation, keine horizontale Scroll-Leiste.
- Anker-Scroll manuell verifizieren (Leistungen/Portfolio/Prozess/Preise/CTA→Kontakt).

## Bewusst NICHT angefasst

Hero-Video & Headline, CreativePromptSection, Portfolio, Services, About/Prozess, Pricing, FAQ, Contact-Formular & Mailversand, Admin, Supabase, Analytics, Musik-System, Routing, Footer, restliche Farb-Tokens.

## Liefer-Zusammenfassung am Ende

Welche Datei(en) geändert, wie Logo skaliert wurde, welche Nav-Punkte gestrichen, wie CTA/Hover/Glass umgesetzt wurden, Mobile-Anpassungen, was bewusst unangetastet blieb, manuell zu prüfende Stellen.
