import { type NextRequest, NextResponse } from "next/server"
import { getAlbumInfo } from "@/lib/qobuz-dl"
import z from "zod"

const albumInfoParamsSchema = z.object({
  album_id: z.string().min(1, "ID is required"),
})

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries())
  try {
    const { album_id } = albumInfoParamsSchema.parse(params)
    const data = await getAlbumInfo(album_id)
    return new NextResponse(JSON.stringify({ success: true, data }), {
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

