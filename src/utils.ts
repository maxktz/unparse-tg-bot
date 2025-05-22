import type { MessageEntity } from '@grammyjs/types';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function escapeHtml(s: string) {
  s = s.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
  s = s.replace(/"/g, '&quot;');
  s = s.replace(/\'/g, '&#x27;');
  return s;
}

function fixLengths(text: string, entities: MessageEntity[]) {
  for (const entity of entities) {
    while (text[entity.offset + entity.length - 1] === '\n') {
      entity.length--;
    }
  }
}

// Taken from Telethon with some modifications.
export function unparse(
  text: string,
  entities: MessageEntity[],
  offset = 0,
  length?: number,
): string {
  if (!text) return text;
  if (entities.length === 0) return escapeHtml(text);

  fixLengths(text, entities);

  length = length ?? text.length;

  const html = [];
  let lastOffset = 0;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (entity.offset >= offset + length) break;

    const relativeOffset = entity.offset - offset;

    if (relativeOffset > lastOffset) {
      html.push(escapeHtml(text.slice(lastOffset, relativeOffset)));
    } else if (relativeOffset < lastOffset) continue;

    let skipEntity = false;
    const length_ = entity.length;
    const text_ = unparse(
      text.slice(relativeOffset, relativeOffset + length_),
      entities.slice(i + 1, entities.length),
      entity.offset,
      length_,
    );

    switch (entity.type) {
      case 'bold':
        html.push(`<b>${text_}</b>`);
        break;
      case 'italic':
        html.push(`<i>${text_}</i>`);
        break;
      case 'underline':
        html.push(`<u>${text_}</u>`);
        break;
      case 'strikethrough':
        html.push(`<s>${text_}</s>`);
        break;
      case 'text_link':
        html.push(`<a href="${entity.url}">${text_}</a>`);
        break;
      case 'text_mention':
        html.push(`<a href="tg://user?id=${entity.user.id}">${text_}</a>`);
        break;
      case 'spoiler':
        html.push(`<span class="tg-spoiler">${text_}</span>`);
        break;
      case 'code':
        html.push(`<code>${text_}</code>`);
        break;
      case 'pre':
        html.push(`<pre${entity.language && ` class="${entity.language}"`}>${text_}</pre>`);
        break;
      case 'blockquote':
        html.push(`<blockquote>${text_}</blockquote>`);
        break;
      default:
        skipEntity = true;
    }

    lastOffset = relativeOffset + (skipEntity ? 0 : length_);
  }

  html.push(escapeHtml(text.slice(lastOffset, text.length)));

  return html.join('');
}
