import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Article } from "@/types/article"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("trendwise")
    
    const articles = await db
      .collection("articles")
      .find({})
      .sort({ publishedAt: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, ...articleData } = body
    const article = {
      ...articleData,
      publishedAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    }

    const client = await clientPromise
    const db = client.db("trendwise")
    
    const result = await db.collection("articles").insertOne(article)

    return NextResponse.json(
      { ...article, _id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}
