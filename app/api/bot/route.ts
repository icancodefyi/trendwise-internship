import { NextRequest, NextResponse } from "next/server"
import { backendBot } from "@/lib/backend-bot"

export async function GET() {
  try {
    const statistics = await backendBot.getStatistics()
    return NextResponse.json({
      success: true,
      data: statistics
    })
  } catch (error) {
    console.error("Error getting bot statistics:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get bot statistics",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'start':
        await backendBot.start()
        return NextResponse.json({
          success: true,
          message: 'Backend bot started successfully'
        })

      case 'trigger':
        await backendBot.manualTrigger()
        return NextResponse.json({
          success: true,
          message: 'Manual generation cycle triggered'
        })

      case 'stop':
        backendBot.stop()
        return NextResponse.json({
          success: true,
          message: 'Backend bot stopped'
        })

      case 'stats':
        const stats = await backendBot.getStatistics()
        return NextResponse.json({
          success: true,
          data: stats
        })

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: "Invalid action. Supported actions: start, trigger, stop, stats" 
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error in bot management:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Bot management failed",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
