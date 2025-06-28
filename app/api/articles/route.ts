import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Article } from "@/types/article"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'publishedAt'
    const order = searchParams.get('order') || 'desc'
    
    const client = await clientPromise
    const db = client.db("trendwise")
    
    // Build query
    const query: any = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    if (featured !== null && featured !== '') {
      query.featured = featured === 'true'
    }
    
    // Build sort
    const sortObj: any = {}
    sortObj[sort] = order === 'desc' ? -1 : 1
    
    const skip = (page - 1) * limit
    
    const [articles, total] = await Promise.all([
      db.collection("articles")
        .find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("articles").countDocuments(query)
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
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
