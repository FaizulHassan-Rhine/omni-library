import { NextResponse } from "next/server";
import { searchOpenLibrary, searchOpenLibraryAuthors, extractOpenLibraryId } from "@/lib/api/openLibrary";
import { searchGoogleBooks } from "@/lib/api/googleBooks";
import { looksLikeIsbn } from "@/lib/utils/format";
import { slugify } from "@/lib/utils/slug";
import { isNonLatinQuery } from "@/lib/utils/languages";

export async function GET(request) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  const suggestions = [];

  if (looksLikeIsbn(q)) {
    suggestions.push({
      type: "isbn",
      label: `ISBN ${q}`,
      href: `/search?q=${encodeURIComponent(q)}`,
    });
  }

  const preferGoogle = isNonLatinQuery(q);
  const [books, authors, google] = await Promise.allSettled([
    preferGoogle ? Promise.resolve({ docs: [] }) : searchOpenLibrary({ q, limit: 5 }),
    searchOpenLibraryAuthors(q, 3),
    searchGoogleBooks({ q, limit: 5 }),
  ]);

  if (google.status === "fulfilled") {
    (google.value.items || []).slice(0, preferGoogle ? 5 : 3).forEach((item) => {
      const title = item.volumeInfo?.title;
      if (!title) return;
      suggestions.push({
        type: "book",
        label: title,
        href: `/book/gb-${item.id}`,
      });
    });
  }

  if (books.status === "fulfilled") {
    books.value.docs.slice(0, 4).forEach((doc) => {
      const id = extractOpenLibraryId(doc.key);
      suggestions.push({
        type: "book",
        label: doc.title,
        href: `/book/${id}`,
      });
    });
  }

  if (authors.status === "fulfilled") {
    authors.value.slice(0, 3).forEach((doc) => {
      const id = extractOpenLibraryId(doc.key);
      suggestions.push({
        type: "author",
        label: doc.name,
        href: `/author/${id}`,
      });
    });
  }

  if (q.length > 3) {
    suggestions.push({
      type: "subject",
      label: q,
      href: `/subject/${slugify(q) || encodeURIComponent(q)}`,
    });
  }

  const unique = [];
  const seen = new Set();
  suggestions.forEach((item) => {
    if (seen.has(item.href)) return;
    seen.add(item.href);
    unique.push(item);
  });

  return NextResponse.json({ suggestions: unique.slice(0, 8) });
}
