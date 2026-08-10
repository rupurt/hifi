import { StyleguideSection } from './StyleguideSection'
import { foundationStyles } from './stylex/foundations.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

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
    <div className={className(foundationStyles.catalog)}>
      <StyleguideSection
        description="Display, reading, numeric, and machine-text roles establish the grammar's voice before components add meaning."
        id="typography-heading"
        index="02"
        title="Typography"
      >
        <div className={className(foundationStyles.typeRoleGrid)}>
          <article className={className(foundationStyles.surface, foundationStyles.typeRoleCard)}>
            <header className={className(foundationStyles.typeRoleHeader)}>
              <span className={className(foundationStyles.metaLabel)}>Display</span>
              <code className={className(foundationStyles.metaCode)}>--guide-display</code>
            </header>
            <strong
              className={className(foundationStyles.typeRoleStrong, foundationStyles.displayType)}
            >
              Aa
            </strong>
            <p className={className(foundationStyles.typeRoleCopy)}>
              Landmarks, section titles, and moments that establish the grammar's character.
            </p>
          </article>
          <article className={className(foundationStyles.surface, foundationStyles.typeRoleCard)}>
            <header className={className(foundationStyles.typeRoleHeader)}>
              <span className={className(foundationStyles.metaLabel)}>Reading</span>
              <code className={className(foundationStyles.metaCode)}>--guide-font</code>
            </header>
            <strong
              className={className(foundationStyles.typeRoleStrong, foundationStyles.readingType)}
            >
              The quick brown fox moves through twelve layers.
            </strong>
            <p className={className(foundationStyles.typeRoleCopy)}>
              Body copy and controls prioritize rhythm, clarity, and comfortable scanning.
            </p>
          </article>
          <article className={className(foundationStyles.surface, foundationStyles.typeRoleCard)}>
            <header className={className(foundationStyles.typeRoleHeader)}>
              <span className={className(foundationStyles.metaLabel)}>Numeric</span>
              <code className={className(foundationStyles.metaCode)}>tabular-nums</code>
            </header>
            <strong
              className={className(foundationStyles.typeRoleStrong, foundationStyles.numericType)}
            >
              0123456789
            </strong>
            <p className={className(foundationStyles.typeRoleCopy)}>
              Measurements and changing values remain aligned and comparable.
            </p>
          </article>
          <article className={className(foundationStyles.surface, foundationStyles.typeRoleCard)}>
            <header className={className(foundationStyles.typeRoleHeader)}>
              <span className={className(foundationStyles.metaLabel)}>Machine</span>
              <code className={className(foundationStyles.metaCode)}>--guide-mono</code>
            </header>
            <strong
              className={className(foundationStyles.typeRoleStrong, foundationStyles.machineType)}
            >
              theme.material.depth
            </strong>
            <p className={className(foundationStyles.typeRoleCopy)}>
              Tokens, identifiers, paths, and implementation details use a distinct voice.
            </p>
          </article>
        </div>
        <section className={className(foundationStyles.typeLadder)} aria-label="Heading hierarchy">
          <div className={className(foundationStyles.typeLadderRow)}>
            <span className={className(foundationStyles.ladderMeta)}>Display</span>
            <strong className={className(foundationStyles.ladderDisplay)}>Grammar landmark</strong>
          </div>
          <div className={className(foundationStyles.typeLadderRow)}>
            <span className={className(foundationStyles.ladderMeta)}>Heading 1</span>
            <strong className={className(foundationStyles.ladderH1)}>Interface section</strong>
          </div>
          <div className={className(foundationStyles.typeLadderRow)}>
            <span className={className(foundationStyles.ladderMeta)}>Heading 2</span>
            <strong className={className(foundationStyles.ladderH2)}>Component family</strong>
          </div>
          <div className={className(foundationStyles.typeLadderRow)}>
            <span className={className(foundationStyles.ladderMeta)}>Body</span>
            <p className={className(foundationStyles.ladderContent)}>
              Supporting copy explains behavior without competing with the control itself.
            </p>
          </div>
          <div className={className(foundationStyles.typeLadderRow)}>
            <span className={className(foundationStyles.ladderMeta)}>Label</span>
            <small className={className(foundationStyles.ladderContent)}>
              Compact interface metadata
            </small>
          </div>
        </section>
      </StyleguideSection>

      <StyleguideSection
        description="Color begins with field and ink, then adds focused semantic energy for action, confirmation, caution, and interruption."
        id="color-heading"
        index="03"
        title="Color"
      >
        <div className={className(foundationStyles.colorGrid)}>
          <article className={className(foundationStyles.swatch, foundationStyles.swatchField)}>
            <span className={className(foundationStyles.swatchLabel)}>Field</span>
            <strong className={className(foundationStyles.swatchName)}>Surface</strong>
            <code className={className(foundationStyles.swatchCode)}>--control-surface</code>
          </article>
          <article className={className(foundationStyles.swatch, foundationStyles.swatchInk)}>
            <span className={className(foundationStyles.swatchLabel)}>Ink</span>
            <strong className={className(foundationStyles.swatchName)}>Foreground</strong>
            <code className={className(foundationStyles.swatchCode)}>--guide-ink</code>
          </article>
          <article className={className(foundationStyles.swatch, foundationStyles.swatchAccent)}>
            <span className={className(foundationStyles.swatchLabel)}>Accent</span>
            <strong className={className(foundationStyles.swatchName)}>Focus</strong>
            <code className={className(foundationStyles.swatchCode)}>--control-accent</code>
          </article>
          <article className={className(foundationStyles.swatch, foundationStyles.swatchPositive)}>
            <span className={className(foundationStyles.swatchLabel)}>Positive</span>
            <strong className={className(foundationStyles.swatchName)}>Confirmed</strong>
            <code className={className(foundationStyles.swatchCode)}>--control-positive</code>
          </article>
          <article className={className(foundationStyles.swatch, foundationStyles.swatchWarning)}>
            <span className={className(foundationStyles.swatchLabel)}>Warning</span>
            <strong className={className(foundationStyles.swatchName)}>Attention</strong>
            <code className={className(foundationStyles.swatchCode)}>--control-warning</code>
          </article>
          <article className={className(foundationStyles.swatch, foundationStyles.swatchDanger)}>
            <span className={className(foundationStyles.swatchLabel)}>Danger</span>
            <strong className={className(foundationStyles.swatchName)}>Interrupted</strong>
            <code className={className(foundationStyles.swatchCode)}>--control-danger</code>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="A 4px-rooted scale keeps dense controls precise and widens predictably for cards, compositions, and route-level breathing room."
        id="spacing-heading"
        index="04"
        title="Spacing"
      >
        <div className={className(foundationStyles.spacingGrid)}>
          {spacingTokens.map((value, index) => (
            <article
              className={className(foundationStyles.surface, foundationStyles.spaceToken)}
              key={value}
            >
              <div className={className(foundationStyles.spaceTokenCopy)}>
                <span className={className(foundationStyles.spaceLabel)}>Space {index + 1}</span>
                <strong className={className(foundationStyles.spaceValue)}>{value}px</strong>
              </div>
              <i aria-hidden="true" {...stylexProps(foundationStyles.spaceRuler(`${value}px`))} />
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
        <div className={className(foundationStyles.surface, foundationStyles.layoutBoard)}>
          <div aria-hidden="true" className={className(foundationStyles.columnGrid)}>
            {layoutColumns.map((column) => (
              <span className={className(foundationStyles.column)} key={column}>
                {column}
              </span>
            ))}
          </div>
          <div className={className(foundationStyles.layoutExamples)}>
            <article className={className(foundationStyles.layoutExample)}>
              <span className={className(foundationStyles.layoutExampleMeta)}>3 columns</span>
              <strong className={className(foundationStyles.layoutExampleTitle)}>
                Navigation rail
              </strong>
            </article>
            <article className={className(foundationStyles.layoutExample)}>
              <span className={className(foundationStyles.layoutExampleMeta)}>6 columns</span>
              <strong className={className(foundationStyles.layoutExampleTitle)}>
                Primary work
              </strong>
            </article>
            <article className={className(foundationStyles.layoutExample)}>
              <span className={className(foundationStyles.layoutExampleMeta)}>3 columns</span>
              <strong className={className(foundationStyles.layoutExampleTitle)}>Inspector</strong>
            </article>
          </div>
          <dl className={className(foundationStyles.layoutTokens)}>
            <div className={className(foundationStyles.layoutToken)}>
              <dt className={className(foundationStyles.layoutTokenTerm)}>Columns</dt>
              <dd className={className(foundationStyles.layoutTokenValue)}>12</dd>
            </div>
            <div className={className(foundationStyles.layoutToken)}>
              <dt className={className(foundationStyles.layoutTokenTerm)}>Gutter</dt>
              <dd className={className(foundationStyles.layoutTokenValue)}>16px</dd>
            </div>
            <div className={className(foundationStyles.layoutToken)}>
              <dt className={className(foundationStyles.layoutTokenTerm)}>Readable lane</dt>
              <dd className={className(foundationStyles.layoutTokenValue)}>680px</dd>
            </div>
            <div className={className(foundationStyles.layoutToken)}>
              <dt className={className(foundationStyles.layoutTokenTerm)}>Maximum frame</dt>
              <dd className={className(foundationStyles.layoutTokenValue)}>1380px</dd>
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
        <div className={className(foundationStyles.iconGrid)}>
          {icons.map((icon) => (
            <article
              className={className(foundationStyles.surface, foundationStyles.iconSpecimen)}
              key={icon.label}
            >
              <button
                aria-label={icon.label}
                className={className(foundationStyles.iconButton)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className={className(foundationStyles.icon)}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {icon.path}
                </svg>
              </button>
              <span className={className(foundationStyles.iconLabel)}>{icon.label}</span>
            </article>
          ))}
        </div>
      </StyleguideSection>
    </div>
  )
}
