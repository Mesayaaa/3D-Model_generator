import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "vibecoding" // Public API key

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Create a new FormData for the API request
    const apiFormData = new FormData()

    // Handle images
    const images = formData.getAll("images") as File[]
    if (images && images.length > 0) {
      images.forEach((image) => {
        apiFormData.append("images", image)
      })
    }

    // Handle prompt
    const prompt = formData.get("prompt") as string
    if (prompt) {
      apiFormData.append("prompt", prompt)
    }

    // Add all other form fields
    const fields = [
      "condition_mode",
      "geometry_file_format",
      "material",
      "quality",
      "use_hyper",
      "tier",
      "TAPose",
      "mesh_mode",
      "mesh_simplify",
      "mesh_smooth",
    ]

    fields.forEach((field) => {
      const value = formData.get(field)
      if (value !== null) {
        apiFormData.append(field, value.toString())
      }
    })

    // Forward the request to the Hyper3D API
    const response = await fetch("https://hyperhuman.deemos.com/api/v2/rodin/generate", {
      method: "POST",
      body: apiFormData,
      headers: {
        Authorization: `Bearer ${process.env.RODIN_API_KEY || API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Rodin API error:", errorText)
      throw new Error(`Rodin API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in rodin route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
