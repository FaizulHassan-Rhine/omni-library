import { NextResponse } from "next/server";
import { getBookById } from "@/lib/books/getBook";

export async function GET(_request, { params }) {
  const { id } = await params;
  const data = await getBookById(id);
  if (!data?.book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}
