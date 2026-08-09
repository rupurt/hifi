import { describe, expect, it } from 'vitest'
import { router } from './router'

describe('styleguide routes', () => {
  it('gives each grammar an explicit route', () => {
    expect(Object.keys(router.routesByPath)).toEqual(
      expect.arrayContaining([
        '/styleguide/liquid',
        '/styleguide/texture',
        '/styleguide/print',
        '/styleguide/signal',
        '/styleguide/kinetic',
      ]),
    )
  })

  it('does not use a catch-all grammar route', () => {
    expect(Object.keys(router.routesByPath)).not.toContain('/styleguide/$grammar')
  })
})
