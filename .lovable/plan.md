
# Fresh Creative Studio — Farb- & UI-Redesign Sprint

Ein kontrollierter Redesign-Sprint, der Soul Cinema von „Dark-Gold-Cinema" auf eine helle, frische, moderne Creative-Studio-Ästhetik umstellt — mit Coral/Tangerine als Primary, Pink/Magenta als Secondary und Ice Blue als Fresh Accent. **Light Mode wird Default**, Dark Mode bleibt optional und wird ebenfalls modernisiert. **Keine Logik-, Funktions-, Routing-, Backend-, Storage- oder Content-Änderungen.**

---

## 1. Light Mode als Standard

- `index.html` Inline-Script: Default-Fallback von `'dark'` → `'light'`, kein Auto-Switch auf `prefers-color-scheme`. Nur gespeicherte User-Wahl wird respektiert.
- `src/components/theme/ThemeProvider.tsx`: `readInitial()` gibt `'light'` zurück wenn nichts gespeichert ist. Toggle-Logik und localStorage-Persistenz bleiben unverändert.
- Theme Toggle bleibt funktional, Dark Mode bleibt wählbar und persistierbar.

## 2. Neue Farbpalette (in `src/index.css`)

**Light Mode (Default, primärer Eindruck):**

```text
Background       #FAF7F2  (warm off-white)
Surface (Card)   #FFFFFF
Surface Soft     #F4EEE8  (powder beige)
Text             #17171C  (charcoal)
Muted Text       #6F6660  (warm grey)
Border           #E6DCD3
Primary          #F9734A  (coral/tangerine)
Secondary        #EC4899  (pink/magenta)
Accent Blue      #8DD7F7  (ice blue)
Accent Lavender  #C9B8FB
Soft Pink        #FFE8F3
Soft Coral       #FFE9DE
Soft Blue        #EAF7FD
Soft Lavender    #F0EAFE
Ring             coral @ 45% alpha
```

**Dark Mode (modernisiert, optional):**

```text
Background       #111116  (deep charcoal, kein reines Schwarz)
Surface (Card)   #1B1B22  (graphite)
Surface Soft     #232330
Text             #F8F4EF
Muted Text       #B8AEA5
Border           rgba(248,244,239,0.10)
Primary          #FF8A5C  (helleres Coral für Dark-Kontrast)
Secondary        #FF6FB5  (helleres Pink)
Accent Blue      #9EDEF9
Ring             coral @ 45% alpha
```

## 3. Token-System überarbeiten

