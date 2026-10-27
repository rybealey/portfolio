// Renders Markdown bodies from the database at request time. Code blocks are
// colored by Shiki with CSS variables, so they follow the light and dark
// themes (see .astro-code in global.css). Raw HTML in a body is shown as
// text, never injected.
import { Marked, type Tokens } from 'marked';
import { codeToHtml, createCssVariablesTheme } from 'shiki';

const theme = createCssVariablesTheme({ name: 'css-variables', variablePrefix: '--astro-code-', fontStyle: true });

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

type CodeToken = Tokens.Code & { highlighted?: string };

const marked = new Marked({
  async: true,
  gfm: true,
  async walkTokens(token) {
    if (token.type !== 'code') return;
    const code = token as CodeToken;
    try {
      code.highlighted = await codeToHtml(code.text, { lang: code.lang || 'text', theme });
    } catch {
      code.highlighted = await codeToHtml(code.text, { lang: 'text', theme });
    }
  },
  renderer: {
    code(token) {
      return (token as CodeToken).highlighted?.replace('class="shiki', 'class="astro-code shiki') ?? `<pre><code>${escape(token.text)}</code></pre>`;
    },
    html(token) {
      return escape(token.text);
    },
  },
});

export async function renderMarkdown(source: string): Promise<string> {
  return marked.parse(source);
}
