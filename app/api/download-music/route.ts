import { type NextRequest, NextResponse } from "next/server"
import { getDownloadURL } from "@/lib/qobuz-dl"
import z from "zod"

const downloadParamsSchema = z.object({
  track_id: z.preprocess((a) => Number.parseInt(a as string), z.number().min(0, "ID must be 0 or greater").default(1)),
  quality: z.enum(["27", "7", "6", "5"]).default("27"),
})

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries())
  try {
    const { track_id, quality } = downloadParamsSchema.parse(params)
    const url = await getDownloadURL(track_id, quality)
    return new NextResponse(JSON.stringify({ success: true, data: { url } }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error?.errors || error.message || "An error occurred parsing the request.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

