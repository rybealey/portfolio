// Gives a rendered case study's h2 and h3 headings ids, and lists the h2s
// for the page's contents. A heading that starts with a section number,
// like "3. Information architecture", gets the number split out so the page
// can style it.
export interface Section {
  id: string;
  title: string;
  number?: string;
}

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const decode = (text: string) => text.replace(/&(amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e]!);
const plain = (html: string) => decode(html.replace(/<[^>]+>/g, '')).trim();

export function outline(html: string): { html: string; sections: Section[] } {
  const sections: Section[] = [];
  const used = new Set<string>();
  const slug = (text: string) => {
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  };
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level: string, inner: string) => {
    const numbered = level === '2' ? inner.match(/^(\d+)\.\s+([\s\S]*)$/) : null;
    const title = plain(numbered ? numbered[2]! : inner);
    const id = slug(title);
    if (level === '2') {
      const number = numbered ? numbered[1]!.padStart(2, '0') : undefined;
      sections.push({ id, title, ...(number ? { number } : {}) });
      const label = number ? `<span class="num hud" aria-hidden="true">${number}</span>` : '';
      return `<h2 id="${id}">${label}<span>${numbered ? numbered[2] : inner}</span></h2>`;
    }
    return `<h3 id="${id}">${inner}</h3>`;
  });
  return { html: out, sections };
}
