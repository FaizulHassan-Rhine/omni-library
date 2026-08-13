const CHAPTER_PATTERN =
  /(?:^|\n)((?:CHAPTER|Chapter|BOOK|Book|PART|Part|CANTO|Canto)\s+(?:[IVXLCDM]+|\d+)[^\n]*)\n/g;

function stripGutenbergBoilerplate(text) {
  const start = text.search(/\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG/i);
  const end = text.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG/i);
  let body = text;
  if (start >= 0) {
    const lineEnd = text.indexOf("\n", start);
    body = text.slice(lineEnd + 1, end >= 0 ? end : undefined);
  }
  return body.replace(/\r\n/g, "\n").trim();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function parseChapters(raw, title = "Untitled") {
  if (!raw) return [];
  const text = raw.includes("<") && raw.includes("html") ? stripHtml(raw) : raw;
  const body = stripGutenbergBoilerplate(text);
  const matches = [...body.matchAll(CHAPTER_PATTERN)];

  if (matches.length >= 2) {
    return matches.map((match, index) => {
      const start = match.index + match[0].length;
      const end = index < matches.length - 1 ? matches[index + 1].index : body.length;
      return {
        id: index,
        title: match[1].replace(/\s+/g, " ").trim(),
        content: body.slice(start, end).trim(),
      };
    }).filter((chapter) => chapter.content.length > 40);
  }

  const words = body.split(/\s+/);
  const chunk = 1800;
  const chapters = [];
  for (let i = 0; i < words.length; i += chunk) {
    const slice = words.slice(i, i + chunk).join(" ");
    chapters.push({
      id: chapters.length,
      title: chapters.length === 0 ? title : `Section ${chapters.length + 1}`,
      content: slice,
    });
  }
  return chapters.length ? chapters : [{ id: 0, title, content: body }];
}
