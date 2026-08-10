import * as stylex from '@stylexjs/stylex'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './router'
import 'virtual:hifi-stylex.css'
import { globalStyles } from './stylex/shared.stylex'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The styleguide root element is missing.')
}

document.documentElement.className = stylex.props(globalStyles.html).className ?? ''
document.body.className = stylex.props(globalStyles.body).className ?? ''
rootElement.className = stylex.props(globalStyles.root).className ?? ''

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
