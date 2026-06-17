import { Link } from 'react-router-dom'

export default function Datenschutz() {
  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
        <h1 className="text-4xl sm:text-5xl font-black mt-6 mb-8">Datenschutzerklärung</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">1. Verantwortliche Stelle</h2>
            <p>
              Soul Cinema, [Adresse ergänzen], E-Mail: <a href="mailto:hallo@soulcinema.de" className="underline">hallo@soulcinema.de</a>.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">2. Kontaktformular</h2>
            <p>
              Wenn Sie das Kontaktformular nutzen, verarbeiten wir Ihre Angaben (Name, E-Mail, ggf. Unternehmen, Telefon, Produktlink, Produkttyp, Ziel, Budget, Nachricht) zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und f DSGVO. Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">3. Hosting und Datenbank</h2>
            <p>
              Diese Website wird über einen Hosting-Dienstleister bereitgestellt. Angaben aus dem Kontaktformular werden in einer verschlüsselten Datenbank gespeichert.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">4. Google Fonts</h2>
            <p>
              Diese Website lädt Schriften von Google Fonts. Dabei wird Ihre IP-Adresse an Google übertragen. Wenn Sie dies nicht möchten, deaktivieren Sie bitte JavaScript bzw. nutzen Sie geeignete Browser-Einstellungen. [Optional: Schriften lokal hosten – noch zu prüfen.]
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">5. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Bitte wenden Sie sich an <a href="mailto:hallo@soulcinema.de" className="underline">hallo@soulcinema.de</a>.
            </p>
          </section>
          <section>
            <h2 className="text-foreground text-xl font-bold mb-2">6. Cookies</h2>
            <p>
              Diese Website nutzt aktuell keine Tracking-Cookies. Es werden ausschließlich technisch notwendige Daten verarbeitet.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
