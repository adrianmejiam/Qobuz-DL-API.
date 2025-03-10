import { type NextRequest, NextResponse } from "next/server"
import { search } from "@/lib/qobuz-dl"
import z from "zod"

const searchParamsSchema = z.object({
  q: z.string().min(1, "Query is required"),
  offset: z.preprocess((a) => {
    // Handle undefined, empty string, or non-numeric values
    if (!a || a === "") return 0
    const parsed = Number.parseInt(a as string)
    return Number.isNaN(parsed) ? 0 : parsed
  }, z.number().max(1000, "Offset must be less than 1000").min(0, "Offset must be 0 or greater").default(0)),
  limit: z.preprocess((a) => {
    // Handle undefined, empty string, or non-numeric values
    if (!a || a === "") return 10
    const parsed = Number.parseInt(a as string)
    return Number.isNaN(parsed) ? 10 : parsed
  }, z.number().max(50, "Limit must be less than 50").min(1, "Limit must be 1 or greater").default(10)),
})

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries())
  try {
    const { q, offset, limit } = searchParamsSchema.parse(params)
    const searchResults = await search(q, limit, offset)
    return new NextResponse(JSON.stringify({ success: true, data: searchResults }), {
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

