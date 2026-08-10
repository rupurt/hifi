import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { KineticDenseTable, type KineticDenseTableColumn } from './KineticDenseTable'

interface RecordRow {
  readonly id: string
  readonly state: string
}

const columns: readonly KineticDenseTableColumn<RecordRow>[] = [
  {
    header: 'Subject',
    id: 'subject',
    render: (row) => row.id,
    rowHeader: true,
    width: '70%',
  },
  {
    align: 'right',
    header: 'State',
    id: 'state',
    render: (row) => createElement('strong', null, row.state),
    width: '30%',
  },
]

describe('KineticDenseTable', () => {
  it('retains native table semantics around rich cell content', () => {
    const markup = renderToStaticMarkup(
      createElement(KineticDenseTable<RecordRow>, {
        ariaLabel: 'Runtime attention',
        columns,
        getRowKey: (row) => row.id,
        rows: [{ id: 'survey-context', state: 'ready' }],
      }),
    )

    expect(markup).toContain('data-kinetic-dense-table=""')
    expect(markup).toContain('aria-label="Runtime attention"')
    expect(markup).toContain('<th scope="col"')
    expect(markup).toContain('<th scope="row"')
    expect(markup).toContain('<strong>ready</strong>')
  })

  it('declares an empty bounded view across every column', () => {
    const markup = renderToStaticMarkup(
      createElement(KineticDenseTable<RecordRow>, {
        ariaLabel: 'Runtime attention',
        columns,
        emptyState: 'No retained evidence',
        getRowKey: (row) => row.id,
        rows: [],
      }),
    )

    expect(markup).toContain('colSpan="2"')
    expect(markup).toContain('No retained evidence')
  })

  it('rejects a table without an alignment surface', () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(KineticDenseTable<RecordRow>, {
          ariaLabel: 'Runtime attention',
          columns: [],
          getRowKey: (row) => row.id,
          rows: [],
        }),
      ),
    ).toThrowError('KineticDenseTable requires at least one column')
  })
})
