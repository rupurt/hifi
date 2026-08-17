import {
  KineticDenseTable,
  type KineticDenseTableColumn,
  type KineticMaterial,
} from '@hifi/kinetic'
import type {
  ChoiceKitProps,
  GrammarControlKit,
  RangeKitProps,
  ReviewRow,
  TableKitProps,
} from './ControlKits'
import { catalogClass } from './stylex/catalog.stylex'
import { catalogKineticStyles } from './stylex/catalog-kinetic.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

export function createKineticControlKit(material: KineticMaterial): GrammarControlKit {
  return {
    renderChoice({ type, inputProps }: ChoiceKitProps) {
      return (
        <input
          {...inputProps}
          className={className(
            catalogKineticStyles.choiceInput,
            type === 'checkbox' ? catalogKineticStyles.checkbox : catalogKineticStyles.radio,
          )}
          type={type}
        />
      )
    },
    renderRange({ value, onChange }: RangeKitProps) {
      return (
        <div
          {...stylexProps(
            catalogKineticStyles.rangeControl,
            catalogKineticStyles.rangeValue(`${value}%`),
          )}
        >
          <input
            aria-label="Range"
            className={className(catalogKineticStyles.rangeInput)}
            max="100"
            min="0"
            onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            type="range"
            value={value}
          />
          <span aria-hidden="true" className={className(catalogKineticStyles.rangeRail)}>
            <i className={className(catalogKineticStyles.rangeFill)} />
            <i className={className(catalogKineticStyles.rangeKnob)}>
              <i className={className(catalogKineticStyles.rangeKnobMark)} />
            </i>
          </span>
        </div>
      )
    },
    renderTable({ rows }: TableKitProps) {
      return <KineticDenseTableSpecimen material={material} rows={rows} />
    },
  }
}

function KineticDenseTableSpecimen({
  material,
  rows,
}: {
  readonly material: KineticMaterial
  readonly rows: readonly ReviewRow[]
}) {
  const columns: readonly KineticDenseTableColumn<ReviewRow>[] = [
    {
      header: 'Rank / subject',
      id: 'subject',
      render: (row, index) => (
        <div className={className(catalogKineticStyles.denseIdentity)}>
          <span className={className(catalogKineticStyles.denseOrdinal)}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={className(catalogKineticStyles.denseStack)}>
            <strong>{row.subject}</strong>
            <code className={className(catalogKineticStyles.denseMeta)}>{row.id}</code>
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
        <span className={className(catalogKineticStyles.denseStack)}>
          <strong>{row.operation}</strong>
          <small className={className(catalogKineticStyles.denseMeta)}>INTERFACE / STRUCTURE</small>
        </span>
      ),
      width: '16%',
    },
    {
      header: 'Why now',
      id: 'rationale',
      render: (row) => (
        <p className={className(catalogKineticStyles.denseReason)}>{row.rationale}</p>
      ),
      width: '25%',
    },
    {
      header: 'Bounds',
      id: 'bounds',
      render: (row) => (
        <span className={className(catalogKineticStyles.denseStack)}>
          <strong>{row.bound}</strong>
          <small className={className(catalogKineticStyles.denseMeta)}>{row.detail}</small>
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
            catalogKineticStyles.denseState,
            row.state === 'ready' && catalogKineticStyles.denseStateReady,
            row.state === 'review' && catalogKineticStyles.denseStateReview,
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
      className={className(catalogKineticStyles.denseTable)}
      columns={columns}
      getRowClassName={() => className(catalogKineticStyles.denseTableRow)}
      getRowKey={(row) => row.id}
      material={material}
      minWidth={1040}
      rows={rows}
    />
  )
}
