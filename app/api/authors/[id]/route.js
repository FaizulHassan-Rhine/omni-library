import { NextResponse } from "next/server";
import { getAuthorById } from "@/lib/books/getAuthor";

export async function GET(_request, { params }) {
  const { id } = await params;
  const data = await getAuthorById(id);
  if (!data?.author) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}
