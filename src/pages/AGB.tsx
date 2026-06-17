import { Link } from 'react-router-dom'

export default function AGB() {
  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
        <h1 className="text-4xl sm:text-5xl font-black mt-6 mb-8">Allgemeine Geschäftsbedingungen</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">1. Geltungsbereich</h2>
            <p>Diese AGB gelten für alle Verträge über Videoproduktionsleistungen zwischen Soul Cinema, [Adresse ergänzen] (nachfolgend „Auftragnehmer") und dem Auftraggeber.</p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">2. Leistungen</h2>
            <p>Soul Cinema erstellt KI-gestützte Produktvideos und Performance Creatives gemäß individueller Absprache. Der konkrete Leistungsumfang ergibt sich aus dem jeweiligen Angebot.</p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">3. Mitwirkungspflichten</h2>
            <p>Der Auftraggeber stellt erforderliche Materialien (z. B. Produktbilder, Logos, Texte, Links) zeitnah und in geeigneter Qualität bereit.</p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">4. Vergütung</h2>
            <p>Es gilt die im Angebot vereinbarte Vergütung. Sofern nicht anders vereinbart, sind Rechnungen innerhalb von 14 Tagen ohne Abzug fällig.</p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">5. Nutzungsrechte</h2>
            <p>Mit vollständiger Zahlung erhält der Auftraggeber die zur vereinbarten Nutzung erforderlichen Rechte an den gelieferten Videos.</p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">6. Haftung</h2>
            <p>Soul Cinema haftet nach den gesetzlichen Bestimmungen. Für leichte Fahrlässigkeit ist die Haftung auf die typischerweise vorhersehbaren Schäden begrenzt.</p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">7. Schlussbestimmungen</h2>
            <p>Es gilt deutsches Recht. Erfüllungsort und Gerichtsstand ist – soweit gesetzlich zulässig – [Adresse ergänzen].</p>
          </section>
        </div>
      </div>
    </main>
  )
}
