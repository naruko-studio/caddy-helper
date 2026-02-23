import {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react"

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_LAYOUT_NAME = "default" as const

// ─── Layout Module Type Guard ─────────────────────────────────────────────────

function isLayoutModule(
  value: unknown,
): value is { default: ComponentType<{ children: ReactNode }> } {
  return (
    typeof value === "object" &&
    value !== null &&
    "default" in value &&
    typeof (value as Record<string, unknown>).default === "function"
  )
}

// ─── Layout Map ───────────────────────────────────────────────────────────────

// Relative to src/app/providers/ → resolves to src/app/layouts/
const rawLayoutModules = import.meta.glob("../layouts/*.tsx", { eager: true })

const layoutMap = new Map<string, ComponentType<{ children: ReactNode }>>()

for (const [filePath, module] of Object.entries(rawLayoutModules)) {
  if (!isLayoutModule(module)) continue

  const name = filePath.replace(/^\.\.\/layouts\//, "").replace(/\.tsx$/, "")

  layoutMap.set(name, module.default)
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LayoutContext = createContext<Map<
  string,
  ComponentType<{ children: ReactNode }>
> | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

type LayoutProviderProps = {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={layoutMap}>
      {children}
    </LayoutContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLayouts(): Map<
  string,
  ComponentType<{ children: ReactNode }>
> {
  const context = useContext(LayoutContext)
  if (!context) throw new Error("useLayouts must be used within LayoutProvider")
  return context
}

// ─── Resolver ─────────────────────────────────────────────────────────────────

export function resolveLayout(
  layouts: Map<string, ComponentType<{ children: ReactNode }>>,
  name: string | undefined,
): ComponentType<{ children: ReactNode }> | null {
  return (
    layouts.get(name ?? DEFAULT_LAYOUT_NAME) ??
    layouts.get(DEFAULT_LAYOUT_NAME) ??
    null
  )
}
