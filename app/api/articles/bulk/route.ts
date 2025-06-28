import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Bulk operations for articles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, articleIds } = body

    if (!action || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("trendwise")
    
    let result
    
    switch (action) {
      case 'delete':
        // Delete multiple articles
        result = await db.collection("articles").deleteMany({
          _id: { $in: articleIds.map(id => new ObjectId(id)) }
        })
        
        // Also delete associated comments
        await db.collection("comments").deleteMany({
          articleId: { $in: articleIds }
        })
        
        return NextResponse.json({
          message: `${result.deletedCount} articles deleted successfully`,
          deletedCount: result.deletedCount
        })
        
      case 'feature':
        // Mark multiple articles as featured
        result = await db.collection("articles").updateMany(
          { _id: { $in: articleIds.map(id => new ObjectId(id)) } },
          { 
            $set: { 
              featured: true,
              updatedAt: new Date()
            }
          }
        )
        
        return NextResponse.json({
          message: `${result.modifiedCount} articles marked as featured`,
          modifiedCount: result.modifiedCount
        })
        
      case 'unfeature':
        // Remove featured status from multiple articles
        result = await db.collection("articles").updateMany(
          { _id: { $in: articleIds.map(id => new ObjectId(id)) } },
          { 
            $set: { 
              featured: false,
              updatedAt: new Date()
            }
          }
        )
        
        return NextResponse.json({
          message: `${result.modifiedCount} articles removed from featured`,
          modifiedCount: result.modifiedCount
        })
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error("Error performing bulk operation:", error)
    return NextResponse.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 }
    )
  }
}
