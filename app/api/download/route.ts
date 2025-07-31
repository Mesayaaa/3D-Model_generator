import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskUuid = searchParams.get("task_uuid")

    if (!taskUuid) {
      return NextResponse.json({ error: "Missing task_uuid parameter" }, { status: 400 })
    }

    const response = await fetch(`https://hyperhuman.deemos.com/api/v2/rodin/download?task_uuid=${taskUuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.RODIN_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Download API error:", errorText)
      throw new Error(`Download API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in download route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
