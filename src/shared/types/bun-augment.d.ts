// Type augmentation for Bun's import.meta.glob
// Bun supports import.meta.glob (similar to Vite), but bun-types does not
// include the type definition yet.

interface ImportMeta {
  glob(pattern: string, options: { eager: true }): Record<string, unknown>
  glob(
    pattern: string,
    options?: { eager?: false },
  ): Record<string, () => Promise<unknown>>
}
