import { Composer } from 'grammy';
import type { Context } from '../../common/context';
import { handleLogMiddleware } from '../../middlewares/logging.middleware';
import { sendHome, startCommand } from './home.service';

const composer = new Composer<Context>();
const filtered = composer.chatType('private');

filtered.command('start', handleLogMiddleware('start-command'), startCommand);
filtered.callbackQuery('home', handleLogMiddleware('home-callback-query'), sendHome);

export { composer as homeModule };
