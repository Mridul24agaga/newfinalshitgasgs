export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000, backoff = 2): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }
    await sleep(delay)
    return retry(fn, retries - 1, delay * backoff, backoff)
  }
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs),
    ),
  ])
}

