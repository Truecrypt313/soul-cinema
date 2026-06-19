# Soul Cinema · Optimierungsplan (PLAN-Modus, keine Umsetzung)

## 1. Executive Summary

Soul Cinema steht inhaltlich und visuell bereits solide: cinematic Dark Theme, Cormorant Garamond/Inter, CMS-gestützte Sektionen, sauberes Admin Panel. Drei Bereiche bremsen die Premium-Wirkung aktuell am stärksten:

1. **Mobile Hero** ist überladen — Badge + H1 + Subline + zweite Zeile + 4 Bullets + 2 CTAs konkurrieren mit dem Video. Auf 375–412 px verschwindet das Video optisch hinter Text und Overlay.
2. **Kein Theme-Toggle / kein bewusst gestalteter Light Mode.** Aktuell nur ein Mode.
3. **Admin Panel** funktioniert, ist aber zu flach: 11 Sidebar-Punkte ohne Gruppen, Settings als Endlos-Formular, Vorschauen rudimentär, kein Draft/Published-Konzept, Mobile-Tauglichkeit OK aber nicht poliert.

Sekundär: Trust-Bausteine fehlen (echte Cases, Logo-Wall sauber als "demnächst"/Beispiel), Service-Cluster wirken noch generisch im Vergleich zu Referenzseiten.

## 2. Wichtigste Probleme (priorisiert)

| # | Problem | Schwere | Wo |
|---|---------|---------|----|
| 1 | Mobile Hero textlastig, Video kaum sichtbar | hoch | `Hero.tsx` |
| 2 | Kein Light/Dark Toggle, kein Theme-System | mittel | `index.css`, neuer `ThemeProvider` |
| 3 | Admin Sidebar nicht gruppiert, Settings unübersichtlich | mittel | `Admin.tsx`, `AdminSettings.tsx` |
| 4 | Kein Draft/Published-Status für Inhalte | mittel | DB + Admin-Pages |
| 5 | Portfolio-Fallbacks könnten klarer als Beispiel-Formate kommuniziert sein | niedrig | `Portfolio.tsx` (bereits teilweise umgesetzt) |
| 6 | Services/Why wirken im Vergleich zu Monsoon/Digital Masters generisch | mittel | DB-Seeds + `Services.tsx` |
| 7 | Kein Sticky Mobile CTA → Conversion-Verlust auf Scroll | mittel | neue Komponente |
| 8 | Keine Vorschau für OG-Image als Social-Card-Mockup | niedrig | `AdminSettings.tsx` |

## 3. Mobile / Handy Analyse

**Aktueller Hero (375 px):** `h-screen` (100 vh) wird komplett befüllt mit Badge-Pille, H1 (2.5rem), Subline (16 px), zweite Zeile (14 px, muted), 4 Bullets in 1 Spalte, 2 CTAs gestapelt. Drei Overlay-Layer (`from-black/80 via-black/55 to-black/95` + horizontal + flat `bg-black/25`) verdunkeln das Video zusätzlich. Effekt: Video wirkt wie statisches dunkles Bild.

**Empfohlene Variante: A+ (reduzierter Fullscreen mit Sticky CTA)**

- Badge bleibt.
- H1 bleibt, aber kleiner (2rem) und auf 2 Zeilen begrenzt.
- Subline: gekürzte Mobile-Variante (1 Satz, max 90 Zeichen) — pflegbar als optionales `hero_subline_mobile` Setting; Fallback = Desktop-Subline auf 2 Zeilen geclamped (`line-clamp-2`).
- Zweite Zeile (`hero_secondary_line`): auf Mobile `hidden`.
- Bullets: auf Mobile auf max. 2 reduzieren (CSS `:nth-child(n+3){display:none}` unter `sm`), oder als horizontale Pillen-Reihe darstellen.
- Overlay reduzieren: nur ein vertikaler Gradient `from-black/55 via-black/15 to-black/85`, keine Flat-Layer. Video wird sichtbar.
- CTA-Block: primärer CTA bleibt im Flow, sekundärer CTA wandert in Sticky-Bottom-Bar (auf Mobile fixiert: "Projekt anfragen" + kleiner "WhatsApp"-Button wenn gepflegt). Sticky-Bar verschwindet sobald Kontakt-Sektion im Viewport ist (IntersectionObserver).
- `min-h-[100svh]` statt `h-screen` (Safari-Adressleisten-Problem lösen).
- Mobile-Poster-Variante: optional `hero_poster_mobile_url` Setting für ein dezenteres Standbild, falls Autoplay zu unruhig.

