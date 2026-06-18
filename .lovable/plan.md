# Soul Cinema – Strategischer Audit & Verbesserungsplan

> Reiner Plan. Keine Umsetzung vor Freigabe. Hero-Video & Logo bleiben.

---

## 1. Executive Summary

**Gesamtbild:** Solides cinematic Dark-Theme, funktionale Supabase-Anbindung mit CMS-Hooks, vollständiger Admin-Bereich für die meisten Inhalte. Die Seite wirkt aber stellenweise noch *template-nah* statt *Premium-Ad-Studio*: zu viele gleichwertige Sektionen, generisches Wording, Preise zu früh sichtbar, Portfolio mit Platzhaltern ohne Kennzeichnung, kein klarer Social-Proof-Block für später, Adminbereich teils zu technisch.

**Stärken**
- Cleaner Tech-Stack (Vite/React/TS, Tailwind, Helmet, Supabase RLS).
- CMS-Hooks (`useCms`, `useSettings`) + Fallbacks → Seite läuft auch ohne DB.
- SEO-Komponente, JSON-LD, robots.txt, sitemap.xml, llms.txt vorhanden.
- Admin mit Setup-Code, Rollen-Tabelle, separater `user_roles`.

**Schwächen**
- Hero-Copy & CTA zu allgemein, Nutzen "Produktlink reicht" nicht prominent.
- Wording streckenweise austauschbar; Positionierung "Ad Studio" nicht spitz.
- Portfolio-Fallbacks wirken wie echte Cases (keine "Beispiel"-Kennzeichnung).
- Preise stehen vor Vertrauen → Conversion-Bremse.
- Admin-Settings teils Key/Value-Listen statt Formularen mit Vorschau.
- Kein Draft/Published-Status, keine Medienbibliothek, kein Live-Preview.
- Mobile Hero-Lesbarkeit & CTA-Hierarchie nicht final.

**Produktionsreife:** ~65 %. Launch-fähig nach Phase 1+2.

**Scores (1–10)**
| Bereich | Score |
|---|---|
| Visual Design | 7 |
| UX / Flow | 6 |
| Copy / Positionierung | 5 |
| Code-Qualität | 7.5 |
| Admin / CMS | 6 |
| SEO | 7.5 |
| Performance | 6.5 |
| Sicherheit | 7 |
| Conversion | 5.5 |

---

## 2. Sektions-Analyse

### Navigation
- **Problem:** Sticky-Verhalten & aktiver Section-Highlight unklar; CTA "Projekt anfragen" verschmilzt visuell.
- **Fix:** Glas-Bar mit Scroll-Shrink, aktive Section unterstrichen, CTA als amber Solid-Button. Mobile: Hamburger mit Full-Screen-Overlay, CTA pinned unten.
- **Priorität:** Hoch.

### Hero
- **Problem:** Headline zu poetisch, kein konkretes Outcome; CTA-Pair zu gleichwertig; "Produktlink reicht" fehlt.
- **Fix:** Klare Nutzen-Headline + sekundärer Trust-Satz + 1 Primär-CTA + 1 sekundärer Link. Mute/Sound-Toggle behalten. Badge spitzer formulieren.
- **Texte:** siehe §3.
- **Priorität:** Kritisch.

### Leistungen
- **Problem:** 6 Karten zu flach, Beschreibungen austauschbar. Keine Differenzierung "Produktvideo vs. Social Ad vs. Launch".
- **Fix:** 3 Hero-Leistungen (Produktvideo, Social Ad, Launch-Kampagne) groß, darunter 3 ergänzende (SaaS/App, E-Commerce Reels, Content Pakete) kleiner. Jede Karte: Outcome, Format, typische Lieferzeit.
- **Priorität:** Hoch.

### Portfolio
- **Problem:** Fallback-Cards wirken wie echte Cases. Keine Plattform-/Ziel-/Format-Badges in der Tiefe genutzt.
- **Fix:** Solange < 3 echte Cases → Section umlabeln zu *„Formate & Beispiel-Setups"* mit klarem Hinweis „Beispielhafte Format-Vorlagen". Sobald echte Videos vorhanden: Grid 3-Spalten, Video-Hover-Autoplay (muted), Badges Plattform/Format/Ziel, Featured-Pin oben.
- **Datenfelder Case:** title, client (optional), category, platform, goal, format, duration, thumbnail, video_url, featured, sort_order, published, year.
- **Priorität:** Hoch.

### Prozess
- **Problem:** Schritte ok, Kunden-Input vs. Studio-Leistung unklar.
- **Fix:** Pro Schritt zwei Mini-Zeilen: *„Du lieferst:"* / *„Wir machen:"*. Schritt 1 explizit: „Produktlink oder Bilder reichen".
- **Priorität:** Mittel.

