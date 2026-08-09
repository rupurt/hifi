import { StyleguideSection } from './StyleguideSection'
import './styles/foundations.css'

const spacingTokens = [4, 8, 12, 16, 24, 32, 48, 64] as const
const layoutColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

const icons = [
  {
    label: 'Add',
    path: <path d="M12 5v14M5 12h14" />,
  },
  {
    label: 'Search',
    path: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
  },
  {
    label: 'Tune',
    path: (
      <>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
  },
  {
    label: 'Favorite',
    path: (
      <path d="m12 20-1.3-1.18C6.1 14.65 3 11.82 3 8.35 3 5.52 5.24 3.3 8.08 3.3c1.6 0 3.14.74 3.92 1.9.78-1.16 2.32-1.9 3.92-1.9C18.76 3.3 21 5.52 21 8.35c0 3.47-3.1 6.3-7.7 10.48Z" />
    ),
  },
  {
    label: 'Download',
    path: (
      <>
        <path d="M12 3v12m0 0 5-5m-5 5-5-5" />
        <path d="M5 20h14" />
      </>
    ),
  },
  {
    label: 'More',
    path: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
  },
  {
    label: 'Info',
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
  },
  {
    label: 'Close',
    path: <path d="m6 6 12 12M18 6 6 18" />,
  },
] as const

export function FoundationCatalog() {
  return (
    <div className="foundation-catalog">
      <StyleguideSection
        description="Display, reading, numeric, and machine-text roles establish the grammar's voice before components add meaning."
        id="typography-heading"
        index="02"
        title="Typography"
      >
        <div className="type-role-grid">
          <article className="type-role-card type-role-display">
            <header>
              <span>Display</span>
              <code>--guide-display</code>
            </header>
            <strong>Aa</strong>
            <p>Landmarks, section titles, and moments that establish the grammar's character.</p>
          </article>
          <article className="type-role-card type-role-reading">
            <header>
              <span>Reading</span>
              <code>--guide-font</code>
            </header>
            <strong>The quick brown fox moves through twelve layers.</strong>
            <p>Body copy and controls prioritize rhythm, clarity, and comfortable scanning.</p>
          </article>
          <article className="type-role-card type-role-numeric">
            <header>
              <span>Numeric</span>
              <code>tabular-nums</code>
            </header>
            <strong>0123456789</strong>
            <p>Measurements and changing values remain aligned and comparable.</p>
          </article>
          <article className="type-role-card type-role-machine">
            <header>
              <span>Machine</span>
              <code>--guide-mono</code>
            </header>
            <strong>theme.material.depth</strong>
            <p>Tokens, identifiers, paths, and implementation details use a distinct voice.</p>
          </article>
        </div>
        <section className="type-ladder" aria-label="Heading hierarchy">
          <div>
            <span>Display</span>
            <strong>Grammar landmark</strong>
          </div>
          <div>
            <span>Heading 1</span>
            <strong>Interface section</strong>
          </div>
          <div>
            <span>Heading 2</span>
            <strong>Component family</strong>
          </div>
          <div>
            <span>Body</span>
            <p>Supporting copy explains behavior without competing with the control itself.</p>
          </div>
          <div>
            <span>Label</span>
            <small>Compact interface metadata</small>
          </div>
        </section>
      </StyleguideSection>

      <StyleguideSection
        description="Color begins with field and ink, then adds focused semantic energy for action, confirmation, caution, and interruption."
        id="color-heading"
        index="03"
        title="Color"
      >
        <div className="foundation-color-grid">
          <article className="foundation-swatch foundation-swatch-field">
            <span>Field</span>
            <strong>Surface</strong>
            <code>--control-surface</code>
          </article>
          <article className="foundation-swatch foundation-swatch-ink">
            <span>Ink</span>
            <strong>Foreground</strong>
            <code>--guide-ink</code>
          </article>
          <article className="foundation-swatch foundation-swatch-accent">
            <span>Accent</span>
            <strong>Focus</strong>
            <code>--control-accent</code>
          </article>
          <article className="foundation-swatch foundation-swatch-positive">
            <span>Positive</span>
            <strong>Confirmed</strong>
            <code>--control-positive</code>
          </article>
          <article className="foundation-swatch foundation-swatch-warning">
            <span>Warning</span>
            <strong>Attention</strong>
            <code>--control-warning</code>
          </article>
          <article className="foundation-swatch foundation-swatch-danger">
            <span>Danger</span>
            <strong>Interrupted</strong>
            <code>--control-danger</code>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="A 4px-rooted scale keeps dense controls precise and widens predictably for cards, compositions, and route-level breathing room."
        id="spacing-heading"
        index="04"
        title="Spacing"
      >
        <div className="foundation-spacing-grid">
          {spacingTokens.map((value, index) => (
            <article className="foundation-space-token" key={value}>
              <div>
                <span>Space {index + 1}</span>
                <strong>{value}px</strong>
              </div>
              <i aria-hidden="true" className={`foundation-space-ruler space-ruler-${value}`} />
            </article>
          ))}
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="A twelve-column frame gives every grammar consistent composition tools while allowing radically different density and emphasis."
        id="layout-heading"
        index="05"
        title="Layout"
      >
        <div className="foundation-layout-board">
          <div aria-hidden="true" className="foundation-column-grid">
            {layoutColumns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          <div className="foundation-layout-examples">
            <article className="layout-example layout-example-rail">
              <span>3 columns</span>
              <strong>Navigation rail</strong>
            </article>
            <article className="layout-example layout-example-main">
              <span>6 columns</span>
              <strong>Primary work</strong>
            </article>
            <article className="layout-example layout-example-detail">
              <span>3 columns</span>
              <strong>Inspector</strong>
            </article>
          </div>
          <dl className="foundation-layout-tokens">
            <div>
              <dt>Columns</dt>
              <dd>12</dd>
            </div>
            <div>
              <dt>Gutter</dt>
              <dd>16px</dd>
            </div>
            <div>
              <dt>Readable lane</dt>
              <dd>680px</dd>
            </div>
            <div>
              <dt>Maximum frame</dt>
              <dd>1380px</dd>
            </div>
          </dl>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Icons reduce scan time for familiar actions. Every icon remains labeled and inherits the grammar's material and interaction states."
        id="icons-heading"
        index="06"
        title="Icons"
      >
        <div className="foundation-icon-grid">
          {icons.map((icon) => (
            <article className="foundation-icon-specimen" key={icon.label}>
              <button aria-label={icon.label} type="button">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  {icon.path}
                </svg>
              </button>
              <span>{icon.label}</span>
            </article>
          ))}
        </div>
      </StyleguideSection>
    </div>
  )
}