Variante B (Split-Layout Video oben/Text unten) wurde verworfen, weil sie cinematic Wirkung schwächt. Variante D (Poster statt Video) als Fallback empfohlen, falls Performance auf Low-End Android leidet.

**Weitere Mobile-Befunde:**
- Navigation OK, Mobile-Menu Drawer sauber.
- Services/Pricing-Cards: Höhe prüfen, ggf. `text-base` statt `text-lg` für Mobile.
- Kontaktformular: Felder ok, aber Trust-Block sollte über dem Formular stehen, nicht erst nach Scroll.
- Footer auf Mobile recht lang — Spalten zu Accordion umbauen (optional).
- Horizontal Scroll: in `Awards`/`Pricing` 4-Spalten-Grid prüfen.

## 4. Admin Panel Analyse

**A) Gut:** Klare URL-Struktur, NavLink-Highlighting, Dashboard mit Stats + Empfehlungen, Settings nach Gruppen, Auth + Setup-Code-Flow, RLS via `user_roles`.

**B) Verwirrend für Nicht-Techniker:**
- 11 Sidebar-Einträge ohne Gruppen — Inhalte vs. System nicht erkennbar.
- `AdminSettings` ist eine sehr lange Seite mit allen Themen (Hero, Kontakt, SEO, Footer, Sicherheit).
- "Sichtbar" vs. "Veröffentlicht" wird inkonsistent gehandhabt (Portfolio hat `published`, andere `visible`).
- JSON-Editor sichtbar — sollte nur für Devs.

**C) Fehlende Felder:**
- `hero_subline_mobile`, `hero_poster_mobile_url` (siehe Mobile).
- `social_instagram`, `social_tiktok`, `social_linkedin` (Footer/Trust).
- `contact_response_time_text` (z.B. "Antwort < 24h").
- `theme_default` (light/dark).

**D) Fehlende Vorschauen:**
- OG-Image als Twitter/LinkedIn/Facebook-Card-Mockup (1200×630 Rahmen mit Title/Description Overlay).
- Hero-Live-Preview (iframe der Landing in der Settings-Sektion oder Mini-Preview-Box).
- Portfolio: Karten-Preview wie sie auf Landing erscheint.

**E) Zusammenlegen:**
- Process + Reasons + Audience in einen "Inhalte/Sektionen"-Bereich mit Tabs (weniger Sidebar-Lärm).
- FAQ + Testimonials in "Vertrauen & Inhalte".

**F) Trennen:**
- `AdminSettings` splitten in `Branding & Hero`, `SEO & Social`, `Kontakt & Integrationen`, `System & Sicherheit` (eigene Routen statt eine Seite).

**G) Dashboard-Warnungen (bereits teils da, ausbauen):**
- "Portfolio < 3 Einträge → Landing zeigt Beispiel-Formate" (Hinweis-Karte).
- "OG-Image fehlt → Social-Shares wirken leer".
- "Hero-Video nutzt Mojli-Platzhalter".
- "WhatsApp/Calendly leer".
- "Admin-Setup-Code noch aktiv → bitte leeren".
- To-do-Checkliste mit Fortschritts-Balken ("Setup zu 70 % komplett").

**H) UX-Verbesserungen:**
- Globaler "Auf Live ansehen"-Link je Sektion (Deep-Link zur Landing mit Hash).
- Sticky "Speichern"-Bar pro Seite statt mehrere kleine Buttons.
- Toaster-Hinweis nach Save: "Live in ~5 Sek sichtbar".
- Empty States mit Illustration + CTA ("Noch kein Eintrag · Beispiel anlegen").
- Mobile-Adminbereich: Sidebar-Drawer existiert, aber Tabellen (`AdminLeads`) brauchen Card-Layout auf < 640 px.

**I) Sicherheit:**
- `admin_setup_code` automatisch invalidieren, sobald erster Admin existiert (DB-Trigger oder Edge Function).
- Audit-Log-Tabelle `admin_actions` (wer hat was geändert) — Nice-to-have.
- Rate-Limiting auf `contact_leads`-Insert (Edge Function + IP-Hash).

