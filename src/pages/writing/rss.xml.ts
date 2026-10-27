import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { TOPICS, excerpt, getNotes, permalink, plainText } from '../../lib/notes';
import { site } from '../../data/site';

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const GET: APIRoute = async (context) => {
  const notes = await getNotes();
  return rss({
    title: `${site.name} · Writing`,
    description: 'Short, dated notes on web infrastructure, design, payments, support and building with AI.',
    site: context.site ?? site.url,
    items: notes.map((note) => {
      const text = plainText(note);
      // Readers show the note in full; a shared link follows it.
      const link = note.data.link ? `<p><a href="${escape(note.data.link)}">${escape(note.data.link)}</a></p>` : '';
      return {
        title: excerpt(text, 80),
        link: permalink(note),
        pubDate: note.data.date,
        description: text,
        content: `${note.html}${link}`,
        categories: [TOPICS[note.data.topic].label],
      };
    }),
    customData: '<language>en-us</language>',
    trailingSlash: false,
  });
};
