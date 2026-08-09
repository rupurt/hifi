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
import { PrintStyleguide } from './PrintStyleguide'
import { SignalStyleguide } from './SignalStyleguide'
import { TextureStyleguide } from './TextureStyleguide'

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const activeGrammar = grammarNames.find((grammar) => pathname === `/styleguide/${grammar}`)

  return (
    <div className={`site-shell${activeGrammar ? ` site-shell-${activeGrammar}` : ''}`}>
      <header className="site-header">
        <Link className="wordmark" to="/">
          hifi
        </Link>
        <nav aria-label="Grammar styleguides" className="site-nav">
          {grammarNames.map((grammar) => (
            <Link
              activeProps={{ 'aria-current': 'page', className: 'nav-link nav-link-active' }}
              className="nav-link"
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
      <section className="hero">
        <p className="eyebrow">Interface material studies</p>
        <h1>High-fidelity design grammars</h1>
        <p className="hero-copy">
          hifi packages coherent visual languages as typed React libraries. Explore the material,
          themes, components, and behavior of each grammar.
        </p>
      </section>

      <section aria-labelledby="grammar-heading" className="grammar-index">
        <div className="section-heading">
          <p className="eyebrow">The collection</p>
          <h2 id="grammar-heading">Five material systems</h2>
        </div>
        <div className="grammar-grid">
          {grammarNames.map((grammar) => {
            const definition = grammarRegistry[grammar]

            return (
              <Link
                className={`grammar-card grammar-card-${grammar}`}
                key={grammar}
                search={{ theme: undefined }}
                to={`/styleguide/${grammar}`}
              >
                <span className="grammar-status">{definition.status}</span>
                <h3>{definition.label}</h3>
                <p>{definition.description}</p>
                <span className="card-action">Open styleguide →</span>
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
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>That surface does not exist.</h1>
      <Link to="/">Return to the grammar index</Link>
    </main>
  ),
})

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

export const signalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'styleguide/signal',
  validateSearch: (search: Record<string, unknown>) => ({
    theme: typeof search.theme === 'string' ? search.theme : undefined,
  }),
  component: SignalStyleguide,
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
  signalRoute,
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
