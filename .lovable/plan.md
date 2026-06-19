
# Soul Cinema – Analytics & KPI Dashboard (Konzept)

## 1. Executive Summary

Wir bauen ein **eigenes, first-party Analytics-System** direkt auf der bestehenden Lovable Cloud / Supabase-Infrastruktur. Es ist:

- **Datensparsam:** keine Roh-IP, keine Drittanbieter, keine Tracking-Cookies, keine Heatmaps, kein Fingerprinting.
- **Server-seitig validiert:** Browser sendet Events ausschließlich über eine Edge Function `track-analytics-event`. Tabellen sind für `anon` schreibgeschützt.
- **Im Admin sichtbar:** neue Route `/admin/analytics` plus eine kleine KPI-Zeile im bestehenden Dashboard. Auf der öffentlichen Website wird **nichts** angezeigt.
- **Schaltbar:** in `analytics_settings` lässt sich Analytics global und je Event-Typ deaktivieren.
- **Phasiert:** wir liefern zuerst einen schlanken MVP (Phase A), keine BI-Suite.

Empfehlung am Ende: mit **Phase A: Analytics MVP** starten.

## 2. Bestehender Projektstand (Kurz-Audit)

- Stack: React/Vite, Supabase (`@/integrations/supabase/client`), Tailwind, react-router.
- Routen: `/`, `/impressum`, `/datenschutz`, `/agb`, `/admin/*`.
- Admin: bereits umfangreich (`AdminDashboard`, `AdminLeads`, Portfolio, Pricing, FAQ, Services, Testimonials, Settings, Audience, Process, Reasons). Auth läuft über `user_roles` + `has_role('admin')`.
- Leads: `contact_leads` (13 Felder, Status-Workflow `new/contacted/in_talks/won/lost`) – wird im Dashboard heute schon gezählt.
- CMS: `site_settings` (key/value) – Erweiterung um Analytics-Toggles bewusst **nicht** hier, sondern in eigener Tabelle (siehe §5), damit Settings sauber typisiert bleiben.
- Edge Functions: aktuell keine. Secrets `SUPABASE_SERVICE_ROLE_KEY` etc. sind vorhanden.
- Storage: `portfolio-media` (privat). Nicht relevant für Analytics.
- Frontend-Touchpoints, die Tracking sinnvoll machen: `Hero` CTA, `StickyMobileCta`, `Pricing` Cards, `Contact` Form, `FAQ` Accordion, WhatsApp/Calendly Links, Theme-Toggle, Sektionen `#services #portfolio #process #pricing #faq #contact`.

**Empfehlung zur Integration:** eigene Admin-Seite `/admin/analytics` (Übersicht, Funnel, CTAs, Geräte, Quellen) **plus** zusätzliche 4-KPI-Zeile oben im bestehenden Dashboard (Besucher 7T, Pageviews 7T, Leads 7T, Conversion 7T) als Quick-Glance.

## 3. Datenschutzfreundliches Analytics-Konzept

Grundprinzipien:

- **Keine Cookies, kein localStorage für Tracking-IDs.** Stattdessen pro Tab eine `sessionStorage`-Zufalls-ID (lebt nur bis Tab-Close, kein Cross-Site-Tracking, in DE meist als technisch erforderlich einstufbar – Hinweis: keine Rechtsberatung).
- **Visitor-Hash serverseitig:** Edge Function bildet `visitor_hash = sha256(daily_salt || ip || user_agent)`, wobei `daily_salt` täglich rotiert und nur in Function-Memory/Secret lebt. Damit ist die ursprüngliche IP nicht rekonstruierbar und der Hash spätestens nach 24 h nicht mehr verkettbar. Roh-IP wird **nie** gespeichert.
- **Keine Inhalte aus Formularen** in Events. Es wird nur erfasst: „Formular gestartet/abgesendet/Fehler“, keine Feldwerte.
- **Bot-Filter:** UA-Heuristik (googlebot, bingbot, headlessChrome, AhrefsBot, etc.) + Drop für Requests ohne `Referer`+`Accept-Language` Kombination + Rate Limit.
- **Retention:** Default 180 Tage in `analytics_events`. Tages-Aggregate in `analytics_daily` bleiben länger (KPIs ohne Personenbezug).
- **DNT respektieren:** wenn `navigator.doNotTrack === '1'`, sendet der Client keine Events.
- **Admin-Schalter:** alles per `analytics_settings` deaktivierbar. Wenn global aus, schickt der Client nichts und die Function lehnt ab.
- **Consent-Banner:** **kein** Banner vorgesehen. Die Architektur (kein Cookie, keine personenbezogene ID, kein Cross-Site) ist so gewählt, dass in der Regel keine Einwilligung nötig ist. **To-do:** vor Live-Schaltung anwaltlich prüfen lassen – wir behaupten keine Rechtsberatung.
- **Datenschutzerklärung:** Abschnitt „Eigene Website-Analyse / First-Party Analytics“ ergänzen (siehe §12).

