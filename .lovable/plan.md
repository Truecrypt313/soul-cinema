## Problem
Im Admin-Lead-Detail wird `product_url` direkt als `href` gesetzt. Wenn der User z. B. `www.youtube.de` (ohne `https://`) einträgt, behandelt der Browser das als relativen Pfad und navigiert zu `/admin/www.youtube.de`.

## Fix (nur `src/pages/admin/AdminLeads.tsx`)
In der `Detail`-Hilfskomponente bzw. an der Stelle, an der `link` gerendert wird, die URL normalisieren:

- Wenn der Wert mit `http://` oder `https://` beginnt → unverändert nutzen.
- Wenn er mit `//` beginnt → `https:` davorsetzen.
- Wenn er mit `mailto:`, `tel:` beginnt → unverändert nutzen.
- Sonst → `https://` voranstellen.

Zusätzlich `rel="noopener noreferrer"` ergänzen. Anzeige-Text bleibt der Originalwert.

## Nicht im Scope
- Kein Redesign, keine Änderungen an Contact-Form, Portfolio, Storage, Edge Functions oder anderen Admin-Bereichen.
- Keine Validierungsänderung im Lead-Submit (eingehende Werte bleiben wie gespeichert).
