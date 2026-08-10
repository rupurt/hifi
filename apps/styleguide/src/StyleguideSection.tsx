import type { PropsWithChildren } from 'react'
import { className, sharedStyles } from './stylex/shared.stylex'

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
    <section aria-labelledby={id} className={className(sharedStyles.guideSection)}>
      <header className={className(sharedStyles.guideSectionHeading)}>
        <span className={className(sharedStyles.guideSectionIndex)}>{index}</span>
        <div>
          <h2 className={className(sharedStyles.guideSectionTitle)} id={id}>
            {title}
          </h2>
          <p className={className(sharedStyles.guideSectionDescription)}>{description}</p>
        </div>
      </header>
      {children}
    </section>
  )
}
