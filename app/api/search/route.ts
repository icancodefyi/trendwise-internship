import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("trendwise")
    
    // Search articles by title, excerpt, content, and tags
    const articles = await db
      .collection("articles")
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { excerpt: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
          { "meta.keywords": { $in: [new RegExp(query, "i")] } }
        ]
      })
      .sort({ publishedAt: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json({
      success: true,
      query,
      results: articles,
      count: articles.length
    })

  } catch (error) {
    console.error("Error searching articles:", error)
    return NextResponse.json(
      { error: "Failed to search articles" },
      { status: 500 }
    )
  }
}
