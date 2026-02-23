// TODO: Main Entry Point
import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"
import { openapi, fromTypes } from "@elysiajs/openapi"
import { createLogger } from "@/shared/utils/logger"

const console = createLogger("core")

console.debug("Creating Elysia instance")
const app = new Elysia()
console.debug("Initializing plugins")
console.debug("Initializing OpenAPI plugin")
app.use(openapi({ references: fromTypes() }))
console.debug("OpenAPI plugin initialized")
console.debug("Initializing static plugin")
app.use(await staticPlugin({ prefix: "/" }))
console.debug("Static plugin initialized")

console.debug("Starting server...")
app.listen(3000, (server) => {
  console.box(
    `🦊 Elysia as Fullstack Framework 🚀\nServer started with BPM ${server.port}\nLet's goooooooo!\n-> local: ${server.url}`,
  )
})
