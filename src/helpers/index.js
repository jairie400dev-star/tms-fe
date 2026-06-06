// Re-exports the utils plus a couple of generic helpers, so callers can import
// everything from one place (@/helpers).
export * from '@/utils'

// No-op callback for optional handlers/defaults.
export const noOp = () => {}

// Promise-based delay, handy for debouncing or simulating latency.
export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))
