import { Composer } from 'grammy';
import type { Context } from '../../common/context';
import { handleLogMiddleware } from '../../middlewares/logging.middleware';
import { unhandledCallbackQueries, unhandledMessages } from './unhandled.service';

const composer = new Composer<Context>();
const filtered = composer.chatType('private');

filtered.on('message', handleLogMiddleware('unhandled-message'), unhandledMessages);
filtered.on(
  'callback_query',
  handleLogMiddleware('unhandled-callback-query'),
  unhandledCallbackQueries,
);

export { composer as unhandledModule };
