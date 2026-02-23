import { $ } from "bun"

await $`mkdir -p .output/public`

// Step 1: Let Bun bundle everything (HTML, JS, CSS)
// Bun will produce a hashed CSS file, but its content will be broken
// because Bun's CSS parser does not support Tailwind v4 syntax (@theme inline, @custom-variant)
await $`bun build public/index.html --outdir .output/public --tsconfig-override tsconfig.json`

// Step 2: Find the hashed CSS filename Bun produced
const outputFiles = await Array.fromAsync(
  new Bun.Glob("*.css").scan(".output/public"),
)
if (outputFiles.length === 0)
  throw new Error("No CSS file found in .output/public")
const hashedCss = outputFiles[0]

// Step 3: Overwrite the broken CSS with correct output from Tailwind CLI
// This preserves the hashed filename so index.html href stays valid
await $`bunx @tailwindcss/cli -i src/app/assets/css/main.css -o .output/public/${hashedCss} --minify`

// Step 4: Compile server binary
await $`bun build --compile --target bun --outfile .output/server src/index.ts`

console.log("Build complete. Run with: cd .output && ./server")
