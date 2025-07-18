export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
      const { log } = await import('@/lib/logger');
      globalThis.log = log;
    }
}
