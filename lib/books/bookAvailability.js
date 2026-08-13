export function getAvailability(book = {}) {
  const gutenbergId = book.gutenbergId || book.sources?.gutenberg || "";
  const archiveId = book.archiveId || book.sources?.internetArchive || "";
  const previewUrl = book.previewUrl || book.availability?.previewUrl || "";
  const googleId = book.sources?.googleBooks || "";

  if (gutenbergId) {
    return {
      status: "free",
      label: "Read Free",
      gutenbergId,
      previewUrl,
      archiveId,
    };
  }

  if (book.ebookAccess === "public" || (archiveId && book.ebookAccess !== "borrowable")) {
    return {
      status: archiveId || googleId ? "free" : "preview",
      label: archiveId ? "Read Free" : "Read Online",
      gutenbergId: "",
      previewUrl,
      archiveId,
    };
  }

  if (archiveId || previewUrl || googleId || book.hasFulltext || book.ebookAccess === "borrowable") {
    return {
      status: "preview",
      label: archiveId ? "Read Online" : "Preview Available",
      gutenbergId: "",
      previewUrl,
      archiveId,
    };
  }

  return {
    status: "discover",
    label: "Discover Only",
    gutenbergId: "",
    previewUrl: "",
    archiveId: "",
  };
}

export function availabilityRank(status) {
  if (status === "free") return 3;
  if (status === "preview") return 2;
  return 1;
}

export function getReadHref(book) {
  if (!book?.id) return "";
  return `/read/${encodeURIComponent(book.id)}`;
}

export function canOpenReader(book) {
  return Boolean(
    book?.gutenbergId ||
      book?.sources?.gutenberg ||
      book?.archiveId ||
      book?.sources?.internetArchive ||
      book?.sources?.googleBooks ||
      book?.previewUrl ||
      book?.hasFulltext ||
      book?.ebookAccess === "public" ||
      book?.ebookAccess === "borrowable"
  );
}
