import { ThemeProvider } from "./providers/theme"

import "@/app/assets/css/main.css"

// Frontend Real Entry Point
export const App = () => {
  return <ThemeProvider>{/* routing will be added in feature/frontend/routing */}</ThemeProvider>
}
