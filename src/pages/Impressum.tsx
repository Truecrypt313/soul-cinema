import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { useSettings, setting } from '@/hooks/useCms'

export default function Impressum() {
  const s = useSettings()
  const email = setting<string>(s, 'contact_email', '')
  const phone = setting<string>(s, 'contact_phone', '')

  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <Seo
        title="Impressum — Soul Cinema"
        description="Anbieterkennzeichnung von Soul Cinema gemäß § 5 DDG: Verantwortlicher, Kontakt und rechtliche Hinweise."
        path="/impressum"
      />
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück zur Startseite</Link>
        <h1 className="text-4xl sm:text-5xl font-black mt-6 mb-10">Impressum</h1>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">Angaben gemäß § 5 DDG</h2>
            <p>
              Ahmed Dib<br />
              Auf dem Dudel 26<br />
              32049 Herford<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">Kontakt</h2>
            <p>
              {email ? (
                <>E-Mail: <a href={`mailto:${email}`} className="underline">{email}</a></>
              ) : (
                <span className="italic">E-Mail: Kontakt-E-Mail ergänzen (siehe Admin-Einstellungen).</span>
              )}
              {phone && (<><br />Telefon: {phone}</>)}
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              Ahmed Dib<br />
              Auf dem Dudel 26<br />
              32049 Herford<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline">
                https://ec.europa.eu/consumers/odr/
              </a>. Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">Haftung für Inhalte</h2>
            <p>
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden derartige Links umgehend entfernt.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-3">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet, soweit nicht anders angegeben.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
