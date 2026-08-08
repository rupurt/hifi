import { Link, Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { GrammarPage } from './GrammarPage'
import { grammarNames, grammarRegistry } from './grammars'

function RootLayout() {
  return (
    <div className="site-shell">
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
              params={{ grammar }}
              search={{ theme: undefined }}
              to="/styleguide/$grammar"
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
        <h1>High-fidelity grammars for multi-dimensional interfaces.</h1>
        <p className="hero-copy">
          hifi packages coherent visual languages as typed React libraries. Explore the material,
          themes, components, and behavior of each grammar.
        </p>
      </section>

      <section aria-labelledby="grammar-heading" className="grammar-index">
        <div className="section-heading">
          <p className="eyebrow">The collection</p>
          <h2 id="grammar-heading">Three starting points</h2>
        </div>
        <div className="grammar-grid">
          {grammarNames.map((grammar) => {
            const definition = grammarRegistry[grammar]

            return (
              <Link
                className={`grammar-card grammar-card-${grammar}`}
                key={grammar}
                params={{ grammar }}
                search={{ theme: undefined }}
                to="/styleguide/$grammar"
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

export const grammarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'styleguide/$grammar',
  validateSearch: (search: Record<string, unknown>) => ({
    theme: typeof search.theme === 'string' ? search.theme : undefined,
  }),
  component: GrammarPage,
})

const routeTree = rootRoute.addChildren([indexRoute, grammarRoute])

export const router = createRouter({
  defaultPreload: 'intent',
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
