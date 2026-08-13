import { NextResponse } from "next/server";
import { searchBooks } from "@/lib/books/searchBooks";

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const result = await searchBooks({
    q: searchParams.get("q") || "",
    page: Number(searchParams.get("page")) || 1,
    type: searchParams.get("type") || "book",
    language: searchParams.get("language") || "",
    subject: searchParams.get("subject") || "",
    sort: searchParams.get("sort") || "relevance",
    free: searchParams.get("free") === "1",
    preview: searchParams.get("preview") === "1",
    hasCover: searchParams.get("hasCover") === "1",
    yearMin: searchParams.get("yearMin") || "",
    yearMax: searchParams.get("yearMax") || "",
  });

  return NextResponse.json(result);
}
