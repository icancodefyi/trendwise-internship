import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Update article metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { meta } = body

    if (!meta || !meta.title || !meta.description) {
      return NextResponse.json(
        { error: "Invalid metadata" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("trendwise")
    
    const result = await db
      .collection("articles")
      .updateOne(
        { slug },
        { 
          $set: {
            meta,
            updatedAt: new Date()
          }
        }
      )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Metadata updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating metadata:", error)
    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 }
    )
  }
}
