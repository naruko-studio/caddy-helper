# Contributing to caddy-helper

> **Repository**: [naruko-studio/caddy-helper](https://github.com/naruko-studio/caddy-helper)
> **Stack**: Elysia Fullstack (ElysiaJS + Bun)
> **About**: A helper tool for [Caddy](https://caddyserver.com/) to create and manage reverse proxy configurations, inspired by [nginx-proxy-manager](https://nginxproxymanager.com/).

Thank you for your interest in contributing! This document provides guidelines for contributing to **caddy-helper**.

---

## 🤖 AI-Generated Content Policy

  > **AI assistance is welcome**, but contributors must verify all AI-generated content before submitting.

  **Requirements for AI-assisted contributions:**

  | Requirement | Details |
  |---|---|
  | ✅ Disclose AI use | Mention in PR description (e.g., "Generated with GitHub Copilot / ChatGPT") |
  | ✅ Human review | You must read, understand, and verify every line |
  | ✅ Test code | All AI-generated code must pass tests and be manually verified |
  | ✅ Own the content | You are fully responsible for the accuracy of submitted work |
  | ❌ No blind paste | Do not submit AI output without understanding it |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- Node.js >= 18 (optional, for tooling)
- **Caddy** (custom build with Cloudflare DNS plugin — see below)

#### Caddy Build Requirement

This project uses [Cloudflare DNS challenge](https://caddyserver.com/docs/automatic-https#dns-challenge) for TLS certificate issuance. The standard Caddy binary **does not** include this plugin.

You must build Caddy with the [`caddy-dns/cloudflare`](https://github.com/caddy-dns/cloudflare) module using [xcaddy](https://github.com/caddyserver/xcaddy):

```bash
# Install xcaddy
go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest

# Build Caddy with Cloudflare DNS plugin
xcaddy build --with github.com/caddy-dns/cloudflare
```

> Alternatively, download a pre-built binary from [Caddy's download page](https://caddyserver.com/download) and select the **cloudflare** DNS provider module.

You will also need a Cloudflare API token with `Zone:DNS:Edit` permissions for the DNS challenge to work.

### Setup

```bash
# Clone the repository
git clone https://github.com/naruko-studio/caddy-helper.git
cd caddy-helper

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
caddy-helper/
├── public/              # Frontend entry (served by Bun bundler)
│   ├── index.html       # HTML shell
│   └── index.tsx        # React mount point
├── src/                 # Elysia Fullstack source
│   ├── index.ts         # Main entry point (Elysia server)
│   ├── api/             # Backend API routes
│   │   └── index.ts     # API entry — imported by src/index.ts
│   ├── app/             # Frontend React app
│   │   ├── index.tsx    # Frontend real entry / root component
│   │   ├── components/  # UI components
│   │   ├── layouts/     # Page layouts
│   │   └── pages/       # Page components
│   └── shared/          # Shared types/utilities (frontend + backend)
├── package.json
└── tsconfig.json        # Path aliases: @/* and ~/* → src/*
```

---

## How to Contribute

### Reporting Bugs

1. Check existing [Issues](https://github.com/naruko-studio/caddy-helper/issues) to avoid duplicates
2. Open a new issue and include:
  - Your environment (OS, Bun version, Caddy version)
  - Steps to reproduce expected vs actual behavior
  - Relevant logs or Caddy config output

### Suggesting Features

1. Open a [Feature Request](https://github.com/naruko-studio/caddy-helper/issues/new) on GitHub
2. Describe the Caddy/proxy management problem you're solving and your proposed solution
3. Reference nginx-proxy-manager features if applicable for comparison

### Submitting Pull Requests

1. **Fork** [naruko-studio/caddy-helper](https://github.com/naruko-studio/caddy-helper) and create a feature branch:
```bash
git checkout -b feat/my-feature
```
2. **Make your changes** and ensure the code is clean
3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(proxy): add wildcard domain support
fix(caddy): resolve config generation for nested routes
docs: update contributing guide
```
4. **Push** and open a Pull Request against `main`
5. Fill out the PR template, including any AI assistance disclosure

### Commit Message Format

```
<type>(<scope>): <description> (#issue)
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

**Common scopes:** `proxy`, `caddy`, `api`, `ui`, `auth`, `config`

---

## Code Style

  - Use **TypeScript** strict mode
  - Follow existing code patterns in `src/`
  - Keep functions small and focused
  - Add JSDoc comments for public APIs
  - Validate all Caddy config output before exposing via API

### Type Definitions — Extract to Shared Types

  Type definitions (`type`, `interface`) that are **not** derived from a runtime value must be extracted to:

```
src/shared/types/<name>.d.ts
```

  This keeps runtime logic and type declarations cleanly separated across the codebase.

```typescript
// ✅ Correct — type lives in src/shared/types/theme.d.ts
type ThemeMode = "light" | "dark" | "auto"
```

```typescript
// ❌ Incorrect — type defined inline inside a .tsx / .ts file
type ThemeMode = "light" | "dark" | "auto"

function applyTheme(mode: ThemeMode): void { ... }
```

  **Exception — `typeof`-inferred types**

  When a type is derived directly from a runtime variable via `typeof`, it **must stay inline, co-located with its source variable**. Moving it to a `.d.ts` file would require duplicating the value or break the derivation entirely.

```typescript
// ✅ Correct — inline, immediately after the constant it depends on
const DARK_THEME_LIST = ["frappe", "macchiato", "mocha"] as const
type DarkTheme = (typeof DARK_THEME_LIST)[number]

// ❌ Incorrect — copied manually into .d.ts, now out-of-sync risk
// src/shared/types/theme.d.ts
type DarkTheme = "frappe" | "macchiato" | "mocha"
```

  > Rule of thumb: if defining the type requires referencing a `const` variable, keep it inline next to that variable.

### Coding Principles

#### Naming — No Excessive Abbreviation

  Use clear, descriptive names. Never sacrifice readability for brevity.

  - ❌ `t` — ambiguous (conflicts with i18n convention for translation functions)
  - ✅ `theme`, `translate`, `token` — explicit and unambiguous
  - ❌ `cfg`, `req`, `res`, `cb` for non-trivial variables
  - ✅ `config`, `request`, `response`, `callback`

  > If a name needs a comment to explain what it is, the name is wrong.

  **i18n translation functions must be aliased:**

  Many i18n libraries (e.g., `react-i18next`, `vue-i18n`) expose a `t` shorthand for translation. This project **does not** use bare `t` — always import with an explicit alias:

```typescript
// ❌ Forbidden — t is ambiguous
import { useTranslation } from "react-i18next"
const { t } = useTranslation()

// ✅ Required — alias to make intent clear
import { useTranslation } from "react-i18next"
const { t: translate } = useTranslation()

// Usage
translate("common.submit")
```

#### `as const` — Readonly Only

  Only use `as const` when the value must be **truly readonly** and inferred as a literal type. Do not use it as a shortcut to suppress type errors.

```typescript
// ✅ Appropriate — defining a fixed set of string literals
const PROXY_MODES = ["http", "https", "tcp"] as const

// ❌ Inappropriate — used to avoid typing the type properly
const config = { port: 3000 } as const
```

#### No `as any` / `as <Type>` — Use Schema Validation or Type Guards

  Type casting with `as any` or `as SomeType` bypasses the type system entirely. **Never use these patterns.**

```typescript
// ❌ Forbidden
const result = response as ProxyConfig

// ❌ Forbidden
function handle(input: unknown) {
  return (input as any).host
}
```

  User-defined type guard predicates (`value is T`) are **only as safe as their implementation** — TypeScript trusts the return value without verifying the body is complete. Prefer schema-based validation:

---

**Backend — use Elysia's built-in `t` (TypeBox)**

Elysia has `t` built-in for route-level schema validation. It provides both compile-time types and runtime validation in one step.

> ⚠️ **Naming note**: Elysia's `t` conflicts with the common i18n convention (where `t` means translate).
> Import it explicitly with an alias to avoid ambiguity:

```typescript
import { Elysia, t as schema } from "elysia"

new Elysia().post("/proxy", ({ body }) => {
  // body is fully typed and runtime-validated
  return body.host
}, {
  body: schema.Object({
    host: schema.String(),
    port: schema.Number(),
  })
})
```

---

  **Frontend / Shared — use Zod** *(install when needed)*

  Zod is not pre-installed. Add it only when you need runtime validation outside of Elysia routes (e.g., parsing API responses on the frontend, reading config files).

```bash
bun add zod
```

```typescript
import { z } from "zod"

const ProxyConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
})

// Throws on invalid input — no manual guard needed
const config = ProxyConfigSchema.parse(rawInput)
// config is fully typed as { host: string; port: number }
```

---

**When type guards are still appropriate**

Use manual type guards only for simple, internal narrowing where the shape is already trusted (e.g., discriminated unions):

```typescript
type Result = { ok: true; data: ProxyConfig } | { ok: false; error: string }

function handle(result: Result) {
  if (result.ok) {
    return result.data.host  // ✅ Safe — discriminated union
  }
  throw new Error(result.error)
}
```

---

## Running Tests

```bash
bun test
```

  > Currently, tests are configured with `bun test`. Please add tests for any new proxy configuration logic.

---

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.