## 4. Empfohlene Architektur

```text
Browser  --(fetch, JSON)-->  Edge Function track-analytics-event
                                |- Zod-validate payload
                                |- Bot-Filter + Rate Limit (per IP-Hash)
                                |- Salt + hash IP+UA -> visitor_hash
                                |- Insert via service_role into analytics_events
                                |- 204 No Content
Admin Panel  --(authed select)-->  analytics_events / analytics_daily
                                    (RLS: nur admin lesen)
Cron (Supabase Scheduled Function, später)
   - rollt täglich Aggregate in analytics_daily
   - löscht Events älter als retention_days
```

- `analytics_events` **GRANT INSERT nur an service_role**, keine direkten anon-Inserts.
- `anon` darf nichts lesen/schreiben in Analytics-Tabellen.
- Lese-Policies: `authenticated AND has_role(auth.uid(),'admin')`.

## 5. Datenbankmodell

`analytics_events` (Roh-Events, kurzlebig):

- event_name (text, enum-validiert)
- page_path, section_key, cta_id (text, nullable)
- metadata (jsonb, whitelisted keys)
- visitor_hash, session_hash (text, nullable)
- device_type (`mobile|desktop|tablet`)
- viewport_bucket (`xs|sm|md|lg|xl`) – kein exakter Pixelwert
- browser_name, os_name (grob: Chrome/Safari/Firefox/Other; iOS/Android/macOS/Windows/Other)
- referrer_domain (nur Host, kein Path/Query)
- utm_source/medium/campaign/content/term
- theme (`dark|light`)
- created_at

`analytics_daily` (Aggregat, langlebig):

- date (pk)
- page_views, unique_visitors_est, cta_clicks
- contact_views, contact_starts, contact_submits, contact_errors
- leads_count
- mobile/desktop/tablet_visitors
- top_referrer, top_utm_source
- updated_at

`analytics_settings` (1 Zeile, Singleton):

- analytics_enabled (bool, default true)
- track_page_views, track_cta_clicks, track_section_views, track_form_events, track_referrers, track_device, track_theme (bool)
- retention_days (int, default 180)
- bot_filter_enabled (bool, default true)
- updated_at

Bewertung:
- `analytics_daily` ist **nicht** MVP-blockierend – Phase A kann live mit Direkt-Aggregation aus `analytics_events` (per Date-Trunc) auskommen. `analytics_daily` lohnt sich ab ~50k Events.
- `lead_status_history` gehört in Phase C (Mini-CRM), nicht MVP.

RLS-Skizze (alle drei Tabellen):
- `service_role`: ALL.
- `authenticated` + `has_role(uid,'admin')`: SELECT (+ UPDATE für `analytics_settings`).
- `anon`: keine Rechte.

## 6. Edge Function `track-analytics-event`

- Methode: `POST`, JSON.
- CORS: nur Origin der Produktions- und Preview-Domain.
- Validierung mit Zod, **Allowlist** für `event_name` und `metadata.keys`.
- Payload (Browser):
  ```
  { event_name, page_path, section_key?, cta_id?, metadata?,
    session_id (random, sessionStorage), viewport_w, device_type,
    theme, referrer, utm:{...} }
  ```
- Function:
  1. Settings laden, wenn `analytics_enabled=false` oder Event-Typ-Toggle aus → 204 ohne Insert.
  2. Bot-Filter (UA-Liste + heuristisch) → 204.
  3. Rate Limit pro `visitor_hash`: 60 Events/Minute, 600/Stunde.
  4. `visitor_hash = sha256(daily_salt || ip || ua)`.
  5. Insert in `analytics_events`.
- **Niemals** rohe IP, kein User-Agent-String, keine Form-Felder speichern. UA nur derivativ als `browser_name`/`os_name`.
- Fehler: 4xx mit kurzem Code, kein Stacktrace nach außen.

## 7. Event Tracking Konzept

