import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  useRouterState,
  type AnyRoute,
} from "@tanstack/react-router"
import { Fragment } from "react"
import { resolveLayout, useLayouts } from "./layout"

// ─── Page Module Type Guard ───────────────────────────────────────────────────

function isPageModule(value: unknown): value is PageModule {
  return (
    typeof value === "object" &&
    value !== null &&
    "default" in value &&
    typeof (value as Record<string, unknown>).default === "function"
  )
}

// ─── Path Conversion ──────────────────────────────────────────────────────────

function filePathToRoute(filePath: string): string {
  return (
    filePath
      .replace(/^\.\.\/pages/, "")
      .replace(/\.tsx$/, "")
      .replace(/\/index$/, "") || "/"
  )
}

// ─── Page Modules ─────────────────────────────────────────────────────────────

// Relative to src/app/providers/ → resolves to src/app/pages/
const rawPageModules = import.meta.glob("../pages/**/*.tsx", { eager: true })

// route path → layout name (built alongside route tree)
const routeToLayout = new Map<string, string | undefined>()

// ─── Root Layout ──────────────────────────────────────────────────────────────

function RootLayout() {
  const routerState = useRouterState()
  const layouts = useLayouts()

  const currentPathname = routerState.location.pathname
  const layoutName = routeToLayout.get(currentPathname)

  const Layout = resolveLayout(layouts, layoutName) ?? Fragment

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

// ─── Route Tree ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootLayout,
})

const childRoutes: AnyRoute[] = Object.entries(rawPageModules).flatMap(
  ([filePath, module]) => {
    if (!isPageModule(module)) return []

    const path = filePathToRoute(filePath)
    routeToLayout.set(path, module.meta?.layout)

    return createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: module.default,
    })
  },
)

const routeTree = rootRoute.addChildren(childRoutes)

// ─── Router (module-level, not recreated on re-render) ────────────────────────

const router = createRouter({ routeTree })

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PageProvider() {
  return <RouterProvider router={router} />
}
