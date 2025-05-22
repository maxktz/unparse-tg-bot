/**
 * Could be replaced with more complex logger while not using Cloudflare Workers
 */
export const logger = console;
export type Logger = typeof logger;
