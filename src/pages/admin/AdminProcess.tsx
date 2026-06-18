import { EntityCrud } from './_EntityCrud'
export default function AdminProcess() {
  return <EntityCrud
    table="process_steps" title="Prozess"
    intro="Schritte im Prozess von Anfrage bis Lieferung."
    defaults={{ step_number: '', title: '', description: '' }}
    fields={[
      { key: 'step_number', label: 'Schritt-Nummer', placeholder: 'z. B. 01' },
      { key: 'title', label: 'Titel' },
      { key: 'description', label: 'Beschreibung', type: 'textarea' },
    ]} />
}
