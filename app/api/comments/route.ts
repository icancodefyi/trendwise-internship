import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get("articleId")

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("trendwise")
    
    const comments = await db
      .collection("comments")
      .find({ articleId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { articleId, content } = await request.json()

    if (!articleId || !content) {
      return NextResponse.json(
        { error: "Article ID and content are required" },
        { status: 400 }
      )
    }

    const comment = {
      articleId,
      userId: session.user.email || "",
      userName: session.user.name || "Anonymous",
      userImage: session.user.image || "",
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const client = await clientPromise
    const db = client.db("trendwise")
    
    const result = await db.collection("comments").insertOne(comment)

    return NextResponse.json(
      { ...comment, _id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}