### Warum Soul Cinema
- **Problem:** Vorteile generisch.
- **Fix:** 4 Reasons mit messbaren Versprechen (Lieferzeit, Iterationen, Hooks pro Spot, Plattform-Anpassung).
- **Priorität:** Mittel.

### Preise
- **Problem:** Zu früh in der Journey, kann abschrecken; Pakete wirken starr.
- **Fix:** Section weiter nach unten (vor FAQ), "Ab"-Preise visuell, Hinweis "Einstiegspreise" amber Badge, "Individuelles Angebot" als 4. Karte/CTA.
- **Priorität:** Hoch.

### Testimonials
- **Problem:** Aktuell sichtbar ohne echte Stimmen → Risiko Fake-Wirkung.
- **Fix:** Section nur rendern, wenn `testimonials.visible=true` Count ≥ 2. Sonst komplett ausblenden. Admin sieht Hinweis im Dashboard.
- **Priorität:** Kritisch (gegen Fake-Eindruck).

### FAQ
- **Problem:** 5 Fragen, decken Kern-Einwände nicht voll ab.
- **Fix:** Auf 8–10 erweitern (siehe §3).
- **Priorität:** Mittel.

### Kontakt
- **Problem:** Form ok, aber Wert vor Formular schwach; kein WhatsApp/Calendly-optional.
- **Fix:** Trust-Block links (Antwortzeit, Was passiert nach Absenden, NDA möglich), Form rechts. Pflicht nur: Name, E-Mail, Nachricht. Rest optional. Optional: WhatsApp-Quick-Link + Calendly-Embed/Link, beide admin-toggle.
- **Priorität:** Hoch.

### Footer
- **Problem:** Standard.
- **Fix:** 4 Spalten: Brand+Claim / Leistungen / Rechtliches / Kontakt + Social (admin-pflegbar, leer = ausblenden).
- **Priorität:** Niedrig.

### Mobile
- **Problem:** Hero-Text zu groß, CTA-Stack zu hoch; Sticky-CTA fehlt.
- **Fix:** Hero clamp-Typo, ein Primary-CTA, Sticky-Bottom-CTA „Projekt anfragen" ab Scroll > Hero.
- **Priorität:** Hoch.

---

## 3. Wording-Vorschläge

**Hero**
- Badge: `Ad Studio für Produktvideos & Social Ads`
- Headline: `Produktvideos, die verkaufen. Cinematic produziert.`
- Subline: `Wir entwickeln Werbevideos und Social Ads für digitale und physische Produkte — von Konzept bis Lieferung. Ein Produktlink oder bestehende Bilder reichen, um zu starten.`
- Bullets: `Konzept · Produktion · Lieferung aus einer Hand` / `Formate für Meta, TikTok, YouTube & Shop` / `Erste Cuts in 7–14 Tagen`
- Primary CTA: `Projekt anfragen` · Secondary: `Leistungen ansehen`

**Leistungen (Karten-Tagline + Beschreibung)**
- *Produktvideos* — „Dein Produkt, kinoreif inszeniert." Für Shop, Landingpage und Markenauftritt.
- *Social Ads* — „Hook-getriebene Ads, die scrollen stoppen." Meta, TikTok, YouTube Shorts.
- *Launch-Kampagnen* — „Mehrere Hooks, ein Ziel: Verkaufen." Varianten für A/B-Tests.
- *SaaS & App* — „Komplexes Produkt, klare Story." Erklär-/Promo-Videos.
- *E-Commerce Reels* — „Short-Form, das in den Feed passt." Für Marken & Shops.
- *Content Pakete* — „Laufender Output statt Einmalproduktion." Monatliche Pakete.

**Prozess**
1. *Anfrage* — Du sendest Produktlink, Bilder oder Material. / Wir prüfen Eignung & Format.
2. *Briefing* — Du beantwortest 5 kurze Fragen. / Wir definieren Hook, Ziel, Plattform.
3. *Konzept* — Du gibst Feedback. / Wir liefern Storyboard & Shotlist.
4. *Produktion* — Du lehnst dich zurück. / Wir produzieren, schneiden, vertonen.
5. *Lieferung* — Du erhältst fertige Cuts in allen Formaten. / Wir übergeben + 1 Revisionsrunde.

**Preise (Headline)**
- `Transparente Einstiegspreise. Finaler Preis nach Briefing.`

