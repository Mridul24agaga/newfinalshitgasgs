import { NextResponse } from "next/server"

const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY

export async function POST(req: Request) {
  console.log("API route called: /api/generate-image")
  try {
    const body = await req.json()
    console.log("Received request body:", body)
    const { prompt, aspect_ratio = "1:1" } = body // Removed negative_prompt

    if (!prompt) {
      console.log("Error: Prompt is required")
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!CLIPDROP_API_KEY) {
      console.log("CLIPDROP_API_KEY not found, using placeholder images")
      const placeholderImages = [
        `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(prompt.substring(0, 30))}`,
        `/placeholder.svg?height=512&width=512&text=${encodeURIComponent((prompt + " (1)").substring(0, 30))}`,
        `/placeholder.svg?height=512&width=512&text=${encodeURIComponent((prompt + " (2)").substring(0, 30))}`,
        `/placeholder.svg?height=512&width=512&text=${encodeURIComponent((prompt + " (3)").substring(0, 30))}`,
      ]
      return NextResponse.json({
        images: placeholderImages,
        note: "Using placeholder images because CLIPDROP_API_KEY is not configured",
      })
    }

    // Parse aspect ratio for potential future use (not sent to Clipdrop)
    const [widthRatio, heightRatio] = aspect_ratio.split(":").map(Number)
    const width = widthRatio * 512
    const height = heightRatio * 512

    const formData = new FormData()
    formData.append("prompt", prompt)
    // Removed negative_prompt from FormData

    console.log("Sending request to Clipdrop API with formData:", { prompt })

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": CLIPDROP_API_KEY,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Clipdrop API response:", response.status, errorText)
      return NextResponse.json(
        { error: `Image generation failed: ${errorText}`, status: response.status },
        { status: response.status },
      )
    }

    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")
    const dataUrl = `data:image/png;base64,${base64Image}`
    const images = [dataUrl]

    // Optional: Uncomment if you want to add variations
    /*
    const variations = [
      `${prompt} with vibrant colors`,
      `${prompt} with dramatic lighting`,
      `${prompt} with different perspective`,
    ]
    const variationPromises = variations.map(async (variationPrompt) => {
      const variationFormData = new FormData()
      variationFormData.append("prompt", variationPrompt)
      
      const variationResponse = await fetch("https://clipdrop-api.co/text-to-image/v1", {
        method: "POST",
        headers: { "x-api-key": CLIPDROP_API_KEY },
        body: variationFormData,
      })

      if (!variationResponse.ok) return null
      const variationBuffer = await variationResponse.arrayBuffer()
      const variationBase64 = Buffer.from(variationBuffer).toString("base64")
      return `data:image/png;base64,${variationBase64}`
    })

    const variationResults = await Promise.all(variationPromises)
    variationResults.forEach((result) => {
      if (result) images.push(result)
    })
    */

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Failed to generate image. Please try again." }, { status: 500 })
  }
}