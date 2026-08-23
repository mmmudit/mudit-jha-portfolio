import { NextResponse } from "next/server";
import { fetchNotionBooks } from "@/lib/notion";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  try {
    const books = await fetchNotionBooks();
    return NextResponse.json({ books });
  } catch (error) {
    console.error("Error in /api/notion/books:", error);
    return NextResponse.json({ books: [], error: "Failed to fetch books" }, { status: 500 });
  }
}
