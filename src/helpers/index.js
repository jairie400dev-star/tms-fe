export * from '@/utils'

export const noOp = () => {}

export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))
