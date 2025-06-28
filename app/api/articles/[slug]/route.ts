import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const client = await clientPromise
    const db = client.db("trendwise")
    
    const article = await db
      .collection("articles")
      .findOne({ slug })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await db
      .collection("articles")
      .updateOne(
        { _id: article._id },
        { $inc: { views: 1 } }
      )

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { _id, ...updateData } = body
    
    const client = await clientPromise
    const db = client.db("trendwise")
    
    // Find the article first
    const existingArticle = await db
      .collection("articles")
      .findOne({ slug })

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Update the article
    const result = await db
      .collection("articles")
      .updateOne(
        { slug },
        { 
          $set: {
            ...updateData,
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

    // Fetch and return the updated article
    const updatedArticle = await db
      .collection("articles")
      .findOne({ slug })

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const client = await clientPromise
    const db = client.db("trendwise")
    
    // Delete the article
    const result = await db
      .collection("articles")
      .deleteOne({ slug })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Also delete associated comments
    await db
      .collection("comments")
      .deleteMany({ articleSlug: slug })

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}