**J) Nice-to-have:**
- Rollen `editor` (alles außer Settings + Sicherheit), `viewer` (read-only).
- Medienbibliothek (`media_assets` Tabelle + Storage-Bucket; Drag&Drop, Wiederverwendung).
- Versionierung pro Sektion (vorherige Texte zurückrollen).

## 5. Light / Dark Mode Konzept

**Status:** Nur Dark. Tailwind hat `darkMode: ["class"]`, aber keine `.dark`-Variante in CSS — alle Tokens hängen direkt an `:root`.

**Konzept:**
- Default bleibt **Dark** (Brand-DNA).
- Toggle in Navigation (Sun/Moon Icon, neben Mute-Button).
- `prefers-color-scheme` als initialer Hint, `localStorage` overridet.
- `ThemeProvider` setzt `class="dark"` auf `<html>`.

**Token-Mapping:**

| Token | Dark (aktuell) | Light (neu, editorial off-white) |
|---|---|---|
| `--background` | `#0A0A0A` | `#F7F4ED` (warmes off-white) |
| `--foreground` | `#F4F0E8` | `#1A1612` (warmes off-black) |
| `--card` | `#141414` | `#FFFFFF` |
| `--muted` | `#1C1C1C` | `#EFEAE0` |
| `--muted-foreground` | `#B8B2AA` | `#5C544A` |
| `--border` | rgba(244,240,232,0.10) | rgba(26,22,18,0.10) |
| `--primary` | `#C9963B` | `#A87826` (etwas dunkler für Kontrast auf hellem BG) |
| `--input` | `#1C1C1C` | `#FFFFFF` |

**Komponenten mit Sonderlogik:**
- **Hero:** Light Mode behält dunkles Video-Bett (Video selbst ist filmisch dunkel) — Overlay-Gradient bleibt `black/…`, Headline-Farbe wird per Override hell gehalten. Nur Nav-Bar wechselt Farben beim Scroll.
- **Glass-Effect:** zwei Varianten (`.glass-effect` für Dark, `.glass-effect-light` mit `rgba(0,0,0,0.04)`).
- **Film Grain:** auf Light dezenter (`opacity: 0.15`).
- **Admin Panel:** vollständig theme-fähig, Default = Dark (Studio-Tool).

**Verworfen:** Auto-Invert oder reines Whiteboard-Look — würde Brand zerstören.

## 6. Inspirationsseiten-Vergleich

| Quelle | Stärken | Übernehmen | Vermeiden |
|---|---|---|---|
| **fischerAppelt** | Case-First Hero, große editorial Typo, mutige Kategorisierung | Featured-Case-Slot oben, Kategorie-Filter im Portfolio | Konzern-Komplexität, Mega-Menu |
| **Digital Masters** | Saubere Service-Cluster, Strategie/Marketing/Tech-Buckets | Services als 3 Cluster (Produktion / Performance / Content), klarere Hierarchie | KI-Hype-Wording |
| **rockandstars** | Mutige Visuals, Personality | Hover-Microinteractions auf Cards, Editorial-Tone | "Wir sind KI-Agentur"-Claim — passt nicht zu Soul Cinema |
| **Monsoon** | Premium-Wirkung, viel Whitespace, Case-Detailseiten | Case-Detail-Template, internationaler Tonfall, große Hero-Typo | Englisch-only Tonalität |
| **SUMAX** | Kennzahlen, Trust-Signale, Kontakt-CTA-System | Trust-Zeile (Antwortzeit, Lieferzeit, Iterations-Garantie), CTA-Block am Sektionsende | Fake-Zahlen, Riesen-Logo-Wall |

### Übernahme-Tabelle

