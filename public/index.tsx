// TODO: Frontend mount point
import { createRoot } from "react-dom/client"
import {App} from "@/app"

const entry = document.getElementById("app")

if (!entry) {
  throw new Error("Entry point not found")
}

const root = createRoot(entry)

root.render(<App />)