import type { PropsWithChildren } from 'react'

interface StyleguideSectionProps extends PropsWithChildren {
  readonly description: string
  readonly id: string
  readonly index: string
  readonly title: string
}

export function StyleguideSection({
  children,
  description,
  id,
  index,
  title,
}: StyleguideSectionProps) {
  return (
    <section aria-labelledby={id} className="guide-section">
      <header className="guide-section-heading">
        <span className="guide-section-index">{index}</span>
        <div>
          <h2 id={id}>{title}</h2>
          <p>{description}</p>
        </div>
      </header>
      {children}
    </section>
  )
}