| Feature | Quelle | Nutzen | Passt? | Prio | Idee |
|---|---|---|---|---|---|
| Featured-Case-Slot im Hero-Footer | fApp/Monsoon | Trust + Direkt-Beispiel | Ja (sobald 1 echter Case) | P2 | Schmaler Strip unter Hero mit 1 Video-Loop |
| Service-Cluster (3 Buckets) | DM | Klarere Story | Ja | P1 | DB-Migration `service_cluster` Feld |
| Hover-Video-Preview Portfolio | Monsoon | Premium-Wirkung | Ja | P2 | `<video>` on hover, mute, autoplay |
| Trust-Zeile Antwortzeit/Lieferzeit | SUMAX | Conversion | Ja | P1 | im Hero/Contact, keine Fake-Zahlen |
| Case-Detail-Seiten | Monsoon | SEO + Tiefe | Ja, später | P3 | `/work/:slug` Route |
| Kategorie-Filter Portfolio | fApp | UX | Ja | P2 | Tag-Chips |
| Sticky-Bottom-CTA Mobile | DM/SUMAX | Conversion | Ja | P1 | Neue Komponente |
| Light/Dark Toggle | (allgemein) | Modern, Accessibility | Ja | P1 | siehe §5 |
| Editorial-Großtypo Sektionen | Monsoon | Premium | Ja | P2 | Section-Header-Komponente |

## 7. Soul Cinema sollte übernehmen

- Klare 3-Cluster-Service-Struktur.
- Trust-Mikrozeile (Antwortzeit, Iterationen inklusive, etc. — nur was echt einhaltbar ist).
- Sticky Mobile-CTA.
- Light/Dark Toggle.
- Editorial Section-Header.
- Hover-Video-Preview Portfolio (für echte Cases).
- Mobile Hero-Diet (Variante A+).

## 8. Soul Cinema sollte NICHT übernehmen

- Fake-Kundenlogos.
- Erfundene Zahlen ("40+ Marken", "200 % ROAS").
- KI-Agentur-Wording.
- Komplexe Mega-Menüs.
- Riesige englischsprachige Internationalitäts-Pose.
- Auto-Invert Light Mode.

## 9. Konkretes Optimierungskonzept

**Mobile Hero (Variante A+):** Overlay reduzieren, Texte kürzen, Bullets auf 2, Sticky CTA, `min-h-[100svh]`, optionale Mobile-Settings.

**Theme:** ThemeProvider, Toggle in Nav, CSS-Variablen pro `.dark` / Root, Admin-kompatibel.

**Admin:** Sidebar-Gruppen ("Inhalte", "Marketing", "System"), Settings in 4 Routen splitten, Dashboard-Checkliste, Empty States, Live-Preview-Iframe in Hero-Settings, OG-Image-Mockup.

**Trust:** Microzeile (Antwortzeit, Konzept-Call kostenlos, Erste Iteration inklusive) — pflegbar in Settings.

**Portfolio:** Beispiel-Formate-Logik bleibt; Hover-Preview vorbereiten (DB-Feld `preview_video_url`).

**Services:** DB-Feld `cluster` (`produktion` / `performance` / `content`), Frontend rendert 3 Spalten/Reihen mit Cluster-Header.

**Kontakt:** Trust-Block über dem Formular auf Mobile; WhatsApp-Quick-Button wenn Setting gepflegt.

**SEO:** Schema.org `LocalBusiness` + `Service` JSON-LD; späte Landingpages `/produktvideos`, `/social-ads`, `/saas-videos` (P3).

## 10. Priorisierte Roadmap

### Phase 1 — Mobile Hero Sofort-Fixes (P1, ~2h, Risiko: niedrig)
- `Hero.tsx`: Overlay reduzieren, Mobile-Texte kürzen, Bullets begrenzen, `100svh`.
- Neue `StickyMobileCta.tsx` (auf Landing eingebunden, blendet aus wenn Kontakt sichtbar).
- DB-Migration: `hero_subline_mobile`, `hero_poster_mobile_url`, `contact_response_time_text` als optionale Settings.
- Admin: 3 neue Felder in `AdminSettings`.
- **Effekt:** Video wieder sichtbar, mobile Conversion höher.

### Phase 2 — Admin UX Quick Wins (P1, ~3h, Risiko: niedrig)
- Sidebar in `Admin.tsx` gruppieren (3 Sektionen mit Headern).
- `AdminSettings.tsx` splitten in 4 Routen (Branding/Hero, SEO/Social, Kontakt/Integrationen, System).
- Dashboard: Setup-Checkliste mit Progress-Bar.
- Empty States für leere Listen.
- Mobile-Tabellen → Card-Layout in `AdminLeads`.
- **Effekt:** Nicht-Techniker findet sich schneller zurecht.

