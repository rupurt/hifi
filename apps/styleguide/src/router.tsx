import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { grammarNames, grammarRegistry } from './grammars'
import { KineticStyleguide } from './KineticStyleguide'
import { LiquidStyleguide } from './LiquidStyleguide'
import { MosaicStyleguide } from './MosaicStyleguide'
import { PrintStyleguide } from './PrintStyleguide'
import { className, globalStyles, sharedStyles } from './stylex/shared.stylex'
import { TextureStyleguide } from './TextureStyleguide'

function RootLayout() {
  const location = useRouterState({ select: (state) => state.location })
  const pathname = location.pathname
  const activeGrammar = grammarNames.find((grammar) => pathname === `/styleguide/${grammar}`)
  const activeTheme = typeof location.search.theme === 'string' ? location.search.theme : undefined
  const viscousKinetic = activeGrammar === 'kinetic' && activeTheme === 'viscous'

  return (
    <div className={className(sharedStyles.siteShell)}>
      <header
        className={className(
          sharedStyles.siteHeader,
          headerStyle(activeGrammar),
          viscousKinetic && sharedStyles.headerKineticViscous,
        )}
      >
        <Link
          className={className(
            sharedStyles.wordmark,
            activeGrammar === 'print' && sharedStyles.wordmarkPrint,
            activeGrammar === 'mosaic' && sharedStyles.wordmarkMosaic,
            activeGrammar === 'kinetic' && sharedStyles.wordmarkInstrument,
          )}
          to="/"
        >
          hifi
        </Link>
        <nav aria-label="Grammar styleguides" className={className(sharedStyles.siteNav)}>
          {grammarNames.map((grammar) => (
            <Link
              activeProps={{
                'aria-current': 'page',
                className: className(
                  sharedStyles.navLink,
                  navStyle(activeGrammar),
                  viscousKinetic && sharedStyles.navKineticViscous,
                  sharedStyles.navLinkActive,
                  activeNavStyle(activeGrammar),
                  viscousKinetic && sharedStyles.navKineticViscousActive,
                ),
              }}
              className={className(
                sharedStyles.navLink,
                navStyle(activeGrammar),
                viscousKinetic && sharedStyles.navKineticViscous,
              )}
              key={grammar}
              search={{ theme: undefined }}
              to={`/styleguide/${grammar}`}
            >
              {grammarRegistry[grammar].label}
            </Link>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

function LandingPage() {
  return (
    <main>
      <section className={className(sharedStyles.landingContainer, sharedStyles.landingHero)}>
        <p className={className(sharedStyles.eyebrow)}>Interface material studies</p>
        <h1 className={className(sharedStyles.landingTitle)}>High-fidelity design grammars</h1>
        <p className={className(sharedStyles.landingCopy)}>
          hifi packages coherent visual languages as typed React libraries. Explore the material,
          themes, components, and behavior of each grammar.
        </p>
      </section>

      <section
        aria-labelledby="grammar-heading"
        className={className(sharedStyles.landingContainer, sharedStyles.grammarIndex)}
      >
        <div className={className(sharedStyles.sectionHeading)}>
          <p className={className(sharedStyles.eyebrow)}>The collection</p>
          <h2 className={className(sharedStyles.sectionHeadingTitle)} id="grammar-heading">
            Five material systems
          </h2>
        </div>
        <div className={className(sharedStyles.grammarGrid)}>
          {grammarNames.map((grammar) => {
            const definition = grammarRegistry[grammar]

            return (
              <Link
                className={className(
                  sharedStyles.grammarCard,
                  grammar === 'liquid' || grammar === 'texture' || grammar === 'print'
                    ? sharedStyles.grammarCardThird
                    : sharedStyles.grammarCardHalf,
                  grammarCardStyle(grammar),
                )}
                key={grammar}
                search={{ theme: undefined }}
                to={`/styleguide/${grammar}`}
              >
                <span className={className(sharedStyles.eyebrow)}>{definition.status}</span>
                <h3 className={className(sharedStyles.grammarCardTitle)}>{definition.label}</h3>
                <p className={className(sharedStyles.grammarCardCopy)}>{definition.description}</p>
                <span className={className(sharedStyles.cardAction)}>Open styleguide →</span>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <main className={className(sharedStyles.landingContainer, sharedStyles.notFound)}>
      <p className={className(sharedStyles.eyebrow)}>404</p>
      <h1 className={className(sharedStyles.notFoundTitle)}>That surface does not exist.</h1>
      <Link className={className(globalStyles.link)} to="/">
        Return to the grammar index
      </Link>
    </main>
  ),
})

function headerStyle(grammar: (typeof grammarNames)[number] | undefined) {
  switch (grammar) {
    case 'liquid':
      return sharedStyles.headerLiquid
    case 'texture':
      return sharedStyles.headerTexture
    case 'print':
      return sharedStyles.headerPrint
    case 'mosaic':
      return sharedStyles.headerMosaic
    case 'kinetic':
      return sharedStyles.headerKinetic
    default:
      return undefined
  }
}

function navStyle(grammar: (typeof grammarNames)[number] | undefined) {
  switch (grammar) {
    case 'liquid':
      return sharedStyles.navLiquid
    case 'texture':
      return sharedStyles.navTexture
    case 'print':
      return sharedStyles.navPrint
    case 'mosaic':
      return sharedStyles.navMosaic
    case 'kinetic':
      return sharedStyles.navKinetic
    default:
      return undefined
  }
}

function activeNavStyle(grammar: (typeof grammarNames)[number] | undefined) {
  switch (grammar) {
    case 'liquid':
      return sharedStyles.navLiquidActive
    case 'texture':
      return sharedStyles.navTextureActive
    case 'print':
      return sharedStyles.navPrintActive
    case 'mosaic':
      return sharedStyles.navMosaicActive
    case 'kinetic':
      return sharedStyles.navKineticActive
    default:
      return undefined
  }
}

function grammarCardStyle(grammar: (typeof grammarNames)[number]) {
  switch (grammar) {
    case 'liquid':
      return sharedStyles.cardLiquid
    case 'texture':
      return sharedStyles.cardTexture
    case 'print':
      return sharedStyles.cardPrint
    case 'mosaic':
      return sharedStyles.cardMosaic
    case 'kinetic':
      return sharedStyles.cardKinetic
  }
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

export const liquidRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'styleguide/liquid',
  validateSearch: (search: Record<string, unknown>) => ({
    theme: typeof search.theme === 'string' ? search.theme : undefined,
  }),
  component: LiquidStyleguide,
})

export const textureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'styleguide/texture',
  validateSearch: (search: Record<string, unknown>) => ({
    theme: typeof search.theme === 'string' ? search.theme : undefined,
  }),
  component: TextureStyleguide,
})

export const printRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'styleguide/print',
  validateSearch: (search: Record<string, unknown>) => ({
    theme: typeof search.theme === 'string' ? search.theme : undefined,
  }),
  component: PrintStyleguide,
})

export const mosaicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'styleguide/mosaic',
  validateSearch: (search: Record<string, unknown>) => ({
    theme: typeof search.theme === 'string' ? search.theme : undefined,
  }),
  component: MosaicStyleguide,
})

export const kineticRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'styleguide/kinetic',
  validateSearch: (search: Record<string, unknown>) => ({
    theme: typeof search.theme === 'string' ? search.theme : undefined,
  }),
  component: KineticStyleguide,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  liquidRoute,
  textureRoute,
  printRoute,
  mosaicRoute,
  kineticRoute,
])

export const router = createRouter({
  defaultPreload: 'intent',
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
