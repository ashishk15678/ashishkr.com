import { type NextRequest, NextResponse } from "next/server"
import { getBlogBySlug } from "@/lib/blog"
import { markdownToHtml, generateHtmlDocument } from "@/lib/markdown-to-html"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get("slug")
  const format = searchParams.get("format") as "html" | "md"

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  const blog = getBlogBySlug(slug)

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 })
  }

  if (format === "html") {
    const htmlContent = await markdownToHtml(blog.content)
    const fullHtml = generateHtmlDocument(blog.title, htmlContent)

    return new NextResponse(fullHtml, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${slug}.html"`,
      },
    })
  }

  // Default to markdown
  return new NextResponse(blog.rawContent, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="${slug}.md"`,
    },
  })
}
