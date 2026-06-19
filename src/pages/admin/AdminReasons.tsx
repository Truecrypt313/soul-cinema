import { EntityCrud } from './_EntityCrud'
export default function AdminReasons() {
  return <EntityCrud
    table="reasons" title="Warum Soul Cinema"
    intro={'Vorteils-Karten im Bereich „Warum Soul Cinema".'}
    emptyHint="Noch keine Vorteile angelegt. 3–6 klare Gründe helfen, sich vom Wettbewerb abzuheben."
    addLabel="Ersten Vorteil anlegen"
    defaults={{ icon_name: 'Sparkles', title: '', description: '' }}
    fields={[
      { key: 'icon_name', label: 'Icon', type: 'icon' },
      { key: 'title', label: 'Titel' },
      { key: 'description', label: 'Beschreibung', type: 'textarea' },
    ]} />
}