### Phase 3 — Light/Dark Theme System (P1, ~3h, Risiko: mittel)
- `ThemeProvider.tsx` (Context, localStorage, prefers-color-scheme).
- `index.css` umbauen: `.dark` Block mit aktuellen Werten, `:root` mit Light-Werten (oder umgekehrt, abhängig vom Default).
- Toggle-Button in Nav (Hero) + in Admin-Header.
- Komponenten-Audit: `bg-[#0A0A0A]`, `text-[#F4F0E8]` hardcoded Werte → Tokens.
- Hero behält dunkles Video-Bett auch im Light Mode.
- **Effekt:** Modern, Accessibility, optional für Nutzer.

### Phase 4 — Trust / Cases / Portfolio (P2, ~3h, Risiko: niedrig)
- Trust-Microzeile-Komponente, Settings-Felder.
- Service-Cluster (DB-Feld + Frontend).
- Portfolio Hover-Video-Preview (DB-Feld `preview_video_url`, `Portfolio.tsx`).
- Kategorie-Filter Portfolio.
- **Effekt:** Premium-Wirkung, bessere Story.

### Phase 5 — Conversion / Kontakt / Services (P2, ~2h, Risiko: niedrig)
- Trust-Block über Kontaktformular auf Mobile.
- WhatsApp-Quick-Button.
- Service-Wording schärfen (Seeds).
- Editorial Section-Header.
- **Effekt:** Conversion + Brand.

### Phase 6 — Nice-to-have (P3, je 3–6h)
- Medienbibliothek (`media_assets` Tabelle, Storage-Bucket, Picker im Admin).
- Live-Preview-Iframe in Hero-Settings.
- Rollen `editor` / `viewer`.
- Audit-Log.
- Case-Detail-Pages `/work/:slug`.
- SEO-Landingpages.

## 11. Betroffene Dateien

| Phase | Dateien |
|---|---|
| 1 | `src/components/Hero.tsx`, neue `src/components/StickyMobileCta.tsx`, `src/pages/Landing.tsx`, `src/pages/admin/AdminSettings.tsx`, neue Migration |
| 2 | `src/pages/admin/Admin.tsx`, `AdminSettings.tsx` (split in 4 neue Files), `AdminDashboard.tsx`, `AdminLeads.tsx`, `_EntityCrud.tsx` |
| 3 | neue `src/components/ThemeProvider.tsx` + `ThemeToggle.tsx`, `src/index.css`, `src/main.tsx`, Komponenten mit Hardcodes (`Hero`, `About`, `Footer`, `Contact`, …) |
| 4 | `src/components/Portfolio.tsx`, `Services.tsx`, neue `TrustBar.tsx`, Migration für `services.cluster`, `portfolio_items.preview_video_url` |
| 5 | `Contact.tsx`, `Services.tsx`, neue `SectionHeader.tsx`, DB-Seeds |
| 6 | neue Tabellen + Storage, `MediaPicker.tsx`, neue Admin-Routen |

## 12. Risiko & Aufwand

| Phase | Aufwand | Risiko | Begründung |
|---|---|---|---|
| 1 | 2h | niedrig | Lokale Hero-Änderungen + 3 DB-Felder |
| 2 | 3h | niedrig | Reines Admin-Refactor, kein User-Impact |
| 3 | 3h | **mittel** | Berührt viele Komponenten mit hardcoded Farben — Regression-Gefahr |
| 4 | 3h | niedrig | Additive Features |
| 5 | 2h | niedrig | Copy + kleine Layout-Änderungen |
| 6 | je 3–6h | mittel | Neue Tabellen, Storage, Rollenlogik |

## 13. Empfehlung erster Sprint

**Sprint 1 = Phase 1 + Phase 2** (Mobile Hero Fix + Admin UX Quick Wins). Zusammen ca. 5h, niedriges Risiko, sofort spürbarer Effekt für Endnutzer (Mobile) und Inhaber (Admin). Phase 3 (Theme) bewusst als eigener Sprint, weil sie viele Komponenten anfasst und gründliches QA braucht.

---

**Soll ich mit Phase 1 (Mobile Hero Sofort-Fixes) starten — oder direkt Phase 1 + 2 als Sprint 1 umsetzen?**
