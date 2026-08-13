import { NextResponse } from "next/server";
import { getReaderBook } from "@/lib/books/getReaderBook";

export async function GET(request, { params }) {
  const { id } = await params;
  const chapter = Number(request.nextUrl.searchParams.get("chapter") || 0);
  const data = await getReaderBook(id);
  if (!data?.book) {
    return NextResponse.json({ error: "Reader source not found" }, { status: 404 });
  }
  const current = data.chapters[chapter] || data.chapters[0];
  return NextResponse.json({
    book: data.book,
    chapter: current,
    total: data.chapters.length,
    toc: data.chapters.map((item) => ({ id: item.id, title: item.title })),
  });
}
