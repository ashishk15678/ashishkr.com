import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(html, { sanitize: false }).process(markdown)

  return result.toString()
}

export function generateHtmlDocument(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.7;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #1a1a1a;
      background: #fafafa;
    }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; line-height: 1.2; }
    h2 { font-size: 1.75rem; margin-top: 2rem; border-bottom: 1px solid #e5e5e5; padding-bottom: 0.5rem; }
    h3 { font-size: 1.25rem; margin-top: 1.5rem; }
    p { margin: 1rem 0; }
    code {
      background: #f0f0f0;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
    }
    pre {
      background: #1a1a1a;
      color: #f0f0f0;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }
    pre code { background: none; padding: 0; }
    blockquote {
      border-left: 4px solid #e5e5e5;
      margin: 1.5rem 0;
      padding-left: 1rem;
      color: #666;
      font-style: italic;
    }
    a { color: #0066cc; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    ul, ol { padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #e5e5e5; padding: 0.75rem; text-align: left; }
    th { background: #f5f5f5; }
    hr { border: none; border-top: 1px solid #e5e5e5; margin: 2rem 0; }
  </style>
</head>
<body>
  <article>
    <h1>${title}</h1>
    ${content}
  </article>
</body>
</html>`
}
