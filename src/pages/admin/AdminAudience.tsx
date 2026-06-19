import { EntityCrud } from './_EntityCrud'
export default function AdminAudience() {
  return <EntityCrud
    table="audience_items" title="Zielgruppen"
    intro={'Tags im Bereich „Für wen ist Soul Cinema geeignet?".'}
    emptyHint="Noch keine Zielgruppen. Benenne 3–6 Branchen oder Produktarten, für die Soul Cinema arbeitet."
    addLabel="Erste Zielgruppe anlegen"
    defaults={{ icon_name: 'ShoppingCart', title: '', description: '' }}
    fields={[
      { key: 'icon_name', label: 'Icon', type: 'icon' },
      { key: 'title', label: 'Titel' },
      { key: 'description', label: 'Beschreibung (optional)', type: 'textarea' },
    ]} />
}
