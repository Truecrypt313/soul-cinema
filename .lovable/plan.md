## Ist-Zustand

- `portfolio-media` ist **privat**. Admin nutzt deshalb signierte URLs (nur für Thumbnails, ein Jahr Gültigkeit) – diese landen aber nicht in der DB, gut.
- In der DB steht in `video_url` / `thumbnail_url` entweder ein Storage-Pfad (z. B. `videos/uuid.mp4`) oder eine vollständige URL.
- `Portfolio.tsx` rendert `item.video_url` **direkt** als `<video src>`. Bei Storage-Pfaden lädt der Browser also `https://soulcinema.de/videos/uuid.mp4` → 404. Das ist die Hauptursache, warum Admin-hochgeladene Videos auf der Homepage nicht laufen.
- Playback ist reines Hover-Play, kein Play-Button, kein Modal, auf Mobile nicht abspielbar.
- AdminPortfolio-Preview zeigt Video/Thumb nur bei `http(s)://`-URLs, nicht bei Storage-Pfaden.

## Ziel

Portfolio-Medien funktionieren unverändert für Storage-Pfade, externe HTTPS-URLs und spätere STRATO-URLs (absolut & `/media/...`). Videos sind auf Desktop und Mobile aktiv abspielbar. Kein Redesign, keine anderen Sektionen.

## Änderungen

### 1. Bucket `portfolio-media` öffentlich lesbar
`supabase--storage_update_bucket(name="portfolio-media", public=true)`. RLS auf `storage.objects` bleibt: Insert/Update/Delete nur für Admins (so wie bestehend). Falls Workspace public Buckets blockt → Hinweis an User, dann Fallback auf signed URLs (s. unten).

### 2. Neuer Helper `src/lib/portfolioMedia.ts`
```
getPortfolioMediaUrl(pathOrUrl): string | null
```
Regeln:
- leer → `null`
- `http(s)://...` → unverändert
- beginnt mit `/` → unverändert (deckt `/media/...` und sonstige relative Pfade ab)
- sonst (z. B. `videos/...`, `thumbs/...`, `portfolio/...`) → `supabase.storage.from('portfolio-media').getPublicUrl(path).data.publicUrl`

Nichts wird zurück in die DB geschrieben. Auflösung passiert nur zur Laufzeit.

### 3. `src/components/Portfolio.tsx`
- `resolvedVideoUrl` / `resolvedThumbnailUrl` via Helper.
- `<video>` bekommt `preload="metadata"`, `playsInline`, `muted`, `loop` für Hover-Preview (Desktop) plus sichtbaren Play-Button (Overlay-Button mittig, schon vorhanden – wird klickbar).
- Klick auf Card oder Play-Button → State `activeVideoUrl`/`activePoster` setzt → Modal öffnet.
- **Video-Modal** (neue lokale Komponente, kein neuer ui/-File nötig oder optional `src/components/PortfolioVideoModal.tsx`):
  - Fixed Overlay `bg-black/90`, zentriertes `<video controls playsInline preload="metadata" autoPlay>` mit max-Größe 90vw/85vh, Close-Button (X), ESC schließt, Klick auf Overlay schließt, `body { overflow: hidden }` während offen.
  - Soul-Cinema-Stil: subtiler Gold-Akzent am Close-Button, keine neuen Designtokens.
- `onError` am `<video>`: zeigt zentrierten Hinweis „Video konnte nicht geladen werden. Prüfe Datei, Codec oder Storage-URL."

### 4. `src/pages/admin/AdminPortfolio.tsx`
- `signedFor` ersetzen durch `getPortfolioMediaUrl` (Public-URLs, kein Cache nötig).
- Karten-Preview: Thumbnail über Helper auflösen.
- Edit-Form: Live-Preview für Thumbnail (`<img>`) und Video (`<video controls preload="metadata" playsInline>`) auch bei Storage-Pfaden, indem `getPortfolioMediaUrl(editing.video_url)` genutzt wird.
- Zwei Hinweis-Texte ergänzen:
  - „Empfohlen: MP4 mit H.264 Video-Codec und AAC Audio. iPhone-/HEVC-Videos sind nicht überall abspielbar."
  - „Portfolio-Medien sind öffentlich sichtbar. Für vertrauliche Kundendokumente später den privaten Dokumentenbereich verwenden."
- Header-Text „privater Bucket, signierte URLs" → „öffentlicher Bucket, Lese-Zugriff für Website".
- Upload-Validierung bleibt unverändert (Typen + Limits passen bereits zur Anforderung).

### 5. Nicht angefasst
Hero, Pricing, Contact, Analytics, Datenschutz, Admin-Nav, Portfolio-Copy, Theme, Auth, Mailversand, Edge Functions, andere RLS.

## Final-Check

- `npm run build` läuft (wird automatisch geprüft).
- Manuell: neues Video im Admin hochladen → Preview im Admin sichtbar → auf `/` Karte → Play-Button → Modal mit Controls → Mobile-Viewport ebenso.
- Storage-Pfad, externe HTTPS, `/media/...` und `https://soulcinema.de/media/...` werden alle korrekt aufgelöst.

## Test-Anleitung für neues Video
1. Admin → Portfolio → Neu → MP4 (H.264/AAC, ≤ 80 MB) hochladen → Thumbnail hochladen → „Veröffentlicht" → Speichern.
2. Auf `/` zur Sektion scrollen, Karte oder Play-Button antippen → Modal öffnet, Video spielt mit Controls.
3. Alternativ statt Upload eine externe URL eintragen (`https://...mp4` oder `/media/portfolio/x.mp4`) – muss genauso laufen.
