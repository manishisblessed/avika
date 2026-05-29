import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ results: [] });

  try {
    const results = await searchProducts(q, 8);
    return NextResponse.json({ results });
  } catch (e) {
    console.error("search error", e);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
