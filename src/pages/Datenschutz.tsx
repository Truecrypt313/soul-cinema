import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { useSettings, setting } from '@/hooks/useCms'

export default function Datenschutz() {
  const s = useSettings()
  const email = setting<string>(s, 'contact_email', '')
  const whatsapp = setting<string>(s, 'whatsapp_number', '')
  const calendly = setting<string>(s, 'calendly_url', '')

  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <Seo
        title="Datenschutzerklärung — Soul Cinema"
        description="Datenschutzerklärung von Soul Cinema nach DSGVO: Verantwortlicher, Verarbeitungen, Hosting, Kontaktformular und Rechte der Betroffenen."
        path="/datenschutz"
      />
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück zur Startseite</Link>
        <h1 className="text-4xl sm:text-5xl font-black mt-6 mb-10">Datenschutzerklärung</h1>

        <div className="space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">1. Datenschutz auf einen Blick</h2>

            <h3 className="text-foreground text-lg font-semibold mb-2">Allgemeine Hinweise</h3>
            <p className="mb-4">Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Datenerfassung auf dieser Website</h3>
            <p className="mb-2"><strong className="text-foreground">Wer ist verantwortlich?</strong> Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Die Kontaktdaten finden Sie unter Punkt 2 dieser Erklärung.</p>
            <p className="mb-2"><strong className="text-foreground">Wie erfassen wir Ihre Daten?</strong> Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. über das Kontaktformular oder per E-Mail). Andere Daten werden beim Besuch der Website automatisch durch unsere IT-Systeme erfasst (z. B. IP-Adresse, Browser, Zeitpunkt des Aufrufs).</p>
            <p className="mb-2"><strong className="text-foreground">Wofür nutzen wir Ihre Daten?</strong> Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten dienen der Bearbeitung Ihrer Anfrage.</p>
            <p><strong className="text-foreground">Welche Rechte haben Sie?</strong> Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Außerdem haben Sie ein Recht auf Berichtigung oder Löschung dieser Daten sowie weitere Rechte (siehe Punkt 3).</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">2. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
              Ahmed Dib<br />
              Auf dem Dudel 26<br />
              32049 Herford<br />
              Deutschland<br />
              {email ? <>E-Mail: <a href={`mailto:${email}`} className="underline">{email}</a></> : <span className="italic">E-Mail: bitte in den Admin-Einstellungen ergänzen.</span>}
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>

            <h3 className="text-foreground text-lg font-semibold mb-2">Datenschutz</h3>
            <p className="mb-4">Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und behandeln diese vertraulich sowie entsprechend den gesetzlichen Datenschutzvorschriften und dieser Datenschutzerklärung.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Speicherdauer</h3>
            <p className="mb-4">Soweit keine speziellere Speicherdauer in dieser Erklärung genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck der Datenverarbeitung entfällt. Gesetzliche Aufbewahrungsfristen bleiben unberührt.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Rechtsgrundlagen der Datenverarbeitung</h3>
            <p className="mb-4">Sofern Sie in die Datenverarbeitung eingewilligt haben, erfolgt diese auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO. Bei der Verarbeitung zur Erfüllung eines Vertrags oder zur Durchführung vorvertraglicher Maßnahmen dient Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage. Soweit die Verarbeitung zur Wahrung berechtigter Interessen erforderlich ist, erfolgt sie auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Zur Erfüllung rechtlicher Pflichten stützen wir uns auf Art. 6 Abs. 1 lit. c DSGVO.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Empfänger personenbezogener Daten</h3>
            <p className="mb-4">Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen Dienstleistern zusammen (z. B. Hosting, Datenbank). Eine Übermittlung erfolgt nur, soweit dies zur Vertragserfüllung, aufgrund einer Einwilligung oder einer rechtlichen Verpflichtung erforderlich ist. Mit Auftragsverarbeitern haben wir, soweit erforderlich, entsprechende Verträge gemäß Art. 28 DSGVO geschlossen.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Widerruf der Einwilligung</h3>
            <p className="mb-4">Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt unberührt.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Widerspruchsrecht (Art. 21 DSGVO)</h3>
            <p className="mb-4">Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen, die auf Art. 6 Abs. 1 lit. e oder f DSGVO beruht.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Beschwerderecht bei der Aufsichtsbehörde</h3>
            <p className="mb-4">Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde zu, insbesondere im Mitgliedstaat ihres gewöhnlichen Aufenthaltsorts oder des Ortes des mutmaßlichen Verstoßes.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Recht auf Datenübertragbarkeit</h3>
            <p className="mb-4">Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Auskunft, Berichtigung und Löschung</h3>
            <p className="mb-4">Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">Einschränkung der Verarbeitung</h3>
            <p className="mb-4">Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</p>

            <h3 className="text-foreground text-lg font-semibold mb-2">SSL- bzw. TLS-Verschlüsselung</h3>
            <p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an „https://" in der Adresszeile Ihres Browsers.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">4. Hosting und Bereitstellung der Website</h2>
            <p className="mb-3">Diese Website wird bei einem externen Dienstleister gehostet. Beim Aufruf der Website werden technisch erforderliche Daten in sogenannten Server-Logfiles verarbeitet, die Ihr Browser automatisch übermittelt:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Browsertyp und Browserversion</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referrer-URL</li>
              <li>Angefragte Seiten und übertragene Datenmenge</li>
            </ul>
            <p className="mb-3">Die Verarbeitung erfolgt zur sicheren und stabilen Bereitstellung sowie zur Gewährleistung der IT-Sicherheit. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>
            <p>Mit dem Hosting-Anbieter besteht, soweit erforderlich, ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">5. Datenbank- und Backend-Dienst (Supabase)</h2>
            <p className="mb-3">Zur Speicherung von Kontaktanfragen, zur Verwaltung von Website-Inhalten sowie für die Authentifizierung des Adminbereichs setzen wir den Dienst Supabase ein. Anbieter ist Supabase, Inc.</p>
            <p className="mb-3">Verarbeitet werden – je nach Eingabe – insbesondere folgende Daten:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer, sofern angegeben</li>
              <li>Unternehmen, sofern angegeben</li>
              <li>Projektbeschreibung und Produktlink</li>
              <li>Status der Anfrage und interne Notizen</li>
              <li>Login-Daten für berechtigte Administratoren</li>
            </ul>
            <p className="mb-3">Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche bzw. vertragliche Kommunikation), Art. 6 Abs. 1 lit. f DSGVO (sichere Verwaltung und IT-Sicherheit) sowie ggf. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
            <p>Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">6. Kontaktformular</h2>
            <p className="mb-3">Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO). Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
            <p className="mb-3">Zusätzlich zu Ihren Eingaben werden bei einer Kontaktanfrage technische Kontextdaten zur Anfrage gespeichert, sofern verfügbar:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Quelle der Anfrage und Referrer-Domain (z. B. über welche Website Sie zu uns gelangt sind)</li>
              <li>Kampagnenparameter aus der URL (UTM-Source, -Medium, -Campaign, -Content, -Term)</li>
              <li>Aufgerufene Landingpage sowie die Seite, auf der das Formular abgesendet wurde</li>
              <li>Grobe Geräteklasse (Mobile, Desktop, Tablet)</li>
              <li>Ggf. das von Ihnen zuvor ausgewählte Preispaket („Paketinteresse")</li>
            </ul>
            <p className="mb-3">Zwecke: Bearbeitung Ihrer Anfrage, Zuordnung zu Werbekampagnen und Verbesserung von Website und Angeboten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. f DSGVO.</p>
            <p className="mb-3"><strong className="text-foreground">Wichtige Abgrenzung zur Reichweitenmessung (Punkt 10):</strong> Die zur Kontaktanfrage gespeicherten Kontextdaten werden nicht mit den anonymen Analytics-Besucher-Hashes verknüpft. Es wird keine Roh-IP-Adresse im Lead-Datensatz gespeichert. Es werden keine personenbezogenen Analytics-Profile erstellt. Inhalte des Kontaktformulars (Name, E-Mail, Telefon, Nachricht usw.) werden ausdrücklich nicht in Analytics-Ereignissen gespeichert.</p>
            <p className="mb-3">Zur internen Bearbeitung können Administratoren zu jeder Anfrage einen Status, ein Wiedervorlage-Datum, eine Priorität sowie interne Notizen vergeben. Diese internen Felder werden ausschließlich im Adminbereich angezeigt und nicht auf der Website veröffentlicht.</p>
            <p className="text-sm italic">Hinweis: Diese Darstellung gibt den aktuell technisch umgesetzten Stand wieder und ersetzt keine rechtliche Beratung.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">7. Kontakt per E-Mail</h2>
            <p>Wenn Sie uns per E-Mail kontaktieren, werden Ihre E-Mail-Adresse, der Inhalt Ihrer Nachricht sowie ggf. weitere Metadaten zur Bearbeitung Ihrer Anfrage verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. f DSGVO. Die Daten werden nach Abschluss der Bearbeitung gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">8. Admin-Login</h2>
            <p>Der Adminbereich dieser Website ist ausschließlich für berechtigte Administratoren zugänglich. Beim Login werden Authentifizierungsdaten sowie technisch erforderliche Zugriffsdaten verarbeitet. Zweck ist der Schutz und die Verwaltung des Adminbereichs. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">9. Cookies und lokale Speicherung</h2>
            <p className="mb-3">Diese Website verwendet derzeit keine Tracking-Cookies und keine Analyse-Cookies.</p>
            <p>Die von Ihnen gewählte Darstellung (z. B. Dark Mode oder Light Mode) wird ausschließlich lokal in Ihrem Browser (Local Storage) gespeichert. Eine Übermittlung dieser Information an uns oder an Dritte findet nicht statt.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">10. Eigene Website-Analyse (First-Party Analytics)</h2>
            <p className="mb-3">Wir nutzen eine eigene, datensparsame Reichweitenmessung. Es kommen <strong className="text-foreground">keine Drittanbieter-Analyse-Tools</strong> (z. B. Google Analytics, Meta Pixel, Plausible, Matomo) zum Einsatz. Es werden <strong className="text-foreground">keine Cookies</strong> und kein dauerhafter Identifier in Ihrem Browser gesetzt. Lediglich eine zufällige, technisch erforderliche Sitzungs-ID kann pro Browser-Tab im flüchtigen Session-Speicher abgelegt werden; sie wird beim Schließen des Tabs gelöscht.</p>
            <p className="mb-3">Erfasst werden ausschließlich aggregierte, nicht direkt personenbezogene Ereignisse:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Seitenaufrufe (Pfad, Referrer-Domain, ggf. UTM-Parameter)</li>
              <li>Klicks auf zentrale Schaltflächen (z. B. Kontakt-CTA, Pricing-CTA, WhatsApp, Calendly)</li>
              <li>Sichtbarkeit und Nutzung des Kontaktformulars (gesehen, gestartet, gesendet, Fehler) – ohne Inhalte der Formularfelder</li>
              <li>Anonyme Section-Aufrufe (welche Abschnitte der Seite tatsächlich gelesen werden) sowie anonyme FAQ-Aufklappungen (welche Fragen geöffnet werden) – jeweils ohne Bezug zur Person</li>
              <li>Grobe Geräteklasse (Mobile/Desktop/Tablet) sowie Browser- und Betriebssystem-Familie</li>
              <li>Aktives Theme (Dark/Light)</li>
            </ul>
            <p className="mb-3">Ausdrücklich <strong className="text-foreground">nicht</strong> erfasst werden: Roh-IP-Adressen, vollständige User-Agent-Strings, Mausbewegungen, Tastatureingaben, Bildschirmaufnahmen, Heatmaps, Geräte-Fingerprints sowie der Inhalt von Formularfeldern (Name, E-Mail, Nachricht usw.). Inhalte von Kontaktanfragen werden ausschließlich im Rahmen des Kontaktformulars (Punkt 6) verarbeitet, nicht in der Analytics.</p>
            <p className="mb-3">Zur Erkennung wiederkehrender Besucher innerhalb eines Tages bildet ein serverseitiger Vorgang einen tageweise wechselnden Hashwert aus IP-Adresse und Geräteinformationen. Die IP-Adresse selbst wird dabei <strong className="text-foreground">nicht gespeichert</strong>. Eine Re-Identifizierung über den Tageswechsel hinaus ist dadurch ausgeschlossen.</p>
            <p className="mb-3">Zwecke: Reichweitenmessung, Optimierung der Conversion-Strecke, technische und gestalterische Verbesserung der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer datensparsamen Erfolgsmessung und Verbesserung des Angebots). Die Browser-Einstellung „Do Not Track" (DNT) wird respektiert; ist sie aktiv, werden keine Analytics-Ereignisse an uns übermittelt.</p>
            <p className="mb-3">Speicherdauer: Einzelne Ereignisse werden standardmäßig nach <strong className="text-foreground">180 Tagen</strong> gelöscht; aggregierte Kennzahlen ohne Personenbezug können darüber hinaus aufbewahrt werden.</p>
            <p className="text-sm italic">Hinweis: Diese Darstellung gibt den aktuell technisch umgesetzten Stand wieder und ersetzt keine rechtliche Beratung. Vor produktivem Einsatz sollte sie individuell juristisch geprüft werden.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">11. Externe Links und Drittanbieter</h2>
            <p>Diese Website kann Links zu externen Diensten und Plattformen enthalten. Eine Datenübermittlung an die jeweiligen Anbieter findet erst dann statt, wenn Sie aktiv auf einen entsprechenden Link klicken. Für die Datenverarbeitung durch die jeweiligen Anbieter gelten deren eigene Datenschutzbestimmungen.</p>
          </section>

          {whatsapp && (
            <section>
              <h2 className="text-foreground text-2xl font-bold mb-4">12. WhatsApp</h2>
              <p>Auf dieser Website wird optional ein Link zur Kontaktaufnahme über WhatsApp angeboten. Wenn Sie diesen Link nutzen, verarbeitet der Anbieter WhatsApp Ireland Ltd. personenbezogene Daten gemäß seinen eigenen Datenschutzbestimmungen. Die Nutzung ist freiwillig; alternativ können Sie uns jederzeit per E-Mail oder Kontaktformular erreichen.</p>
            </section>
          )}

          {calendly && (
            <section>
              <h2 className="text-foreground text-2xl font-bold mb-4">{whatsapp ? '13' : '12'}. Calendly</h2>
              <p>Für die Terminvereinbarung verlinken wir auf den Dienst Calendly (Calendly LLC). Beim Aufruf des Calendly-Links werden Sie auf die Seiten von Calendly weitergeleitet. Im Rahmen einer Terminbuchung verarbeitet Calendly die von Ihnen angegebenen Daten (z. B. Name, E-Mail-Adresse, Terminwunsch). Es gelten die Datenschutzbestimmungen von Calendly.</p>
            </section>
          )}

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">{[true, whatsapp, calendly].filter(Boolean).length + 11}. Eingebettete Medien</h2>
            <p>Videos und Medieninhalte auf dieser Website werden über direkte Mediendateien bereitgestellt. Eine Einbindung externer Video-Plattformen (z. B. YouTube, Vimeo) findet nicht statt.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">{[true, whatsapp, calendly].filter(Boolean).length + 12}. Keine automatisierte Entscheidungsfindung</h2>
            <p>Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne des Art. 22 DSGVO findet nicht statt.</p>
          </section>

          <section>
            <h2 className="text-foreground text-2xl font-bold mb-4">{[true, whatsapp, calendly].filter(Boolean).length + 13}. Aktualität und Änderung dieser Datenschutzerklärung</h2>
            <p>Diese Datenschutzerklärung kann angepasst werden, wenn sich die rechtlichen Rahmenbedingungen oder die Inhalte bzw. Dienste der Website ändern. Die jeweils aktuelle Fassung kann jederzeit auf dieser Seite eingesehen werden.</p>
          </section>

        </div>
      </div>
    </main>
  )
}
