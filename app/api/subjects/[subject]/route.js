import { NextResponse } from "next/server";
import { getSubjectBooks } from "@/lib/books/searchBooks";

export async function GET(_request, { params }) {
  const { subject } = await params;
  const data = await getSubjectBooks(subject, { limit: 24 });
  return NextResponse.json(data);
}
