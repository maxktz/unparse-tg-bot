import { Composer } from 'grammy';
import type { Context } from '../../common/context';
import { handleLogMiddleware } from '../../middlewares/logging.middleware';
import { unparseHandler } from './unparse.service';

const composer = new Composer<Context>();
const filtered = composer.chatType('private');

filtered.on(['message:text', 'message:caption'], handleLogMiddleware('unparse'), unparseHandler);

export { composer as unparseModule };