**FAQ-Ergänzungen**
- Brauche ich fertiges Videomaterial? *Nein. Produktbilder oder ein Produktlink reichen für den Start.*
- Welche Formate erhalte ich? *9:16, 1:1, 4:5, 16:9 — je nach Plattform.*
- Können mehrere Varianten/Hooks erstellt werden? *Ja, ab Professional standardmäßig 3 Hooks pro Spot.*
- Wie läuft die Zusammenarbeit? *Asynchron über Briefing-Dokument, Feedback-Runden per Mail/Loom.*
- Bietet ihr NDA an? *Ja, auf Anfrage.*

**Kontakt-Lead-Text**
- `Ein kurzer Satz zu deinem Produkt genügt. Wir melden uns innerhalb von 24h mit Einschätzung & nächstem Schritt.`

**Footer-Claim**
- `Soul Cinema — Ad Studio aus Birmingham für Produktvideos, Werbevideos und Social Ads.`

---

## 4. Admin / CMS-Analyse

**Aktuell gut**
- Auth + Setup-Code, `has_role()`, RLS auf allen Tabellen.
- CRUD für services, process, reasons, audience, faq, testimonials, pricing.
- Leads mit Filter, CSV-Export, Status.
- Portfolio-Uploads in privaten Bucket, signed URLs.

**Schwachstellen**
- `AdminSettings` teils flach – keine Vorschauen pro Block (Hero-Preview fehlt).
- Kein **Draft/Published**-Status (nur `visible`).
- Keine Medienbibliothek (Uploads nur pro Portfolio-Item).
- Kein **Live-Preview** der Landingpage aus Admin.
- Keine **Audit-Logs** (wer hat was geändert).
- Rollen vorbereitet (`admin`, `editor`, `viewer`), aber nicht UI-seitig durchgesetzt.
- Setup-Code-Rotation manuell.

**Empfohlene Erweiterungen**
- `published` boolean + `status` enum (`draft`/`scheduled`/`published`) auf inhaltsführenden Tabellen.
- Tabelle `media_assets` (id, path, mime, size, alt, tags, uploader, created_at) + Admin-Seite *Medien*.
- Tabelle `audit_logs` (entity, entity_id, action, actor, diff_json, created_at).
- Admin-Seite *Vorschau* (iframe auf `/?preview=token`).
- Admin-Seite *Branding* (Logo, Farben, Akzent-Token – schreibt CSS-Variablen via `site_settings`).
- Admin-Seite *SEO* getrennt von allg. Settings (Title, Desc, OG, Twitter, JSON-LD-Toggle).
- Rollen-UI: Editor darf Inhalte, nicht Settings/Users; Viewer nur Leads.

**Sicherheit**
- Setup-Code in `site_settings` ablegen + Force-Rotate-Workflow.
- Rate-Limit auf `claim_admin` & Login (per Edge-Function-Proxy).
- Signed-URL-Expiry auf 24h statt 1 Jahr.
- File-Validation serverseitig in Edge Function (nicht nur Client).

---

## 5. Technische Analyse

**Sauber**
- Komponenten-Trennung, Tailwind-Tokens, Helmet-Per-Route, `useCms` Pattern.
- RLS + GRANTs + `has_role` Security-Definer.

**Verbesserung**
- `Hero.tsx` (196 Zeilen) → in `HeroMedia`, `HeroCopy`, `HeroCTA` splitten.
- `Contact.tsx` (223 Z.) → Form-Schema in eigene Datei, `useContactForm` Hook.
- Fehlende Loading-Skeletons in Sections (aktuell Fallback sofort).
- `useCms` kein Cache → React Query empfohlen.
- Bilder/Videos ohne `loading="lazy"` / `preload="none"` durchgängig.
- Kein Error-Boundary auf Landing.
- `AdminPortfolio` Validation client-only → Edge-Function.
- Keine E2E-Tests; nur Visual-QA Workflow.

**SEO**
- Dynamische OG-Tags ok, aber kein `Article`/`Organization`-JSON-LD im Footer/global.
- `sitemap.xml` statisch – sollte per Build aus DB-Routen generiert werden, sobald Cases einzelne URLs erhalten.

**Performance**
- Hero-Video WebM gut, aber kein `poster` fallback wenn `hero_poster_url` leer → schwarzer Frame.
- Fonts: prüfen ob `font-display: swap` + Preload.
- LCP-Ziel: Hero-Headline.

**Accessibility**
- Kontrast `text-[#A8A29E]` auf `#0A0A0A` grenzwertig (AA bei kleiner Schrift knapp). Auf `#B8B2AA` heben.
- Video braucht Untertitel-Spur oder `aria-label`.
- Form-Errors brauchen `aria-describedby`.