| Event | MVP | Zweck | Daten | Nicht gespeichert |
|---|---|---|---|---|
| `page_view` | ✅ | Reichweite | path, referrer, utm, device | URL-Query außer utm_* |
| `cta_click` | ✅ | CTA-Performance | cta_id (hero/sticky/contact) | Button-Text |
| `pricing_cta_click` | ✅ | Paket-Interesse | package_slug, package_tier | Preis |
| `contact_view` | ✅ | Funnel-Schritt | – | – |
| `contact_start` | ✅ | Funnel-Schritt | – | Feldwerte |
| `contact_submit_success` | ✅ | Conversion | – | Name/E-Mail/Message |
| `contact_submit_error` | ✅ | UX-Probleme | error_code | Validation-Texte |
| `external_link_click` | ✅ | WA/Calendly | target (`whatsapp|calendly`) | Nummer/URL |
| `section_view` | B | Content-Interesse | section_key | – |
| `faq_open` | B | FAQ-Insights | faq_id | Frage-Text (id reicht) |
| `portfolio_interaction` | B | Case-Interesse | portfolio_id, category | Titel |
| `theme_change` | B | Theme-Mix | from, to | – |

Strikt verboten: Formularinhalte, Namen, E-Mails, Telefonnummern, Message-Body, Lead-IDs. Diese leben ausschließlich in `contact_leads`.

## 8. Admin Analytics Dashboard

Neue Route: `/admin/analytics` (Sidebar-Eintrag „Analytics“ unter „Anfragen“). Zusätzlich oben im bestehenden Dashboard 4 Quick-KPIs.

Sektionen der neuen Seite (Tabs oder Anker):

1. **Übersicht** – KPI-Cards (Besucher heute/7T/30T, Pageviews, Leads, Conversion %) + Mini-Sparkline pro Card.
2. **Traffic** – Tabelle Top-Referrer, UTM-Kampagnen, Direct vs. Referral.
3. **Geräte** – Donut Mobile/Desktop/Tablet, Tabelle Browser/OS grob.
4. **Conversion Funnel** – Balken: Visit → CTA → Contact View → Start → Submit → Lead.
5. **CTA Performance** – Tabelle pro `cta_id` mit Klicks und CTR (Klicks / Visits).
6. **Content Insights (B)** – Sektion-Views, FAQ-Opens, Portfolio-Klicks, Pricing-Paket-Interesse.
7. **Einstellungen** – Toggle-Liste aus `analytics_settings`.

Zeitraumfilter: Heute / 7T / 30T / 90T (default 7T). Lade- und Leerzustände, Mobile-fähig. Charts: leichtgewichtig (z. B. `recharts`, ist im shadcn-Stack bereits üblich). **Kein** CSV-Export im MVP.

## 9. Conversion Funnel

Schritte aus den MVP-Events:

```text
Visits (unique_visitor_hash, page_view)
  → CTA Click (cta_click ∪ pricing_cta_click)
  → Contact View (contact_view)
  → Contact Start (contact_start)
  → Contact Submit (contact_submit_success)
  → Lead gespeichert (contact_leads count im Zeitraum)
```

Anzeige: Zahl pro Schritt + Übergangs-% + Drop-off. Hinweis im UI: Werte sind Näherung ohne Cookies; bei < 200 Besuchern pro Zeitraum nur als „Trend“ kennzeichnen.

## 10. Lead Dashboard / Mini-CRM (Phase C, **nicht MVP**)

Erweiterung `contact_leads`:
- `utm_source/medium/campaign` (text, nullable) – beim Insert aus aktueller Session übernehmen.
- `referrer_domain`, `interest_package` (text).
- `follow_up_at` (timestamptz), `notes` (text).
- Neue Tabelle `lead_status_history(lead_id, old_status, new_status, changed_by, changed_at)` mit Trigger.

UI: Lead-Detail-Drawer mit Status-Pipeline, Notizen, Quelle. Bewusst klein halten; kein Kanban-Board im MVP.

## 11. Analytics Settings im Admin

Eigene Sub-Sektion in `AdminSettings` oder Tab in der neuen Analytics-Seite (empfohlen: **dort**, weil thematisch näher). Felder = Spalten aus `analytics_settings`. Defaults wie vorgeschlagen, mit zwei Ausnahmen:

- `track_section_views`: **false** im MVP (rauscht, viele Events).
- `retention_days`: 180 ist ok; UI-Tooltip „älter wird automatisch gelöscht“.

Wenn `analytics_enabled=false`: Client-Hook sendet sofort nichts, Function lehnt ab. Ein Banner im Admin („Analytics ist deaktiviert“) wird angezeigt.

## 12. Datenschutz-Update (To-do, keine Rechtsberatung)

In `Datenschutz.tsx` neuen Abschnitt „Eigene Website-Analyse (First-Party Analytics)“ ergänzen:

