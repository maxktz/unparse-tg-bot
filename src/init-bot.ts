import { hydrate } from '@grammyjs/hydrate';
import { parseMode } from '@grammyjs/parse-mode';
import { Bot } from 'grammy';
import { type Context, createContextConstructor } from './common/context';
import { env } from './common/env';
import { errorHandler } from './common/error';
import { logger } from './helpers/logger';
import { homeModule } from './modules/home/home.module';
import { unhandledModule } from './modules/unhandled/unhandled.module';
import { unparseModule } from './modules/unparse/unparse.module';

export function initBot() {
  // Initialize the bot
  const bot = new Bot<Context>(env.BOT_TOKEN, {
    ContextConstructor: createContextConstructor({ logger, env }),
  });

  // Bot Configs
  bot.api.config.use(parseMode('HTML'));

  // Protected instance for middlewares and modules
  const protectedBot = bot.errorBoundary(errorHandler);

  // Use the middleware
  // if (env.ENVIRONMENT === 'development') protectedBot.use(updateLoggingMiddleware);
  protectedBot.use(hydrate());

  // Add Modules
  protectedBot.use(homeModule);
  protectedBot.use(unparseModule);
  protectedBot.use(unhandledModule); // should always be the last

  // Return the bot instance
  return bot;
}
