import { afterEach, expect, test, vi } from 'vitest'
import { valibotSearchValidator } from '../src'
import * as v from 'valibot'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  RouterProvider,
} from '@tanstack/react-router'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  vi.resetAllMocks()
  window.history.replaceState(null, 'root', '/')
  cleanup()
})

test('when navigating to a route with valibotSearchValidator', async () => {
  const rootRoute = createRootRoute()

  const Index = () => {
    return (
      <>
        <h1>Index</h1>
        <Link<typeof router, string, '/invoices'>
          to="/invoices"
          search={{
            page: 0,
          }}
        >
          To Invoices
        </Link>
      </>
    )
  }

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Index,
  })

  const Invoices = () => {
    const search = invoicesRoute.useSearch()

    return (
      <>
        <h1>Invoices</h1>
        <span>Page: {search.page}</span>
      </>
    )
  }

  const invoicesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'invoices',
    validateSearch: valibotSearchValidator(
      v.object({
        page: v.number(),
      }),
    ),
    component: Invoices,
  })

  const routeTree = rootRoute.addChildren([indexRoute, invoicesRoute])
  const router = createRouter({ routeTree })

  render(<RouterProvider router={router} />)

  const invoicesLink = await screen.findByRole('link', {
    name: 'To Invoices',
  })

  fireEvent.click(invoicesLink)

  expect(await screen.findByText('Page: 0')).toBeInTheDocument()
})