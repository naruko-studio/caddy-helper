import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import css from "@eslint/css"
import { defineConfig } from "eslint/config"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    files: ["**/*.css"],
    // TODO: remove once @eslint/css fixes CSSRuleDefinition → RuleDefinition type incompatibility
    // @ts-expect-error — upstream type bug in @eslint/css@0.14.1: CSSRuleDefinition is not assignable to RuleDefinition
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  eslintPluginPrettierRecommended,
])