---

## 6. Priorisierte Roadmap

### Phase 1 — Kritische Sofort-Fixes (1–2 Tage)
- Hero-Copy, CTA-Hierarchie, "Produktlink reicht"-Hinweis (`Hero.tsx`, `site_settings`).
- Testimonials nur bei ≥ 2 echten Stimmen rendern (`Testimonials.tsx`, `Landing.tsx`).
- Portfolio-Fallbacks als „Beispiel-Format" labeln (`Portfolio.tsx`).
- Mobile Hero-Typo + Sticky-Bottom-CTA (`Hero.tsx`, neue `MobileCta.tsx`).
- Kontrast-Token `--muted-foreground` anheben (`index.css`).
- **Risiko:** niedrig · **Effekt:** hoch (Vertrauen + Conversion).

### Phase 2 — Conversion & Wording (2–3 Tage)
- Alle Texte gem. §3 in DB seeden (Migration).
- Section-Reihenfolge: Hero → Leistungen → Prozess → Warum → Portfolio → Preise → FAQ → Kontakt.
- Kontakt-Trust-Block + optionale WhatsApp/Calendly-Toggles (`Contact.tsx`, `site_settings`).
- Preise: "Ab"-Badge + 4. Karte "Individuell" (`Pricing.tsx`).
- FAQ-Erweiterung (Migration + `FAQ.tsx`).
- **Effekt:** hoch · **Risiko:** niedrig.

### Phase 3 — Admin/CMS professionalisieren (3–5 Tage)
- `status`-Enum + Draft/Published auf services/portfolio/faq/pricing.
- `AdminSettings` in Bereiche splitten (Hero / SEO / Kontakt / Branding / Security) mit Live-Vorschau-Cards.
- Rollen-UI (`editor`, `viewer`) durchsetzen in Routes-Guard.
- `audit_logs`-Tabelle + Einträge bei jedem Update.
- Live-Preview-Iframe in Admin.
- **Effekt:** mittel-hoch · **Risiko:** mittel (Migrationen).

### Phase 4 — Medien & Portfolio (2–4 Tage)
- `media_assets`-Tabelle + Admin-Seite *Medien* (Upload, Alt, Tags, Wiederverwendung).
- Portfolio-Editor mit Multi-Asset, Featured-Toggle, Video-Hover-Preview im Frontend.
- Signed-URL-TTL reduzieren, Refresh-Logik im Hook.
- **Effekt:** hoch (sobald echte Cases da) · **Risiko:** mittel.

### Phase 5 — SEO / Performance / Sicherheit (1–3 Tage)
- `Organization` + `WebSite` JSON-LD global.
- Sitemap-Build aus DB; Canonicals pro künftiger Case-Seite.
- Hero `poster`-Fallback erzwingen, Video `preload="metadata"`.
- Font-Preload + `font-display: swap`.
- Edge-Function für Server-Side File-Validation + Rate-Limit `contact_leads`.
- Setup-Code-Rotation-Flow.
- **Effekt:** mittel · **Risiko:** niedrig.

### Phase 6 — Nice-to-have
- Case-Detail-Seiten `/work/[slug]`.
- Blog/Insights mit MDX aus Supabase.
- A/B-Test-Framework für Hero-Headlines.
- Mehrsprachigkeit (DE/EN).
- Analytics-Dashboard im Admin (Plausible/Umami).

---

## 7. Umsetzungsempfehlung

**Zuerst (jetzt):** Phase 1 + 2 zusammen in einem Sprint — größter Hebel auf Vertrauen & Conversion, niedriges Risiko, keine Datenbank-Strukturbrüche.

**Danach:** Phase 3 (Admin-Professionalisierung), damit du Inhalte ohne Entwickler pflegen kannst, bevor echte Kunden-Cases kommen.

**Sobald echte Medien existieren:** Phase 4.

**Vor Marketing-Launch:** Phase 5.

**Bewusst NICHT umsetzen jetzt:**
- Hero-Video ersetzen (bleibt, nur editierbar machen).
- Logo redesign.
- Fake-Testimonials oder Fake-Logos einbauen.
- „40+ Marken"-Claim.
- Mehrsprachigkeit / Blog (Phase 6, später).

**Optional, Entscheidung offen:**
- Calendly-Einbettung (vs. nur Link).
- WhatsApp-Quick-Action (DSGVO-Hinweis nötig).
- Audit-Logs (Phase 3, kann verschoben werden, wenn nur 1 Admin).

---

**Bitte gib Freigabe oder markiere, welche Phasen/Punkte du anders priorisierst — danach starte ich mit der Umsetzung.**
