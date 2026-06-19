import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { useSettings, setting } from '@/hooks/useCms'

export default function AGB() {
  const s = useSettings()
  const email = setting<string>(s, 'contact_email', '')

  const Section = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
    <section>
      <h2 className="text-foreground text-xl font-bold mb-3">{n}. {title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )

  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <Seo
        title="AGB — Soul Cinema"
        description="Allgemeine Geschäftsbedingungen von Soul Cinema für Produktvideos, Werbevideos, Social Ads und Creative-Produktion."
        path="/agb"
      />
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück zur Startseite</Link>
        <h1 className="text-4xl sm:text-5xl font-black mt-6 mb-4">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-sm text-muted-foreground mb-10">Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</p>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <Section n={1} title="Geltungsbereich">
            <p>Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für sämtliche Verträge über die Erbringung von Leistungen durch Soul Cinema, Inhaber Ahmed Dib (nachfolgend „Soul Cinema"), gegenüber Kunden. Sie gelten gegenüber Unternehmern und Verbrauchern, soweit jeweils zutreffend.</p>
            <p>Abweichende, entgegenstehende oder ergänzende Geschäftsbedingungen des Kunden werden nur dann und insoweit Vertragsbestandteil, als Soul Cinema ihrer Geltung ausdrücklich schriftlich zugestimmt hat.</p>
          </Section>

          <Section n={2} title="Vertragspartner">
            <p>
              Vertragspartner ist:<br />
              Ahmed Dib<br />
              Auf dem Dudel 26<br />
              32049 Herford<br />
              Deutschland
            </p>
            <p>
              {email ? <>Kontakt: <a href={`mailto:${email}`} className="underline">{email}</a></> : <span className="italic">Kontakt-E-Mail: bitte in den Admin-Einstellungen ergänzen.</span>}
            </p>
          </Section>

          <Section n={3} title="Leistungen von Soul Cinema">
            <p>Soul Cinema erbringt kreative Dienstleistungen, insbesondere Konzeption, Gestaltung, Produktion und Bearbeitung von Produktvideos, Werbevideos, Social Ads, Launch Creatives, E-Commerce Reels sowie SaaS- und App-Videos.</p>
            <p>Der konkrete Leistungsumfang, die Anzahl der Ergebnisse, Formate, Varianten und Korrekturschleifen ergeben sich aus dem jeweiligen Angebot, der Projektbeschreibung oder einer individuellen Vereinbarung.</p>
          </Section>

          <Section n={4} title="Vertragsschluss">
            <p>Anfragen über das Kontaktformular, per E-Mail oder über andere Kontaktwege sind unverbindlich. Ein Vertrag kommt erst durch die Annahme eines Angebots durch den Kunden zustande.</p>
            <p>Die Annahme kann schriftlich, per E-Mail oder durch ausdrückliche Bestätigung in Textform erfolgen.</p>
          </Section>

          <Section n={5} title="Mitwirkungspflichten des Kunden">
            <p>Der Kunde stellt Soul Cinema rechtzeitig alle für die Leistungserbringung erforderlichen Informationen, Materialien, Produktbilder, Logos, Texte, Links und Freigaben in geeigneter Qualität bereit.</p>
            <p>Der Kunde sichert zu, dass er sämtliche bereitgestellten Materialien rechtmäßig verwenden und an Soul Cinema im vereinbarten Umfang weitergeben darf.</p>
            <p>Verzögerungen aufgrund fehlender oder verspäteter Mitwirkung des Kunden können vereinbarte Termine entsprechend verschieben.</p>
          </Section>

          <Section n={6} title="Projektablauf">
            <p>Der Projektablauf umfasst in der Regel folgende Phasen:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Anfrage und Briefing</li>
              <li>Konzept und Abstimmung</li>
              <li>Produktion und Bearbeitung</li>
              <li>Vereinbarte Korrekturrunde(n)</li>
              <li>Lieferung der finalen Dateien</li>
            </ul>
          </Section>

          <Section n={7} title="Korrekturschleifen und Änderungswünsche">
            <p>Die Anzahl der im Preis enthaltenen Korrekturschleifen richtet sich nach dem jeweiligen Angebot bzw. Paket.</p>
            <p>Darüber hinausgehende Änderungswünsche sowie Änderungen nach finaler Freigabe können gesondert nach Aufwand berechnet werden.</p>
          </Section>

          <Section n={8} title="Vergütung und Zahlungsbedingungen">
            <p>Die Preise ergeben sich aus dem jeweiligen Angebot oder der Paketbeschreibung. Soweit nicht ausdrücklich anders ausgewiesen, handelt es sich um Einstiegspreise. Der finale Preis richtet sich nach dem tatsächlichen Umfang, der Materiallage sowie den gewünschten Varianten und Formaten.</p>
            <p>Soweit nicht anders vereinbart, sind Rechnungen innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug zur Zahlung fällig.</p>
            <p>Bei größeren Projekten ist Soul Cinema berechtigt, eine angemessene Anzahlung zu verlangen.</p>
          </Section>

          <Section n={9} title="Nutzungsrechte">
            <p>Mit vollständiger Zahlung der vereinbarten Vergütung erhält der Kunde die im Angebot vereinbarten Nutzungsrechte an den final gelieferten Videos. Der Umfang dieser Nutzungsrechte richtet sich nach der jeweiligen Vereinbarung.</p>
            <p>Rohdaten, Projektdateien, Konzepte, Entwürfe sowie sonstige Arbeitsdateien sind nur dann geschuldet, wenn dies ausdrücklich vereinbart wurde. Soul Cinema ist berechtigt, Entwürfe und Vorstufen zurückzuhalten, soweit nichts anderes vereinbart ist.</p>
            <p>Eine Nutzung der Ergebnisse als Referenz durch Soul Cinema (z. B. im Portfolio oder in Social Media) erfolgt nur mit Zustimmung des Kunden oder soweit dies im Angebot vereinbart wurde.</p>
          </Section>

          <Section n={10} title="Rechte an bereitgestellten Materialien">
            <p>Der Kunde versichert, dass er über sämtliche erforderlichen Rechte an den von ihm bereitgestellten Bildern, Logos, Marken, Texten, Musik, Produktdaten und sonstigen Materialien verfügt.</p>
            <p>Der Kunde stellt Soul Cinema von Ansprüchen Dritter frei, soweit diese auf vom Kunden bereitgestellten Materialien beruhen.</p>
          </Section>

          <Section n={11} title="Lieferung und Termine">
            <p>Termine sind nur dann verbindlich, wenn sie von Soul Cinema ausdrücklich als verbindlich bestätigt wurden.</p>
            <p>Verzögerungen aufgrund fehlender Materialien, verspäteten Feedbacks oder zusätzlicher Änderungswünsche verlängern die Fristen angemessen.</p>
            <p>Die Lieferung erfolgt digital, beispielsweise per Download-Link, Cloud-Link oder per E-Mail.</p>
          </Section>

          <Section n={12} title="Abnahme">
            <p>Der Kunde prüft die gelieferten Leistungen zeitnah nach Erhalt. Offensichtliche Mängel oder Änderungswünsche sind innerhalb einer angemessenen Frist mitzuteilen.</p>
            <p>Erfolgt nach Lieferung keine Rückmeldung und nutzt der Kunde die Leistung, gilt diese als abgenommen, soweit dies rechtlich zulässig ist.</p>
          </Section>

          <Section n={13} title="Stornierung und Kündigung">
            <p>Der Kunde kann ein Projekt vor Fertigstellung stornieren. Bereits erbrachte Leistungen sowie entstandene Aufwände werden in diesem Fall in Rechnung gestellt.</p>
            <p>Bei kurzfristiger Stornierung nach Beginn der Produktion können anteilige Kosten anfallen. Details ergeben sich aus dem jeweiligen Angebot bzw. der Vereinbarung.</p>
          </Section>

          <Section n={14} title="Gewährleistung">
            <p>Es gelten die gesetzlichen Gewährleistungsrechte.</p>
            <p>Kreative oder geschmackliche Abweichungen stellen keinen Mangel dar, soweit sie sich innerhalb des vereinbarten Briefings bewegen. Soul Cinema erhält in jedem Fall Gelegenheit zur Nachbesserung.</p>
          </Section>

          <Section n={15} title="Haftung">
            <p>Soul Cinema haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach den Vorschriften des Produkthaftungsgesetzes. Für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit haftet Soul Cinema unbeschränkt.</p>
            <p>Bei einfacher Fahrlässigkeit haftet Soul Cinema nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). Die Haftung ist in diesem Fall auf den vertragstypischen, vorhersehbaren Schaden begrenzt.</p>
            <p>Im Übrigen ist die Haftung ausgeschlossen.</p>
          </Section>

          <Section n={16} title="Drittanbieter und Plattformen">
            <p>Soweit Leistungen für Plattformen wie Meta, TikTok, YouTube, Shopify, Amazon oder vergleichbare Anbieter erstellt werden, übernimmt Soul Cinema keine Garantie für die Freigabe, Reichweite oder Werbewirkung durch diese Plattformen.</p>
            <p>Die Einhaltung plattformspezifischer Vorgaben obliegt dem Kunden, soweit nichts anderes ausdrücklich vereinbart ist.</p>
          </Section>

          <Section n={17} title="Keine Erfolgsgarantie">
            <p>Soul Cinema schuldet eine fachgerechte kreative Dienstleistung, jedoch keinen bestimmten Werbeerfolg, Umsatz, ROAS, Reichweite, Conversion-Wert oder ähnliche Kennzahlen.</p>
            <p>Aussagen zu Strategie und Wirkung sind fachliche Einschätzungen und stellen keine zugesicherten Eigenschaften oder Erfolgsgarantien dar.</p>
          </Section>

          <Section n={18} title="Datenschutz">
            <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <Link to="/datenschutz" className="underline">Datenschutzerklärung</Link>.</p>
          </Section>

          <Section n={19} title="Schlussbestimmungen">
            <p>Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gegenüber Verbrauchern gilt diese Rechtswahl nur insoweit, als hierdurch der durch zwingende Bestimmungen des Rechts des Staates ihres gewöhnlichen Aufenthalts gewährte Schutz nicht entzogen wird.</p>
            <p>Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz von Soul Cinema.</p>
            <p>Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
          </Section>
        </div>
      </div>
    </main>
  )
}
