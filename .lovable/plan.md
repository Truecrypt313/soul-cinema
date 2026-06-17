# Soul Cinema – Vollständiger Umbau

Ich überarbeite das bestehende MOJJU-Template komplett zu **Soul Cinema** – auf Deutsch, mit echtem Backend, Adminbereich und Lead-Erfassung. Das cinematische Design (Hero-Video, dunkler Look, große Typografie, Animationen, Glass-Effekte) bleibt erhalten.

## 1. Branding & Inhalte (alle Sections)
- **index.html**: `lang="de"`, neue Title/Meta/OG/Twitter-Tags, Canonical auf `soulcinema.de`, Author „Soul Cinema".
- **Navigation**: Logo „Soul Cinema", Links: Arbeiten / Prozess / Leistungen / Anfrage. „Team" raus, CTA „Projekt anfragen".
- **Hero**: Video bleibt, neue deutsche Badge/Headline/Subline/Bullets, „Ton aktivieren" statt „Sound On", neuer Bottom-Title.
- **Portfolio**: Hampton-Iframe raus, 3 Fallback-Cards (Product Ad / Digital Product Reel / E-Commerce Creative). Lädt aus `portfolio_items` falls vorhanden, sonst Fallback.
- **Awards → „Warum Soul Cinema?"**: 4 Vorteils-Cards (Schneller Start, Kosteneffizient, Social-Media-Fokus, Für viele Produktarten). Bestehendes Layout/Styling der Awards-Komponente wird wiederverwendet.
- **About/Prozess**: 5 deutsche Schritte (Anfrage → Analyse → Konzept → Produktion → Lieferung), „flexibler Projektablauf" statt „5-7 Days".
- **Services**: 6 deutsche Cards (Produktvideos, Social-Media-Ads, E-Commerce, SaaS & App, Launch, Content Packages).
- **Team → „Für wen ist Soul Cinema geeignet?"**: Wanted-Outlaws raus, professionelle Tag-Cloud (E-Commerce Shops, Physische Produkte, Digitale Produkte, SaaS & Apps, Produktlaunches, Social Ads, Marken & Startups). Layout/Animationen werden beibehalten und neutralisiert.
- **Contact**: Echtes Formular mit allen geforderten Feldern, Zod-Validierung, deutsche Texte, sichtbare `hallo@soulcinema.de`.
- **Footer**: Soul Cinema Branding, deutscher Beschreibungstext, Kontaktdaten, Social-Links leer (admin-editierbar), MOJJU-Tools-Liste raus.

## 2. Backend (Lovable Cloud)
Lovable Cloud aktivieren (Supabase). Migration mit folgenden Tabellen + RLS + GRANTs:

- **`contact_leads`** – alle Formularfelder + `status` (default `new`), `internal_notes`, `created_at`. RLS: `anon` darf INSERT, nur Admins SELECT/UPDATE/DELETE.
- **`portfolio_items`** – Titel, Kategorie, Beschreibung, Video-URL, Thumbnail, Format-Badge, `published`, `sort_order`. RLS: public SELECT wenn `published`, Admin alles.
- **`site_settings`** – `key` + `value (jsonb)`. Speichert alle editierbaren Texte (Brand, SEO, Hero, Sections, Footer, Social-Links). RLS: public SELECT, Admin UPDATE.
- **`user_roles`** + `app_role` Enum + `has_role()` Security-Definer-Function (Standard-Muster, keine Rollen auf Profilen).

Website nutzt Hooks (`useSiteSettings`, `usePortfolioItems`) mit Fallback-Werten aus Code – funktioniert auch ohne DB-Inhalte.

**E-Mail-Benachrichtigung**: Edge Function `notify-new-lead` wird per DB-Trigger oder vom Insert-Call ausgelöst. Versand über Lovable Emails (sobald Domain konfiguriert) an `hallo@soulcinema.de`. Funktioniert auch ohne Mailversand – Lead wird in jedem Fall gespeichert.

## 3. Adminbereich `/admin`
- **Auth**: Supabase Auth (Email/Passwort). Keine offene Registrierung – Login-only.
- **Setup-Modus**: Wenn noch kein Admin existiert, zeigt `/admin` einmalig Setup-Formular; danach nur Login.
- **Geschützte Routen** via `has_role(uid, 'admin')`-Check.
- **Tabs/Seiten**:
  1. **Leads**: Tabelle mit Filter nach Status (Neu/Kontaktiert/In Gespräch/Gewonnen/Verloren), Detail-Drawer für Notizen + Status-Update, Löschen.
  2. **Inhalte**: JSON-basierter Editor für `site_settings` (gruppiert nach Bereich, einfaches Form-Mapping für die wichtigsten Felder).
  3. **Portfolio**: CRUD für `portfolio_items`, Reihenfolge, Published-Toggle, Thumbnail-Upload in Storage-Bucket `media`.

**Storage**: Bucket `media` (public) für Thumbnails/Logos. MP4-Upload via Video-URL-Feld (kein Direkt-Upload, hält Komplexität niedrig).

## 4. Rechtliche Seiten
Neue Routen `/impressum`, `/datenschutz`, `/agb` mit Platzhaltern (`[Adresse ergänzen]` etc.), Footer-Links dazu. Kein Cookie-Banner (keine Tracker aktiv). Google Fonts bleibt mit Datenschutzhinweis.

## 5. Bereinigung
Alle MOJJU-, Hampton-, Wanted-Outlaws-, US-Adress- und englischen Reste werden entfernt. Memory-Files werden aktualisiert. `src/pages/Index.tsx` (Design-System-Showcase) wird zu einer Soul-Cinema-Variante oder entfernt – Route `/` zeigt die Haupt-Landingpage.

## Technische Details
```
src/
  components/
    Navigation.tsx (neu, falls fehlend – sonst Hero-internes Nav anpassen)
    Hero.tsx, Portfolio.tsx, WhyUs.tsx (ex Awards),
    Process.tsx (ex About), Services.tsx,
    TargetAudience.tsx (ex Team), Contact.tsx, Footer.tsx
  pages/
    Index.tsx (Landingpage), Impressum.tsx, Datenschutz.tsx, AGB.tsx,
    admin/Login.tsx, admin/Setup.tsx, admin/Dashboard.tsx,
    admin/Leads.tsx, admin/Content.tsx, admin/PortfolioAdmin.tsx
  hooks/useSiteSettings.ts, useAdmin.ts, usePortfolio.ts
  integrations/supabase/ (auto)
supabase/
  migrations/<timestamp>_soulcinema.sql
  functions/notify-new-lead/index.ts
```

## Was ich am Ende prüfe
- Build läuft, keine TS-Fehler
- Keine MOJJU/Hampton/Outlaws/US-Adress-Strings mehr im Code (`rg`-Check)
- Formular speichert echten Lead in DB
- `/admin` ohne Login → Redirect zu Login
- SEO-Tags korrekt auf Soul Cinema

## Eine Rückfrage vor dem Start
**Lovable Cloud aktivieren?** Für echte Lead-Speicherung, Admin-Login, editierbare Inhalte und Portfolio-Verwaltung brauche ich das Backend. Ist kostenlos im Lovable-Plan enthalten. Falls du erst nur die Inhalts-/Design-Überarbeitung möchtest und Backend später, kann ich Teil 1 (Branding/Texte/Rechtsseiten) sofort umsetzen und Backend+Admin in einem zweiten Schritt. Sag kurz Bescheid – sonst aktiviere ich Cloud direkt und mache alles in einem Rutsch.
