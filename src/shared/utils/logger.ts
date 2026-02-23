import { createConsola } from "consola"
import { isDevelopment } from "std-env"

const logger = createConsola({
  fancy: true,
  defaults: {
    tag: "caddy-helper",
  },
  formatOptions: {
    date: true,
    compact: true,
    colors: true,
  },
  level: isDevelopment ? 5 : 3,
})

export const createLogger = (tag?: string) =>
  tag ? logger.withTag(tag) : logger
