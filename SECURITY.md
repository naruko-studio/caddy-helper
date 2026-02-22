# Security Policy

> **Repository**: [naruko-studio/caddy-helper](https://github.com/narugu-studio/caddy-helper) — A Caddy reverse proxy management helper, inspired by nginx-proxy-manager, built with Elysia Fullstack.

## Supported Versions

The following versions of **caddy-helper** are currently receiving security updates:

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ Yes |
| Older releases | ❌ No |

We recommend always using the latest version.

---

## Reporting a Vulnerability

  **Please do NOT report security vulnerabilities through public GitHub Issues.**

  Because caddy-helper manages server-level reverse proxy configurations and can directly affect network routing, security issues are treated with high priority.

  To report a security issue, please use one of the following methods:

  1. **GitHub Private Vulnerability Reporting** *(preferred)*:
  Navigate to [Security → Report a vulnerability](https://github.com/naruko-studio/caddy-helper/security/advisories/new) on this repository.

  2. **Direct Contact**:
  Contact the maintainer directly through their [GitHub profile](https://github.com/naruko-studio).

### What to Include

  When reporting, please provide as much of the following as possible:

  - Type of vulnerability (e.g., injection, path traversal, auth bypass, Caddy config injection)
  - Affected component and version
  - Step-by-step reproduction instructions
  - Proof-of-concept or exploit code (if available)
  - Potential impact assessment (e.g., unauthorized proxy rule modification, SSRF, privilege escalation)

### Response Timeline

  | Stage | Timeframe |
  |---|---|
  | Acknowledgment | Within **48 hours** |
  | Initial assessment | Within **7 days** |
  | Patch / Resolution | Depends on severity |

  We will keep you informed throughout the process and will credit your disclosure in the release notes (unless you prefer to remain anonymous).

---

## Security Considerations for This Project

Since caddy-helper generates and applies Caddy configurations:

- **Config injection**: Ensure user inputs are sanitized before being written to Caddy config
- **SSRF risks**: Validate upstream proxy targets to prevent server-side request forgery
- **Authentication**: Protect the management API — do not expose it to the public internet without auth
- **Caddy Admin API**: By default, Caddy's admin API runs locally; ensure it is not inadvertently exposed

---

## Security Best Practices for Contributors

  When contributing code to this project:

  - Do not hard-code credentials, tokens, or secrets
  - Validate and sanitize all user inputs, especially proxy target URLs and hostnames
  - Avoid using deprecated or vulnerable dependencies
  - Run `bun audit` (or equivalent) before submitting PRs
  - Be cautious with any code that writes to or reads from Caddy's admin API

---

## 🤖 AI-Generated Content Policy (Security Context)

> **Warning**: AI-generated security-related code or documentation carries higher risk and requires stricter review.

Security contributors using AI assistance **must**:

1. **Manually verify** all generated logic — do not trust AI output for security-critical paths
2. **State clearly** in the PR which parts were AI-assisted
3. **Perform threat modeling** on AI-generated suggestions before adopting them
4. **Never rely solely on AI** to identify or fix security vulnerabilities

AI tools may not be aware of the latest CVEs, Caddy-specific security considerations, or context-specific risks. Human expertise is required for all security decisions.
