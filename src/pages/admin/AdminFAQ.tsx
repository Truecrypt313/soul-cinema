import { EntityCrud } from './_EntityCrud'
export default function AdminFAQ() {
  return <EntityCrud
    table="faq_items" title="FAQ"
    intro="Häufige Fragen im FAQ-Bereich."
    emptyHint="Noch keine FAQ angelegt. Häufige Fragen helfen, Einwände vor der Anfrage zu klären."
    addLabel="FAQ hinzufügen"
    defaults={{ question: '', answer: '' }}
    previewLabel={r => r.question}
    fields={[
      { key: 'question', label: 'Frage' },
      { key: 'answer', label: 'Antwort', type: 'textarea', rows: 5 },
    ]} />
}
