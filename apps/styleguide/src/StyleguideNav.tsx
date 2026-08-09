export const grammarSections = [
  { id: 'material-heading', label: 'Material', group: 'Foundations' },
  { id: 'typography-heading', label: 'Typography', group: 'Foundations' },
  { id: 'color-heading', label: 'Color', group: 'Foundations' },
  { id: 'spacing-heading', label: 'Spacing', group: 'Foundations' },
  { id: 'layout-heading', label: 'Layout', group: 'Foundations' },
  { id: 'icons-heading', label: 'Icons', group: 'Foundations' },
  { id: 'buttons-heading', label: 'Buttons', group: 'Controls' },
  { id: 'forms-heading', label: 'Forms', group: 'Controls' },
  { id: 'badges-heading', label: 'Badges', group: 'Controls' },
  { id: 'cards-heading', label: 'Cards', group: 'Structures' },
  { id: 'tables-heading', label: 'Tables', group: 'Structures' },
  { id: 'lists-heading', label: 'Lists', group: 'Structures' },
  { id: 'feedback-heading', label: 'Feedback', group: 'Structures' },
  { id: 'composition-heading', label: 'Composition', group: 'Structures' },
] as const

const groups = ['Foundations', 'Controls', 'Structures'] as const

export function StyleguideNav() {
  return (
    <nav aria-label="Styleguide sections" className="grammar-section-nav">
      <div className="grammar-section-nav-summary">
        <span>Index</span>
        <strong>{grammarSections.length} sections</strong>
      </div>
      {groups.map((group) => (
        <div className="grammar-section-nav-group" key={group}>
          <span>{group}</span>
          <div>
            {grammarSections
              .filter((section) => section.group === group)
              .map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  {section.label}
                </a>
              ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
