import type { ReactNode } from "react"

// ─── Global Page Types ────────────────────────────────────────────────────────

declare global {
  type PageMeta = {
    layout?: string
  }

  type PageModule = {
    default: () => ReactNode
    meta?: PageMeta
  }
}

export {}