- Welche Events, welche Felder, was **nicht** gespeichert wird.
- Keine Cookies, kein Cross-Site-Tracking, keine Drittanbieter.
- Visitor-Hash (täglich rotierender Salt), keine Roh-IP.
- Zwecke: Reichweitenmessung, Conversion-Optimierung, technische Verbesserung.
- Rechtsgrundlage (typisch berechtigtes Interesse) – **Hinweis im Plan**: anwaltlich prüfen lassen.
- Aufbewahrung: 180 Tage Events, Aggregate länger.
- Widerspruch: Browser-DNT wird respektiert; optionaler Opt-out-Link kann später ergänzt werden.

## 13. Priorisierte Roadmap

| Phase | Inhalt | Aufwand | Risiko | Nutzen | DB | Edge | Admin UI | Datenschutz |
|---|---|---|---|---|---|---|---|---|
| A – MVP | page_view, cta_click, pricing_cta_click, contact_*, external_link, KPI-Übersicht, Traffic-, Geräte-Tabellen, Funnel, Settings | M | niedrig | hoch | 3 Tabellen | 1 Function | neue Seite + 4 KPIs im Dashboard | Datenschutz-Abschnitt ergänzen |
| B – Insights | section_view, faq_open, portfolio_interaction, theme_change, Content-Tab | S | niedrig | mittel | – | Allowlist erweitern | neuer Tab | klein |
| C – Mini-CRM | Lead UTM, Notes, Follow-up, Status-History | M | mittel | mittel | `contact_leads` + neue Tabelle + Trigger | – | Lead-Drawer | klein |
| D – Reports | Monatsreport, CSV-Export, Vergleichszeitraum, Empfehlungen | M-L | mittel | mittel | optional `analytics_daily` + Cron | optional Cron | Reports-Tab | – |

## 14. MVP-Umfang (Phase A, konkret)

1. Migration: `analytics_events`, `analytics_settings` (+ Defaults-Insert). `analytics_daily` **nicht** im MVP. GRANTs + RLS wie §5.
2. Edge Function `track-analytics-event` mit Zod-Validierung, Salt-basiertem Hash, Bot-Filter, Rate-Limit.
3. Client: kleiner Hook `useTrack()` + `<AnalyticsProvider>` der DNT/Settings respektiert; Instrumentierung von `Hero`-CTA, `StickyMobileCta`, `Pricing`-CTAs, `Contact` (view/start/success/error), WhatsApp/Calendly-Links, `page_view` in `Landing`.
4. Admin: neue Route `/admin/analytics` mit Übersicht, Traffic, Geräte, Funnel, Settings. 4 KPI-Cards zusätzlich oben im bestehenden `AdminDashboard`.
5. Datenschutz-Abschnitt ergänzen + To-do-Hinweis im Admin-Dashboard-Checklist.

## 15. Was bewusst NICHT gebaut wird

- Kein Google Analytics, Meta Pixel, Plausible, Matomo, PostHog Cloud, Hotjar, Clarity.
- Keine Heatmaps, kein Session Recording, keine Mausbewegungen, kein Scroll-Pixel.
- Kein Fingerprinting (Canvas/Fonts/WebGL).
- Keine Tracking-Cookies, kein persistenter Visitor-Identifier im Client.
- Kein öffentlicher Besucherzähler auf der Website.
- Kein BI-Builder, keine Custom-Query-UI, kein Drag-&-Drop-Dashboard.
- Keine personenbezogenen Felder in Events.

## 16. Risiken & Gegenmaßnahmen

- **Unterzählung** ohne Cookies → ehrlich kommunizieren („Näherungswerte“), Funnel als Trend.
- **Bot-Traffic** verzerrt KPIs → UA-Allowlist + Rate-Limit; Toggle `bot_filter_enabled`.
- **Tabellenwachstum** → Retention-Job; ab Phase D Aggregat-Tabelle.
- **Edge-Function-Latenz** → fire-and-forget `navigator.sendBeacon`/`keepalive: true`, Events nie blockierend.
- **Datenschutz** → klare Allowlist, Code-Review vor Go-Live, juristische Prüfung als To-do.
- **Admin-Komplexität** → nur 1 neue Route + 4 KPIs im Dashboard; keine BI-Suite.

## 17. Empfehlung für ersten Sprint

**Phase A: Analytics MVP** umsetzen (Migration + Edge Function + Client-Hook + neue Admin-Seite + Datenschutz-Ergänzung).

Soll ich mit **Phase A: Analytics MVP** starten?
