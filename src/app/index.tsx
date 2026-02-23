import { ThemeProvider } from "./providers/theme"
import { LayoutProvider } from "./providers/layout"
import { PageProvider } from "./providers/page"

import "@/app/assets/css/main.css"

// Frontend Real Entry Point
export const App = () => {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <PageProvider />
      </LayoutProvider>
    </ThemeProvider>
  )
}
