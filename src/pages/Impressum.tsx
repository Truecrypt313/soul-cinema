import { Link } from 'react-router-dom'

export default function Impressum() {
  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
        <h1 className="text-4xl sm:text-5xl font-black mt-6 mb-8">Impressum</h1>
        <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-foreground text-xl font-bold">Angaben gemäß § 5 TMG</h2>
          <p>
            Soul Cinema<br />
            [Adresse ergänzen]<br />
            Deutschland
          </p>
          <h2 className="text-foreground text-xl font-bold">Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:hallo@soulcinema.de" className="underline">hallo@soulcinema.de</a><br />
            Telefon: [Telefon ergänzen]<br />
            Website: <a href="https://www.soulcinema.de" className="underline">www.soulcinema.de</a>
          </p>
          <h2 className="text-foreground text-xl font-bold">Vertreten durch</h2>
          <p>[Vertretungsberechtigte Person ergänzen]</p>
          <h2 className="text-foreground text-xl font-bold">Umsatzsteuer-ID</h2>
          <p>[USt-ID ergänzen, falls vorhanden]</p>
          <h2 className="text-foreground text-xl font-bold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>[Vertretungsberechtigte Person ergänzen], Anschrift wie oben.</p>
          <h2 className="text-foreground text-xl font-bold">Haftungsausschluss</h2>
          <p>
            Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>
        </div>
      </div>
    </main>
  )
}
