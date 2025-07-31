import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriptionKey = searchParams.get("subscription_key")

    if (!subscriptionKey) {
      return NextResponse.json({ error: "Missing subscription_key parameter" }, { status: 400 })
    }

    const response = await fetch(
      `https://hyperhuman.deemos.com/api/v2/rodin/status?subscription_key=${subscriptionKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.RODIN_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Status API error:", errorText)
      throw new Error(`Status API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in status route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
