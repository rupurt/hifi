# @hifi/kinetic

Programmable physical interaction for React. Kinetic materials govern mass, stiffness, damping, friction, travel, actuation, detents, and restitution as portable JSON.

## Install

```sh
pnpm add @hifi/kinetic react
```

## Use a mechanism

```tsx
import { KineticButton, parseKineticMaterial } from '@hifi/kinetic'
import materialJson from './kinetic-theme.json'

const material = parseKineticMaterial(materialJson)

export function LaunchControl() {
  return <KineticButton material={material}>Launch</KineticButton>
}
```

`KineticButton` remains a native button and preserves consumer event handlers while mapping the active material into travel, settling, and shadow response. `KineticSurface` and `getKineticMaterialStyle` apply the same mechanism to larger compositions.

## Align dense evidence

`KineticDenseTable` keeps high-dimensional records on one explicit alignment surface. It renders a native table, preserves row and column headers, scrolls the complete relation on narrow viewports, and declares an empty bounded view instead of implying missing records.

```tsx
import {
  KineticDenseTable,
  type KineticDenseTableColumn,
} from '@hifi/kinetic'

interface AttentionRow {
  id: string
  operation: string
  state: string
}

const columns: readonly KineticDenseTableColumn<AttentionRow>[] = [
  {
    id: 'subject',
    header: 'Subject',
    rowHeader: true,
    width: '50%',
    render: (row) => <strong>{row.id}</strong>,
  },
  {
    id: 'operation',
    header: 'Operation',
    width: '30%',
    render: (row) => row.operation,
  },
  {
    id: 'state',
    header: 'State',
    align: 'right',
    width: '20%',
    render: (row) => row.state,
  },
]

export function AttentionTable({ rows }: { rows: readonly AttentionRow[] }) {
  return (
    <KineticDenseTable
      ariaLabel="Runtime attention"
      columns={columns}
      emptyState="No retained attention"
      getRowKey={(row) => row.id}
      rows={rows}
      theme="precision"
    />
  )
}
```

Cells accept arbitrary React content. Use `rowHeader` on the column that identifies each record, and keep interactive controls inside their own cells rather than making an entire row behave like a button. `minWidth`, `getRowClassName`, and `getRowStyle` let an application preserve its own responsive and state grammar. Set `--kinetic-dense-table-cell-padding` on the component style to tune density without changing its structure.

Sound, vibration, and other physical feedback remain application-controlled progressive enhancements. Core meaning must remain available through visual state and native semantics.

This package is ESM-only and supports Node.js 20 or newer.
