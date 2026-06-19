import { EntityCrud } from './_EntityCrud'
export default function AdminServices() {
  return <EntityCrud
    table="services" title="Leistungen"
    intro={'Leistungen, die auf der Startseite im Bereich „Leistungen" angezeigt werden.'}
    emptyHint="Noch keine Leistungen gepflegt. Lege deine Hauptangebote an — z. B. Produktvideos, Social Ads, Launch Creatives."
    addLabel="Erste Leistung anlegen"
    defaults={{ icon_name: 'Film', title: '', tagline: '', description: '' }}
    fields={[
      { key: 'icon_name', label: 'Icon', type: 'icon' },
      { key: 'title', label: 'Titel' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'description', label: 'Beschreibung', type: 'textarea' },
    ]} />
}
