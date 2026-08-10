import {
  KineticDenseTable,
  type KineticDenseTableColumn,
  type KineticMaterial,
} from '@hifi/kinetic'
import { useId, useState } from 'react'
import { StyleguideSection } from './StyleguideSection'
import { catalogClass, catalogStyles } from './stylex/catalog.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

interface ControlCatalogProps {
  readonly grammarLabel: string
  readonly hideInteractionSections?: boolean
  readonly kineticMaterial?: KineticMaterial
}

const layers = ['Surface', 'Content', 'Signal'] as const

interface ReviewRow {
  readonly bound: string
  readonly detail: string
  readonly id: string
  readonly operation: string
  readonly rationale: string
  readonly state: 'ready' | 'review'
  readonly subject: string
}

const reviewRows: readonly ReviewRow[] = [
  {
    bound: '6 columns · 3 records',
    detail: 'Native row + column semantics',
    id: 'alignment-surface',
    operation: 'VERIFY',
    rationale: 'Dense evidence remains attached to an explicit subject and heading.',
    state: 'ready',
    subject: 'Alignment surface',
  },
  {
    bound: '1040 px minimum',
    detail: 'One bounded horizontal axis',
    id: 'viewport-continuity',
    operation: 'PRESERVE',
    rationale: 'Narrow viewports scroll the relation instead of changing its meaning.',
    state: 'review',
    subject: 'Viewport continuity',
  },
  {
    bound: '0 implied records',
    detail: 'Full-span declared result',
    id: 'empty-evidence',
    operation: 'DECLARE',
    rationale: 'An empty relation communicates its boundary instead of rendering silence.',
    state: 'ready',
    subject: 'Empty evidence',
  },
]

function KineticDenseTableSpecimen({ material }: { readonly material?: KineticMaterial }) {
  const columns: readonly KineticDenseTableColumn<ReviewRow>[] = [
    {
      header: 'Rank / subject',
      id: 'subject',
      render: (row, index) => (
        <div className={className(catalogStyles.denseIdentity)}>
          <span className={className(catalogStyles.denseOrdinal)}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={className(catalogStyles.denseStack)}>
            <strong>{row.subject}</strong>
            <code className={className(catalogStyles.denseMeta)}>{row.id}</code>
          </span>
        </div>
      ),
      rowHeader: true,
      width: '24%',
    },
    {
      header: 'Recommendation',
      id: 'operation',
      render: (row) => (
        <span className={className(catalogStyles.denseStack)}>
          <strong>{row.operation}</strong>
          <small className={className(catalogStyles.denseMeta)}>INTERFACE / STRUCTURE</small>
        </span>
      ),
      width: '16%',
    },
    {
      header: 'Why now',
      id: 'rationale',
      render: (row) => <p className={className(catalogStyles.denseReason)}>{row.rationale}</p>,
      width: '25%',
    },
    {
      header: 'Bounds',
      id: 'bounds',
      render: (row) => (
        <span className={className(catalogStyles.denseStack)}>
          <strong>{row.bound}</strong>
          <small className={className(catalogStyles.denseMeta)}>{row.detail}</small>
        </span>
      ),
      width: '17%',
    },
    {
      header: 'Readiness',
      id: 'state',
      render: (row) => (
        <span
          className={className(
            catalogStyles.denseState,
            row.state === 'ready' && catalogStyles.denseStateReady,
            row.state === 'review' && catalogStyles.denseStateReview,
          )}
        >
          {row.state}
        </span>
      ),
      width: '10%',
    },
    {
      align: 'right',
      header: 'Action',
      id: 'action',
      render: () => (
        <button className={catalogClass('catalog-table-action')} type="button">
          Inspect
        </button>
      ),
      width: '8%',
    },
  ]

  return (
    <KineticDenseTable
      ariaLabel="Interface review queue"
      className={className(catalogStyles.denseTable)}
      columns={columns}
      getRowClassName={() => className(catalogStyles.denseTableRow)}
      getRowKey={(row) => row.id}
      material={material}
      minWidth={1040}
      rows={reviewRows}
    />
  )
}

