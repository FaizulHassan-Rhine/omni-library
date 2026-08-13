import { availabilityRank, getAvailability } from "@/lib/books/bookAvailability";
import { unique } from "@/lib/utils/format";
import { buildCoverList } from "@/lib/books/covers";

function betterString(current, incoming) {
  if (!incoming) return current || "";
  if (!current) return incoming;
  return incoming.length > current.length ? incoming : current;
}

export function mergeBooks(primary, secondary) {
  if (!primary) return secondary;
  if (!secondary) return primary;

  const sources = {
    openLibrary: primary.sources?.openLibrary || secondary.sources?.openLibrary || "",
    googleBooks: primary.sources?.googleBooks || secondary.sources?.googleBooks || "",
    gutenberg: primary.sources?.gutenberg || secondary.sources?.gutenberg || "",
    internetArchive: primary.sources?.internetArchive || secondary.sources?.internetArchive || "",
  };

  const covers = buildCoverList({
    isbn10: primary.isbn10 || secondary.isbn10,
    isbn13: primary.isbn13 || secondary.isbn13,
    coverId: primary.coverId || secondary.coverId,
    coverEditionKey: primary.coverEditionKey || secondary.coverEditionKey,
    archiveId: primary.archiveId || secondary.archiveId,
    gutenbergId: primary.gutenbergId || secondary.gutenbergId,
    cover: primary.cover || secondary.cover,
    covers: [...(primary.covers || []), ...(secondary.covers || [])],
    sources,
  });

  const merged = {
    ...primary,
    title: primary.title || secondary.title,
    subtitle: betterString(primary.subtitle, secondary.subtitle),
    description: betterString(primary.description, secondary.description),
    isbn10: primary.isbn10 || secondary.isbn10,
    isbn13: primary.isbn13 || secondary.isbn13,
    cover: covers[0] || primary.cover || secondary.cover || "",
    covers,
    coverId: primary.coverId || secondary.coverId,
    coverEditionKey: primary.coverEditionKey || secondary.coverEditionKey,
    languages: unique([...(primary.languages || []), ...(secondary.languages || [])]),
    subjects: unique([...(primary.subjects || []), ...(secondary.subjects || [])]).slice(0, 18),
    firstPublishedYear: primary.firstPublishedYear || secondary.firstPublishedYear,
    publisher: primary.publisher || secondary.publisher,
    editionCount: Math.max(primary.editionCount || 0, secondary.editionCount || 0),
    pages: primary.pages || secondary.pages,
    authors: primary.authors?.length ? primary.authors : secondary.authors,
    ratings: {
      average: primary.ratings?.average || secondary.ratings?.average || 0,
      count: Math.max(primary.ratings?.count || 0, secondary.ratings?.count || 0),
    },
    sources,
    gutenbergId: primary.gutenbergId || secondary.gutenbergId || "",
    previewUrl: primary.previewUrl || secondary.previewUrl || "",
    archiveId: primary.archiveId || secondary.archiveId || "",
    hasFulltext: Boolean(primary.hasFulltext || secondary.hasFulltext),
    ebookAccess: primary.ebookAccess || secondary.ebookAccess || "",
    embeddable: Boolean(primary.embeddable || secondary.embeddable),
    viewability: primary.viewability || secondary.viewability || "",
  };

  const rankedPrimary = availabilityRank(primary.availability?.status);
  const rankedSecondary = availabilityRank(secondary.availability?.status);
  const computed = getAvailability(merged);
  merged.availability =
    availabilityRank(computed.status) >= Math.max(rankedPrimary, rankedSecondary)
      ? computed
      : rankedPrimary >= rankedSecondary
        ? primary.availability
        : secondary.availability;

  if (primary.sources?.openLibrary) merged.id = primary.id;
  else if (secondary.sources?.openLibrary) merged.id = secondary.id;

  return merged;
}
