import type { Context } from '../../common/context';
import { unparse } from '../../utils';

export async function unparseHandler(ctx: Context) {
  const unparsed = unparse(ctx.message!.text!, ctx.message!.entities ?? []);
  // @ts-expect-error lib issue
  return ctx.reply(unparsed, { parse_mode: null });
}
