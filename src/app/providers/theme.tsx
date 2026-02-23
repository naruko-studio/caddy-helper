import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

// ─── Constants ───────────────────────────────────────────────────────────────

const DARK_THEME_LIST = ["frappe", "macchiato", "mocha"] as const
const LIGHT_THEME = "latte" as const

const COOKIE_KEY_MODE = "mode"
const COOKIE_KEY_DARK = "dark"

const DEFAULT_MODE = "auto" as const
const DEFAULT_DARK_THEME = "mocha" as const

// ─── Types ───────────────────────────────────────────────────────────────────

type DarkTheme = (typeof DARK_THEME_LIST)[number]
type ThemeMode = "light" | "dark" | "auto"

type ThemeContextValue = {
  mode: ThemeMode
  darkTheme: DarkTheme
  setMode: (mode: ThemeMode) => void
  setDarkTheme: (theme: DarkTheme) => void
  resetToAuto: () => void
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

function getCookie(key: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

function setCookie(key: string, value: string): void {
  const ttl = 60 * 60 * 24 * 365 * 5
  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${ttl}; SameSite=Strict`
}

function deleteCookie(key: string): void {
  document.cookie = `${key}=; path=/; max-age=0`
}

// ─── Type Guards ──────────────────────────────────────────────────────────────

function isThemeMode(value: string): value is ThemeMode {
  return value === "light" || value === "dark" || value === "auto"
}

function isDarkTheme(value: string): value is DarkTheme {
  return (DARK_THEME_LIST as readonly string[]).includes(value)
}

// ─── Cookie Readers ───────────────────────────────────────────────────────────

function readModeFromCookie(): ThemeMode {
  const raw = getCookie(COOKIE_KEY_MODE)
  if (raw && isThemeMode(raw)) return raw
  return DEFAULT_MODE
}

function readDarkThemeFromCookie(): DarkTheme {
  const raw = getCookie(COOKIE_KEY_DARK)
  if (raw && isDarkTheme(raw)) return raw
  return DEFAULT_DARK_THEME
}

// ─── HTML Class Injector ──────────────────────────────────────────────────────

function applyThemeToHtml(mode: ThemeMode, darkTheme: DarkTheme): void {
  const allThemes = [...DARK_THEME_LIST, LIGHT_THEME]
  document.documentElement.classList.remove(...allThemes)

  if (mode === "light") {
    document.documentElement.classList.add(LIGHT_THEME)
    return
  }

  if (mode === "dark") {
    document.documentElement.classList.add(darkTheme)
    return
  }

  // auto — follow system
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  document.documentElement.classList.add(prefersDark ? darkTheme : LIGHT_THEME)
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(readModeFromCookie)
  const [darkTheme, setDarkThemeState] = useState<DarkTheme>(
    readDarkThemeFromCookie,
  )

  // Refresh cookies on mount to extend expiry
  useEffect(() => {
    setCookie(COOKIE_KEY_MODE, mode)
    setCookie(COOKIE_KEY_DARK, darkTheme)
  }, [])

  // Apply theme on mount and whenever mode/darkTheme changes
  useEffect(() => {
    applyThemeToHtml(mode, darkTheme)
  }, [mode, darkTheme])

  // Listen to system preference changes when mode is "auto"
  useEffect(() => {
    if (mode !== "auto") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    function handleSystemChange(): void {
      applyThemeToHtml("auto", darkTheme)
    }

    mediaQuery.addEventListener("change", handleSystemChange)
    return () => mediaQuery.removeEventListener("change", handleSystemChange)
  }, [mode, darkTheme])

  function setMode(newMode: ThemeMode): void {
    setCookie(COOKIE_KEY_MODE, newMode)
    setModeState(newMode)
  }

  function setDarkTheme(newTheme: DarkTheme): void {
    setCookie(COOKIE_KEY_DARK, newTheme)
    setDarkThemeState(newTheme)
  }

  function resetToAuto(): void {
    deleteCookie(COOKIE_KEY_MODE)
    setModeState(DEFAULT_MODE)
  }

  return (
    <ThemeContext.Provider
      value={{ mode, darkTheme, setMode, setDarkTheme, resetToAuto }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
