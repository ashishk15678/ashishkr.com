import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

/**
 * Callout types and their labels/classes.
 * In markdown, use:
 *   > This is a plain note (becomes a "Note" margin callout)
 *   > [!warning] This is a warning
 *   > [!definition] Term — explanation here
 *   > [!error] Something went wrong
 *   > [!tip] Helpful tip here
 */

type CalloutType = "note" | "warning" | "definition" | "error" | "tip";

interface CalloutMeta {
  label: string;
  cssClass: string;
}

const CALLOUT_MAP: Record<CalloutType, CalloutMeta> = {
  note: { label: "Note", cssClass: "callout-note" },
  warning: { label: "Warning", cssClass: "callout-warning" },
  definition: { label: "Definition", cssClass: "callout-definition" },
  error: { label: "Error", cssClass: "callout-error" },
  tip: { label: "Tip", cssClass: "callout-tip" },
};

/**
 * Detect callout type from the inner HTML of a blockquote.
 * Supports:  > [!type] content   OR plain  > content  (defaults to "note")
 */
function parseCallout(innerHtml: string): {
  type: CalloutType;
  content: string;
} {
  // Match [!type] at the very start (inside a <p> or not)
  const tagRegex = /^(<p>)?\s*\[!(note|warning|definition|error|tip)\]\s*/i;
  const match = innerHtml.match(tagRegex);

  if (match) {
    const type = match[2].toLowerCase() as CalloutType;
    let content = innerHtml.slice(match[0].length);
    // If we consumed the opening <p>, re-add it
    if (match[1] && !content.startsWith("<p>")) {
      content = "<p>" + content;
    }
    return { type, content };
  }

  return { type: "note", content: innerHtml };
}

/**
 * Build the margin-note HTML structure.
 * This creates the side-positioned callout with the connecting dash line,
 * matching the reference design:
 *
 *   ┌─────────────────────┐  ────  ┌─────────────────────────┐
 *   │   Note              │        │  Main content continues  │
 *   │   Some italic text  │        │  here on the right...    │
 *   │   describing a      │        │                          │
 *   │   concept           │        │                          │
 *   └─────────────────────┘        └─────────────────────────┘
 */
function buildMarginNote(type: CalloutType, content: string): string {
  const meta = CALLOUT_MAP[type];

  return `<aside class="margin-callout ${meta.cssClass}" role="note" aria-label="${meta.label}">
  <div class="margin-callout-inner">
    <div class="margin-callout-body">
      <div class="margin-callout-content">
        ${content}
      </div>
    </div>
    <div class="margin-callout-label">
      <span class="margin-callout-label-text">${meta.label}</span>
      <span class="margin-callout-dash" aria-hidden="true"></span>
    </div>
  </div>
</aside>`;
}

/**
 * Post-process the rendered HTML to:
 * 1. Transform <blockquote> elements into side margin-note callouts
 * 2. Add language labels to code blocks
 * 3. Add copy button placeholders to code blocks
 * 4. Wrap tables for horizontal scrolling
 */
function postProcess(htmlString: string): string {
  let result = htmlString;

  // ── 1. Transform blockquotes into margin callouts ──
  // Match <blockquote>...</blockquote> (non-greedy, handles multiline)
  result = result.replace(
    /<blockquote>\s*([\s\S]*?)\s*<\/blockquote>/gi,
    (_match, inner: string) => {
      const { type, content } = parseCallout(inner.trim());
      return buildMarginNote(type, content);
    },
  );

  // ── 2. Add language labels + line count + copy hint to <pre><code> ──
  // remark-html outputs: <pre><code class="language-xxx">...</code></pre>
  // We also handle plain <pre><code>...</code></pre> (no language)
  result = result.replace(
    /<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/gi,
    (_match, lang: string | undefined, code: string) => {
      const language = lang ? lang.toUpperCase() : "CODE";
      // Count non-empty lines
      const lines = code.split("\n").filter((l) => l.trim().length > 0).length;

      return `<div class="code-block-wrapper">
  <div class="code-block-header">
    <span class="code-block-lang">${language}</span>
    <span class="code-block-meta">
      <span class="code-block-lines">${lines} lines</span>
      <span class="code-block-separator">|</span>
      <button class="code-block-copy" onclick="(function(btn){var code=btn.closest('.code-block-wrapper').querySelector('code');navigator.clipboard.writeText(code.textContent);btn.textContent='COPIED';setTimeout(function(){btn.textContent='COPY'},1500)})(this)">COPY</button>
    </span>
  </div>
  <pre><code class="language-${lang || "text"}">${code}</code></pre>
</div>`;
    },
  );

  // ── 3. Wrap tables for responsive horizontal scroll ──
  result = result.replace(/<table>/gi, '<div class="table-wrapper"><table>');
  result = result.replace(/<\/table>/gi, "</table></div>");

  // ── 4. Add id anchors to h2/h3 for linking ──
  result = result.replace(
    /<(h[23])>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, content: string) => {
      const id = content
        .replace(/<[^>]+>/g, "") // strip inner html tags
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return `<${tag} id="${id}">${content}</${tag}>`;
    },
  );

  return result;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(markdown);

  return postProcess(result.toString());
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
      font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', ui-monospace, monospace;
      line-height: 1.8;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      color: #c9d1d9;
      background: #0a0a0c;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; line-height: 1.2; color: #e6edf3; }
    h2 { font-size: 1.5rem; margin-top: 2.5rem; border-bottom: 1px solid #1c1e26; padding-bottom: 0.5rem; color: #e6edf3; }
    h3 { font-size: 1.2rem; margin-top: 1.75rem; color: #e6edf3; }
    p { margin: 1rem 0; }
    code {
      background: #1c1e26;
      color: #d2a8ff;
      border: 1px solid #2d333b;
      padding: 0.15em 0.4em;
      border-radius: 4px;
      font-size: 0.85em;
    }
    pre {
      background: #0d1117;
      border: 1px solid #1c1e26;
      border-left: 3px solid #6e40c9;
      color: #e6edf3;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }
    pre code { background: none; border: none; padding: 0; color: #e6edf3; }
    blockquote, .margin-callout {
      border-left: 3px solid #d29922;
      background: #0d1117;
      border-radius: 6px;
      margin: 1.5rem 0;
      padding: 1rem 1.25rem;
      color: #8b949e;
      font-style: italic;
    }
    a { color: #d2a8ff; text-decoration: underline; text-underline-offset: 3px; }
    a:hover { color: #ffffff; }
    img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #1c1e26; }
    ul, ol { padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    li::marker { color: #6e40c9; }
    strong { color: #e6edf3; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; border: 1px solid #1c1e26; }
    th, td { border: 1px solid #1c1e26; padding: 0.6rem 0.85rem; text-align: left; }
    th { background: #161b22; color: #e6edf3; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.03em; }
    td { color: #c9d1d9; }
    hr { border: none; border-top: 1px solid #1c1e26; margin: 2rem 0; }
    ::selection { background: #6e40c9; color: #fff; }
  </style>
</head>
<body>
  <article>
    <h1>${title}</h1>
    ${content}
  </article>
</body>
</html>`;
}
