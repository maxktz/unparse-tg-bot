import { webhookCallback } from 'grammy';
import { env } from './common/env';
import { initBot } from './init-bot';

const bot = initBot();
const handleUpdate = webhookCallback(bot, 'cloudflare-mod', {
  secretToken: env.WEBHOOK_SECRET,
});

export default {
  fetch: handleUpdate,
};