export function ControlCatalog({
  grammarLabel,
  hideInteractionSections = false,
  kineticMaterial,
}: ControlCatalogProps) {
  const radioName = useId()
  const [layer, setLayer] = useState<(typeof layers)[number]>('Content')
  const [enabled, setEnabled] = useState(true)
  const [range, setRange] = useState(68)
  const isKinetic = grammarLabel === 'kinetic'

  return (
    <div className={catalogClass('control-catalog')}>
      {hideInteractionSections ? null : (
        <>
          <StyleguideSection
            description={`Commands, selection, binary state, and disabled behavior rendered in the ${grammarLabel} grammar.`}
            id="buttons-heading"
            index="07"
            title="Buttons"
          >
            <div className={catalogClass('catalog-grid', 'catalog-grid-actions')}>
              <article className={catalogClass('catalog-specimen', 'catalog-specimen-wide')}>
                <header
                  className={className(catalogStyles.rowHeader, catalogStyles.specimenHeader)}
                >
                  <span className={className(catalogStyles.label)}>Command hierarchy</span>
                  <code className={className(catalogStyles.code)}>default states</code>
                </header>
                <div className={catalogClass('catalog-control-row')}>
                  <button
                    className={catalogClass('catalog-button', 'catalog-button-primary')}
                    type="button"
                  >
                    Continue
                  </button>
                  <button className={catalogClass('catalog-button')} type="button">
                    Save draft
                  </button>
                  <button
                    className={catalogClass('catalog-button', 'catalog-button-danger')}
                    type="button"
                  >
                    Remove
                  </button>
                  <button className={catalogClass('catalog-button')} disabled type="button">
                    Disabled
                  </button>
                  <button
                    aria-label="Add item"
                    className={catalogClass('catalog-icon-button')}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className={className(catalogStyles.icon)}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </article>

              <article className={catalogClass('catalog-specimen')}>
                <header
                  className={className(catalogStyles.rowHeader, catalogStyles.specimenHeader)}
                >
                  <span className={className(catalogStyles.label)}>Segmented control</span>
                  <code className={className(catalogStyles.code)}>single select</code>
                </header>
                <fieldset className={catalogClass('catalog-segmented')}>
                  <legend className={catalogClass('visually-hidden')}>Composition layer</legend>
                  {layers.map((candidate) => (
                    <button
                      aria-pressed={candidate === layer}
                      className={className(
                        catalogStyles.interactive,
                        catalogStyles.segmentedButton,
                        candidate === layer && catalogStyles.segmentedActive,
                      )}
                      key={candidate}
                      onClick={() => setLayer(candidate)}
                      type="button"
                    >
                      {candidate}
                    </button>
                  ))}
                </fieldset>
              </article>

              <article className={catalogClass('catalog-specimen')}>
                <header
                  className={className(catalogStyles.rowHeader, catalogStyles.specimenHeader)}
                >
                  <span className={className(catalogStyles.label)}>Binary control</span>
                  <code className={className(catalogStyles.code)}>switch</code>
                </header>
                <div className={catalogClass('catalog-switch-row')}>
                  <button
                    aria-checked={enabled}
                    aria-label="Enable live material"
                    className={className(
                      catalogStyles.interactive,
                      catalogStyles.switch,
                      enabled && catalogStyles.switchActive,
                    )}
                    onClick={() => setEnabled((current) => !current)}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={className(
                        catalogStyles.switchThumb,
                        enabled && catalogStyles.switchThumbActive,
                      )}
                    />
                  </button>
                  <div>
                    <strong className={className(catalogStyles.stackBlock)}>
                      {enabled ? 'Material active' : 'Material quiet'}
                    </strong>
                    <small className={className(catalogStyles.mutedSmall)}>
                      Preserves a familiar binary state.
                    </small>
                  </div>
                </div>
              </article>
            </div>
          </StyleguideSection>

          <StyleguideSection
            description="Native browser controls retain their expected semantics while the grammar supplies material, focus, shape, and hierarchy."
            id="forms-heading"
            index="08"
            title="Forms"
          >
            <form
              className={catalogClass('catalog-form')}
              onSubmit={(event) => event.preventDefault()}
            >
              <div className={catalogClass('catalog-field-grid')}>
                <label className={catalogClass('catalog-field')}>
                  <span className={className(catalogStyles.fieldLabel)}>Text input</span>
                  <input
                    className={className(catalogStyles.input)}
                    defaultValue="High fidelity"
                    type="text"
                  />
                  <small className={className(catalogStyles.fieldHelp)}>Free-form content</small>
                </label>
                <label className={catalogClass('catalog-field')}>
                  <span className={className(catalogStyles.fieldLabel)}>Search</span>
                  <input
                    className={className(catalogStyles.input)}
                    defaultValue="material grammar"
                    type="search"
                  />
                  <small className={className(catalogStyles.fieldHelp)}>
                    Query with native clearing behavior
                  </small>
                </label>
                <label className={catalogClass('catalog-field')}>
                  <span className={className(catalogStyles.fieldLabel)}>Number</span>
                  <input
                    className={className(catalogStyles.input)}
                    defaultValue="24"
                    min="0"
                    type="number"
                  />
                  <small className={className(catalogStyles.fieldHelp)}>
                    Numeric input with steppers
                  </small>
                </label>
                <label className={catalogClass('catalog-field')}>
                  <span className={className(catalogStyles.fieldLabel)}>Select</span>
                  <select className={className(catalogStyles.input)} defaultValue="medium">
                    <option value="subtle">Subtle</option>
                    <option value="medium">Medium</option>
                    <option value="expressive">Expressive</option>
                  </select>
                  <small className={className(catalogStyles.fieldHelp)}>
                    Bounded native selection
                  </small>
                </label>
                <label className={catalogClass('catalog-field', 'catalog-field-wide')}>
                  <span className={className(catalogStyles.fieldLabel)}>Textarea</span>
                  <textarea
                    className={className(catalogStyles.input, catalogStyles.textarea)}
                    defaultValue="A coherent visual language should hold together from the smallest control to the broadest application surface."
                  />
                  <small className={className(catalogStyles.fieldHelp)}>
                    Longer composition and notes
                  </small>
                </label>
                <label className={catalogClass('catalog-field', 'catalog-range-field')}>
                  <span className={className(catalogStyles.fieldLabel)}>
                    Range
                    <output className={className(catalogStyles.fieldHelp)}>{range}%</output>
                  </span>
                  {isKinetic ? (
                    <div
                      {...stylexProps(
                        catalogStyles.kineticRangeControl,
                        catalogStyles.kineticRangeValue(`${range}%`),
                      )}
                    >
                      <input
                        aria-label="Range"
                        className={className(catalogStyles.kineticRangeInput)}
                        max="100"
                        min="0"
                        onChange={(event) => setRange(event.currentTarget.valueAsNumber)}
                        type="range"
                        value={range}
                      />
                      <span
                        aria-hidden="true"
                        className={className(catalogStyles.kineticRangeRail)}
                      >
                        <i className={className(catalogStyles.kineticRangeFill)} />
                        <i className={className(catalogStyles.kineticRangeKnob)}>
                          <i className={className(catalogStyles.kineticRangeKnobMark)} />
                        </i>
                      </span>
                    </div>
                  ) : (
                    <input
                      className={className(catalogStyles.range)}
                      max="100"
                      min="0"
                      onChange={(event) => setRange(event.currentTarget.valueAsNumber)}
                      type="range"
                      value={range}
                    />
                  )}
                  <small className={className(catalogStyles.fieldHelp)}>
                    Continuous bounded value
                  </small>
                </label>
              </div>

              <div className={catalogClass('catalog-choice-grid')}>
                <fieldset className={catalogClass('catalog-choice-group')}>
                  <legend className={className(catalogStyles.choiceLegend)}>Checkboxes</legend>
                  <label className={className(catalogStyles.choiceLabel)}>
                    <input
                      className={className(
                        catalogStyles.choiceInput,
                        isKinetic && catalogStyles.kineticChoiceInput,
                        isKinetic && catalogStyles.kineticCheckbox,
                      )}
                      defaultChecked
                      type="checkbox"
                    />
                    <span>Show material effects</span>
                  </label>
                  <label className={className(catalogStyles.choiceLabel)}>
                    <input
                      className={className(
                        catalogStyles.choiceInput,
                        isKinetic && catalogStyles.kineticChoiceInput,
                        isKinetic && catalogStyles.kineticCheckbox,
                      )}
                      type="checkbox"
                    />
                    <span>Increase contrast</span>
                  </label>
                  <label className={className(catalogStyles.choiceLabel)}>
                    <input
                      className={className(
                        catalogStyles.choiceInput,
                        isKinetic && catalogStyles.kineticChoiceInput,
                        isKinetic && catalogStyles.kineticCheckbox,
                      )}
                      disabled
                      type="checkbox"
                    />
                    <span>Unavailable option</span>
                  </label>
                </fieldset>

                <fieldset className={catalogClass('catalog-choice-group')}>
                  <legend className={className(catalogStyles.choiceLegend)}>Radio choices</legend>
                  <label className={className(catalogStyles.choiceLabel)}>
                    <input
                      className={className(
                        catalogStyles.choiceInput,
                        isKinetic && catalogStyles.kineticChoiceInput,
                        isKinetic && catalogStyles.kineticRadio,
                      )}
                      defaultChecked
                      name={radioName}
                      type="radio"
                    />
                    <span>Automatic</span>
                  </label>
                  <label className={className(catalogStyles.choiceLabel)}>
                    <input
                      className={className(
                        catalogStyles.choiceInput,
                        isKinetic && catalogStyles.kineticChoiceInput,
                        isKinetic && catalogStyles.kineticRadio,
                      )}
                      name={radioName}
                      type="radio"
                    />
                    <span>Light</span>
                  </label>
                  <label className={className(catalogStyles.choiceLabel)}>
                    <input
                      className={className(
                        catalogStyles.choiceInput,
                        isKinetic && catalogStyles.kineticChoiceInput,
                        isKinetic && catalogStyles.kineticRadio,
                      )}
                      name={radioName}
                      type="radio"
                    />
                    <span>Dark</span>
                  </label>
                </fieldset>

                <div className={catalogClass('catalog-picker-group')}>
                  <label className={catalogClass('catalog-field')}>
                    <span className={className(catalogStyles.fieldLabel)}>Color</span>
                    <input
                      className={className(catalogStyles.colorInput)}
                      defaultValue="#6558f5"
                      type="color"
                    />
                  </label>
                  <label className={catalogClass('catalog-field')}>
                    <span className={className(catalogStyles.fieldLabel)}>Date</span>
                    <input
                      className={className(catalogStyles.input)}
                      defaultValue="2026-08-08"
                      type="date"
                    />
                  </label>
                  <label className={catalogClass('catalog-field')}>
                    <span className={className(catalogStyles.fieldLabel)}>File</span>
                    <input className={className(catalogStyles.fileInput)} type="file" />
                  </label>
                </div>
              </div>
            </form>
          </StyleguideSection>
        </>
      )}

      <StyleguideSection
        description="Compact labels make state and classification visible without overpowering the content they qualify."
        id="badges-heading"
        index="09"
        title="Badges"
      >
        <div className={catalogClass('catalog-badge-board')}>
          <article className={className(catalogStyles.badgeBoardItem)}>
            <span className={className(catalogStyles.badgeBoardLabel)}>Semantic status</span>
            <div className={catalogClass('catalog-control-row')}>
              <span className={catalogClass('catalog-badge', 'catalog-badge-positive')}>Ready</span>
              <span className={catalogClass('catalog-badge', 'catalog-badge-warning')}>Review</span>
              <span className={catalogClass('catalog-badge', 'catalog-badge-danger')}>Blocked</span>
              <span className={catalogClass('catalog-badge')}>Draft</span>
            </div>
          </article>
          <article className={className(catalogStyles.badgeBoardItem)}>
            <span className={className(catalogStyles.badgeBoardLabel)}>Classification</span>
            <div className={catalogClass('catalog-control-row')}>
              <span className={catalogClass('catalog-badge', 'catalog-badge-solid')}>Liquid</span>
              <span className={catalogClass('catalog-badge')}>React</span>
              <span className={catalogClass('catalog-badge')}>Stable API</span>
            </div>
          </article>
          <article className={className(catalogStyles.badgeBoardItem)}>
            <span className={className(catalogStyles.badgeBoardLabel)}>Counts</span>
            <div className={catalogClass('catalog-control-row')}>
              <span className={catalogClass('catalog-count-badge')}>3</span>
              <span className={catalogClass('catalog-count-badge')}>12</span>
              <span className={catalogClass('catalog-count-badge')}>99+</span>
            </div>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Cards test whether the grammar can group identity, metadata, state, supporting copy, and action into clear reusable objects."
        id="cards-heading"
        index="10"
        title="Cards"
      >
        <div className={catalogClass('catalog-card-grid')}>
          <article
            className={className(
              catalogStyles.surface,
              catalogStyles.card,
              catalogStyles.cardFirstWide,
            )}
          >
            <header className={className(catalogStyles.rowHeader)}>
              <span className={className(catalogStyles.label)}>Featured object</span>
              <span className={catalogClass('catalog-badge', 'catalog-badge-positive')}>Live</span>
            </header>
            <strong className={className(catalogStyles.cardTitle)}>Material study 024</strong>
            <p className={className(catalogStyles.cardCopy)}>
              A composed object with identity, supporting copy, state, and a clear next action.
            </p>
            <div className={catalogClass('catalog-card-meter')} aria-hidden="true">
              <span className={className(catalogStyles.meterValue)} />
            </div>
            <button className={catalogClass('catalog-text-action')} type="button">
              Open study <span aria-hidden="true">→</span>
            </button>
          </article>

          <article className={catalogClass('catalog-metric-card')}>
            <span className={className(catalogStyles.cardEyebrow)}>System coverage</span>
            <strong className={className(catalogStyles.metric)}>86%</strong>
            <p className={className(catalogStyles.cardCopy)}>
              Six new component states documented this week.
            </p>
            <div className={catalogClass('catalog-sparkline')} aria-hidden="true">
              {['28%', '48%', '39%', '62%', '55%', '78%', '100%'].map((height) => (
                <i key={height} {...stylexProps(catalogStyles.sparkBar(height))} />
              ))}
            </div>
          </article>

          <article className={catalogClass('catalog-action-card')}>
            <span className={className(catalogStyles.cardEyebrow)}>Next calibration</span>
            <strong className={className(catalogStyles.actionTitle)}>Reduced transparency</strong>
            <p className={className(catalogStyles.cardCopy)}>
              Verify that depth and hierarchy survive when material effects are unavailable.
            </p>
            <button
              className={className(
                catalogStyles.interactive,
                catalogStyles.button,
                catalogStyles.primaryButton,
                catalogStyles.actionButton,
              )}
              type="button"
            >
              Start review
            </button>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Dense data needs durable alignment, unambiguous headers, scannable state, and actions that remain attached to the right row."
        id="tables-heading"
        index="11"
        title="Tables"
      >
        {isKinetic ? (
          <KineticDenseTableSpecimen material={kineticMaterial} />
        ) : (
          <section aria-label="Component readiness" className={catalogClass('catalog-table-shell')}>
            <div className={catalogClass('catalog-table-heading')}>
              <div>
                <span className={className(catalogStyles.code, catalogStyles.stackBlock)}>
                  Component inventory
                </span>
                <strong className={className(catalogStyles.tableHeadingTitle)}>
                  Grammar readiness
                </strong>
              </div>
              <button className={catalogClass('catalog-button')} type="button">
                Filter
              </button>
            </div>
            <table className={catalogClass('catalog-table')}>
              <thead>
                <tr>
                  {['Primitive', 'Family', 'Theme coverage', 'State', 'Action'].map((heading) => (
                    <th
                      className={className(catalogStyles.tableCell, catalogStyles.tableHead)}
                      key={heading}
                      scope="col"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className={className(catalogStyles.tableRow)}>
                  <th
                    className={className(catalogStyles.tableCell, catalogStyles.tableRowHead)}
                    scope="row"
                  >
                    Button
                  </th>
                  <td className={className(catalogStyles.tableCell)}>Command</td>
                  <td className={className(catalogStyles.tableCell)}>4 / 4</td>
                  <td className={className(catalogStyles.tableCell)}>
                    <span className={catalogClass('catalog-badge', 'catalog-badge-positive')}>
                      Ready
                    </span>
                  </td>
                  <td className={className(catalogStyles.tableCell)}>
                    <button className={catalogClass('catalog-table-action')} type="button">
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr className={className(catalogStyles.tableRow)}>
                  <th
                    className={className(catalogStyles.tableCell, catalogStyles.tableRowHead)}
                    scope="row"
                  >
                    Text input
                  </th>
                  <td className={className(catalogStyles.tableCell)}>Field</td>
                  <td className={className(catalogStyles.tableCell)}>4 / 4</td>
                  <td className={className(catalogStyles.tableCell)}>
                    <span className={catalogClass('catalog-badge', 'catalog-badge-warning')}>
                      Review
                    </span>
                  </td>
                  <td className={className(catalogStyles.tableCell)}>
                    <button className={catalogClass('catalog-table-action')} type="button">
                      Compare
                    </button>
                  </td>
                </tr>
                <tr className={className(catalogStyles.tableRow)}>
                  <th
                    className={className(catalogStyles.tableCell, catalogStyles.tableRowHead)}
                    scope="row"
                  >
                    Data table
                  </th>
                  <td className={className(catalogStyles.tableCell)}>Structure</td>
                  <td className={className(catalogStyles.tableCell)}>2 / 4</td>
                  <td className={className(catalogStyles.tableCell)}>
                    <span className={catalogClass('catalog-badge')}>Draft</span>
                  </td>
                  <td className={className(catalogStyles.tableCell)}>
                    <button className={catalogClass('catalog-table-action')} type="button">
                      Continue
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </StyleguideSection>

      <StyleguideSection
        description="Lists make sequence, grouping, progress, and lightweight navigation readable with less structure than a table."
        id="lists-heading"
        index="12"
        title="Lists"
      >
        <div className={catalogClass('catalog-list-grid')}>
          <article className={catalogClass('catalog-list-card')}>
            <header className={className(catalogStyles.rowHeader)}>
              <span className={className(catalogStyles.label)}>Ordered work</span>
              <small className={className(catalogStyles.code)}>3 items</small>
            </header>
            <ol className={className(catalogStyles.list)}>
              <li className={className(catalogStyles.listItem)} data-state="complete">
                <span className={className(catalogStyles.listIndex)}>01</span>
                <div>
                  <strong
                    className={className(catalogStyles.stackBlock, catalogStyles.listTitleComplete)}
                  >
                    Choose a grammar
                  </strong>
                  <small className={className(catalogStyles.mutedSmall)}>
                    Material premise established
                  </small>
                </div>
              </li>
              <li className={className(catalogStyles.listItem)} data-state="active">
                <span className={className(catalogStyles.listIndex, catalogStyles.listIndexActive)}>
                  02
                </span>
                <div>
                  <strong className={className(catalogStyles.stackBlock)}>
                    Calibrate controls
                  </strong>
                  <small className={className(catalogStyles.mutedSmall)}>
                    Current specimen family
                  </small>
                </div>
              </li>
              <li className={className(catalogStyles.listItem)}>
                <span className={className(catalogStyles.listIndex)}>03</span>
                <div>
                  <strong className={className(catalogStyles.stackBlock)}>
                    Compose an interface
                  </strong>
                  <small className={className(catalogStyles.mutedSmall)}>
                    Pending system validation
                  </small>
                </div>
              </li>
            </ol>
          </article>

          <article className={catalogClass('catalog-list-card', 'catalog-navigation-list')}>
            <header className={className(catalogStyles.rowHeader)}>
              <span className={className(catalogStyles.label)}>Navigation list</span>
              <small className={className(catalogStyles.code)}>Active state</small>
            </header>
            <ul className={className(catalogStyles.list)}>
              <li className={className(catalogStyles.navigationItem)}>
                <button className={className(catalogStyles.navigationButton)} type="button">
                  <span>Foundations</span>
                  <small className={className(catalogStyles.mutedSmall)}>6 sections</small>
                </button>
              </li>
              <li className={className(catalogStyles.navigationItem)} data-state="active">
                <button
                  className={className(
                    catalogStyles.navigationButton,
                    catalogStyles.navigationActive,
                  )}
                  type="button"
                >
                  <span>Controls</span>
                  <small className={className(catalogStyles.mutedSmall)}>3 sections</small>
                </button>
              </li>
              <li className={className(catalogStyles.navigationItem)}>
                <button className={className(catalogStyles.navigationButton)} type="button">
                  <span>Structures</span>
                  <small className={className(catalogStyles.mutedSmall)}>5 sections</small>
                </button>
              </li>
            </ul>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Feedback must carry urgency and meaning through more than color, from quiet status updates to actions that need immediate attention."
        id="feedback-heading"
        index="13"
        title="Feedback"
      >
        <div className={catalogClass('catalog-feedback-grid')}>
          <article className={catalogClass('catalog-feedback-card')} role="status">
            <span className={className(catalogStyles.feedbackMark)} aria-hidden="true">
              i
            </span>
            <div>
              <strong>Theme applied successfully</strong>
              <p className={className(catalogStyles.feedbackCopy)}>
                The current material tokens are active across every specimen on this route.
              </p>
            </div>
            <button
              aria-label="Dismiss message"
              className={className(catalogStyles.interactive, catalogStyles.dismiss)}
              type="button"
            >
              ×
            </button>
          </article>
          <article
            className={catalogClass('catalog-feedback-card', 'catalog-feedback-positive')}
            role="status"
          >
            <span
              className={className(catalogStyles.feedbackMark, catalogStyles.feedbackMarkPositive)}
              aria-hidden="true"
            >
              ✓
            </span>
            <div>
              <strong>All checks passed</strong>
              <p className={className(catalogStyles.feedbackCopy)}>
                Contrast, keyboard focus, and reduced-motion behavior are ready.
              </p>
            </div>
          </article>
          <article
            className={catalogClass('catalog-feedback-card', 'catalog-feedback-warning')}
            role="alert"
          >
            <span
              className={className(catalogStyles.feedbackMark, catalogStyles.feedbackMarkWarning)}
              aria-hidden="true"
            >
              !
            </span>
            <div>
              <strong>Fallback needs review</strong>
              <p className={className(catalogStyles.feedbackCopy)}>
                Verify this surface without blur or GPU rendering before publishing.
              </p>
            </div>
            <button className={catalogClass('catalog-text-action')} type="button">
              Review
            </button>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="The final test combines navigation, metrics, progress, controls, and activity into one small product surface."
        id="composition-heading"
        index="14"
        title="Composition"
      >
        <article className={catalogClass('catalog-composition')}>
          <header className={catalogClass('catalog-composition-header')}>
            <div>
              <span className={className(catalogStyles.compositionMeta)}>Hifi / Grammar lab</span>
              <strong className={className(catalogStyles.compositionHeaderTitle)}>
                Material workspace
              </strong>
            </div>
            <div className={catalogClass('catalog-composition-actions')}>
              <span className={catalogClass('catalog-badge', 'catalog-badge-positive')}>
                Synced
              </span>
              <button
                aria-label="More workspace actions"
                className={catalogClass('catalog-icon-button')}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className={className(catalogStyles.icon)}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="5" cy="12" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                </svg>
              </button>
            </div>
          </header>
          <div className={catalogClass('catalog-composition-body')}>
            <nav
              aria-label="Composition preview"
              className={className(catalogStyles.compositionNav)}
            >
              <span
                className={className(
                  catalogStyles.compositionMeta,
                  catalogStyles.compositionNavHeading,
                )}
              >
                Workspace
              </span>
              <a
                aria-current="page"
                className={className(
                  catalogStyles.compositionNavLink,
                  catalogStyles.compositionNavActive,
                )}
                href="#composition-heading"
              >
                Overview
              </a>
              <a className={className(catalogStyles.compositionNavLink)} href="#material-heading">
                Material
              </a>
              <a className={className(catalogStyles.compositionNavLink)} href="#forms-heading">
                Controls
              </a>
              <a className={className(catalogStyles.compositionNavLink)} href="#feedback-heading">
                Checks
              </a>
            </nav>
            <div className={catalogClass('catalog-composition-main')}>
              <div className={catalogClass('catalog-composition-title')}>
                <div>
                  <span className={className(catalogStyles.compositionMeta)}>Current grammar</span>
                  <strong className={className(catalogStyles.compositionTitleStrong)}>
                    {grammarLabel}
                  </strong>
                </div>
                <button
                  className={catalogClass('catalog-button', 'catalog-button-primary')}
                  type="button"
                >
                  Publish changes
                </button>
              </div>
              <div className={catalogClass('catalog-composition-metrics')}>
                <article className={className(catalogStyles.metricCard)}>
                  <span className={className(catalogStyles.compositionMeta)}>Sections</span>
                  <strong className={className(catalogStyles.metricValue)}>14</strong>
                  <small className={className(catalogStyles.mutedSmall)}>Shared contract</small>
                </article>
                <article className={className(catalogStyles.metricCard)}>
                  <span className={className(catalogStyles.compositionMeta)}>Coverage</span>
                  <strong className={className(catalogStyles.metricValue)}>86%</strong>
                  <small className={className(catalogStyles.mutedSmall)}>+8 this week</small>
                </article>
                <article className={className(catalogStyles.metricCard)}>
                  <span className={className(catalogStyles.compositionMeta)}>Open checks</span>
                  <strong className={className(catalogStyles.metricValue)}>03</strong>
                  <small className={className(catalogStyles.mutedSmall)}>2 accessibility</small>
                </article>
              </div>
              <div className={catalogClass('catalog-composition-activity')}>
                <header className={className(catalogStyles.activityHeader)}>
                  <strong>Recent calibration</strong>
                  <button className={catalogClass('catalog-text-action')} type="button">
                    View all
                  </button>
                </header>
                <div className={className(catalogStyles.activityRow)}>
                  <span className={catalogClass('catalog-count-badge')}>01</span>
                  <p className={className(catalogStyles.activityCopy)}>
                    <strong className={className(catalogStyles.stackBlock)}>
                      Focus state tuned
                    </strong>
                    <small className={className(catalogStyles.mutedSmall)}>
                      Buttons · just now
                    </small>
                  </p>
                  <span className={catalogClass('catalog-badge', 'catalog-badge-positive')}>
                    Ready
                  </span>
                </div>
                <div className={className(catalogStyles.activityRow)}>
                  <span className={catalogClass('catalog-count-badge')}>02</span>
                  <p className={className(catalogStyles.activityCopy)}>
                    <strong className={className(catalogStyles.stackBlock)}>
                      Material fallback added
                    </strong>
                    <small className={className(catalogStyles.mutedSmall)}>
                      Cards · 18 min ago
                    </small>
                  </p>
                  <span className={catalogClass('catalog-badge', 'catalog-badge-warning')}>
                    Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </StyleguideSection>
    </div>
  )
}
