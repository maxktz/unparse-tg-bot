import type { HydrateFlavor } from '@grammyjs/hydrate';
import type { ParseModeFlavor } from '@grammyjs/parse-mode';
import type { Message, Update, UserFromGetMe } from '@grammyjs/types';
import { Context as DefaultContext } from 'grammy';
import type { Api, InputFile, LazySessionFlavor } from 'grammy';
import type { Logger } from '../helpers/logger';
import type { env } from './env';

export interface SessionData {
  foo: string;
}

export interface Dependencies {
  logger: Logger;
  env: typeof env;
}

type SendMessageOptions = Parameters<Context['reply']>[1] & {
  photo?: InputFile | string;
};
type SendMessageReturnType = Promise<Message>;

export interface ExtendedContext extends Dependencies {
  /** Unified send message method, for text messages and photos. */
  sendMessage(
    chatId: number | string,
    text?: string,
    other?: SendMessageOptions,
  ): SendMessageReturnType;
  replyUni(text?: string, other?: SendMessageOptions): SendMessageReturnType;
}

export type Context = HydrateFlavor<
  ParseModeFlavor<DefaultContext & ExtendedContext & LazySessionFlavor<SessionData>>
>;

export function createContextConstructor(deps: Dependencies) {
  return class extends DefaultContext implements ExtendedContext {
    logger: Logger;
    env: typeof env;
    session!: Promise<SessionData>; // since we use LazySession middleware

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me);
      this.logger = deps.logger;
      this.env = deps.env;
    }

    sendMessage(chatId: number | string, text?: string, other?: SendMessageOptions) {
      if (other?.photo) {
        return this.api.sendPhoto(chatId, other.photo, {
          caption: text,
          ...other,
        });
      }
      if (text) {
        return this.api.sendMessage(chatId, text, other);
      }
      throw new Error('Text or photo is required');
    }

    replyUni(text?: string, other?: SendMessageOptions) {
      return this.sendMessage(this.chat!.id, text, other);
    }
  } as unknown as new (
    update: Update,
    api: Api,
    me: UserFromGetMe,
  ) => Context;
}