In `src/index.css` werden alle shadcn-Tokens (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--ring`, jeweils mit `-foreground`) sowie die semantischen Brand-Tokens neu belegt. Zusätzlich neue Tokens:

- `--color-accent-pink`
- `--color-accent-blue`
- `--color-accent-lavender`
- `--color-surface-soft-pink`, `--color-surface-soft-coral`, `--color-surface-soft-blue`, `--color-surface-soft-lavender`

Diese Tokens werden auch in `tailwind.config.ts` unter `colors` ergänzt, damit `bg-accent-pink`, `bg-soft-coral` etc. nutzbar sind, ohne neue Hardcodes zu schaffen.

## 4. Override-Layer für hardcodierte Farben

Der bestehende `html:not(.dark)` Override-Block in `src/index.css` wird ausgebaut und auf beide Modes erweitert, sodass Tailwind-Arbitrary-Klassen in den Komponenten automatisch auf die neuen Tokens gemappt werden — **ohne jede Komponente einzeln umzuschreiben**:

```text
#C9963B  (alle Opacity-Varianten) → var(--primary)         (coral)
#A8A29E  (alle Opacity-Varianten) → var(--muted-foreground)
#0A0A0A  → var(--primary-foreground) im Pill-Kontext, sonst Background-Token
#141414, #1c1814 → Card/Surface-Tokens
border-white/[0.04…0.10]  → var(--border) in Light Mode
bg-gradient pricing card  → frischer Coral-Tint statt dunkler Gradient
```

Damit sind **Hero-Video-Overlays, Portfolio-Media-Tiles und alle echten On-Dark-Kontexte ausgenommen** (bleiben dunkel für Lesbarkeit der On-Media-Badges).

## 5. Gezielte Komponenten-Anpassungen (nur Styling, keine Logik)

- **Hero (`src/components/Hero.tsx`):**
  - „Kinoreif"-Highlight bekommt Coral→Pink→Tangerine Gradient (`background-clip: text`), Glow auf Coral umgestellt.
  - Sound/Music Button: Coral statt Gold.
  - CTA Primary Button erhält moderneren Coral-Look mit weichem Shadow.
  - Video, Musik-Logik, Headline-Split-Logik unverändert.

- **Button (`src/components/ui/button.tsx`):**
  - `default` Variant: Coral mit Hover auf Coral/Pink-Mix.
  - Neue Variante `secondary-soft` (optional, falls nötig) für Soft-Pink/Soft-Coral CTAs.
  - `outline` und `ghost`: Hover auf Soft-Coral/Soft-Pink.

- **Cards (`src/components/ui/card.tsx`, Services, Why, Audience, FAQ, Footer, Contact):**
  - Erben über Tokens automatisch helles Off-White-Card mit sichtbarer Border.
  - Hover-Akzente über Override-Layer (Coral/Pink/Blue).

- **Pricing (`src/components/Pricing.tsx`):**
  - Highlight-Card: Coral-Border + dezenter Coral-Glow statt dunkler Gradient (im bestehenden Override schon vorbereitet, wird auf neue Coral-Werte aktualisiert).
  - „Beliebt"-Badge auf Coral/Pink.

- **Portfolio (`src/components/Portfolio.tsx`):**
  - Play Button moderner (Coral-Akzent on hover).
  - Badges sichtbarer.
  - **Media-Tiles bleiben dunkel** (Video-Lesbarkeit).
  - Video-Logik, Modal, Storage komplett unverändert.

- **Contact (`src/components/Contact.tsx`):**
  - Inputs: weiße Card mit sichtbarer Border, Focus-Ring Coral.
  - Submit-Button Coral.
  - Submit-Logik, Validierung, Honeypot, Analytics unverändert.

- **FAQ, Footer, Testimonials, Awards, About, Team, Services, Navigation:** rein tokenbasiert, ziehen automatisch mit.

- **Admin UI:** keine direkten Edits — zieht über shadcn-Tokens automatisch sanft mit. Funktionen und Navigation bleiben unangetastet.

## 6. Accessibility

- Body-Text bleibt Charcoal (`--foreground`), nicht Coral/Pink.
- Coral/Pink nur für Buttons, Highlights, Akzente, Icons — nicht für Fließtext.
- Focus-Ring Coral @ 45% Alpha (deutlich sichtbar auf Off-White).
- Borders auf `#E6DCD3` (warmes, klar sichtbares Grau).
- Pricing/Hero/Portfolio-Kontraste werden visuell verifiziert nach Build.

## 7. Verifikation

- Build muss durchlaufen (auto durch Harness).
- Visuelle Prüfung via `browser--view_preview` für: Hero, Services, Portfolio, Pricing (inkl. Highlight), FAQ, Contact, Footer.
- Theme Toggle in beide Richtungen.
- Default-Verhalten: Inkognito-Tab startet im Light Mode.

---

## Geänderte Dateien (geplant)

1. `index.html` — Inline-Theme-Script: Default `'light'`.
2. `src/components/theme/ThemeProvider.tsx` — `readInitial()` Default `'light'`.
3. `src/index.css` — Tokens (Light + Dark), Override-Layer auf neue Coral/Pink/Blue-Welt, neue Soft-Surface-Tokens, Glass-Effect-Hover auf Coral.
4. `tailwind.config.ts` — neue semantische Color-Tokens (`accent-pink`, `accent-blue`, `accent-lavender`, Soft-Surfaces).
5. `src/components/Hero.tsx` — Headline-Highlight-Gradient (Coral→Pink), Sound-Button-Akzent.
6. `src/components/ui/button.tsx` — Hover/Shadow im Default-Variant modernisiert.

Alle anderen Komponenten ziehen automatisch über Tokens + Override-Layer mit — **kein Massen-Refactor von Tailwind-Arbitrary-Klassen** in den Sektionen, das hat sich im letzten Light-Mode-Fix bereits bewährt.

## Explizit NICHT angefasst

Texte/Copy, Logo, Hero-Video, Musik-System-Logik, Portfolio-Video-Playback, Upload, Storage Policies, Supabase Auth, Admin Login/Funktionen, Contact-Submit, Mailversand, STRATO SMTP, Analytics, Leads, DB, Edge Functions, Legal-Seiten, Sitemap/Robots, Routing, Build-Setup.
