// TODO: Frontend mount point
import { createRoot } from "react-dom/client"
import { App } from "@/app"
import { createLogger } from "@/shared/utils/logger"

const console = createLogger("frontend")

const entry = document.getElementById("app")

if (!entry) {
  console.error("Entry point not found")
  throw new Error("Entry point not found")
}

const root = createRoot(entry)

root.render(<App />)
