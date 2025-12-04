module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/blog-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blogPosts",
    ()=>blogPosts
]);
const blogPosts = [
    {
        slug: "building-scalable-ml-pipelines",
        title: "Building Scalable ML Pipelines in Production",
        excerpt: "A deep dive into designing and implementing machine learning pipelines that can handle real-world scale and complexity.",
        date: "2024-11-15",
        tags: [
            "ML",
            "ENGINEERING",
            "PYTHON"
        ],
        content: `
Machine learning in production is vastly different from Jupyter notebook experiments. After years of building ML systems at scale, here are the patterns that actually work.

## The Reality of Production ML

Most ML tutorials end where the real challenges begin. Getting a model to work locally is maybe 10% of the effort. The remaining 90% involves:

- **Data pipeline reliability** - Your model is only as good as your data
- **Feature consistency** - Training/serving skew is a silent killer
- **Model versioning** - Because you will need to rollback
- **Monitoring** - Detecting drift before it impacts users

## Architecture That Scales

The key insight is treating ML systems as software systems first. This means:

### 1. Feature Stores Are Non-Negotiable

\`\`\`python
from feast import FeatureStore

store = FeatureStore(repo_path=".")

# Consistent features for training and serving
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["user_features:age", "user_features:activity_score"]
)
\`\`\`

### 2. Immutable Data Pipelines

Every transformation should be versioned and reproducible. Use tools like DVC or MLflow to track:

- Raw data versions
- Preprocessing steps
- Feature engineering logic

### 3. Shadow Deployments

Never ship directly to production. Run new models in shadow mode first:

\`\`\`python
# Log predictions without affecting users
shadow_prediction = new_model.predict(features)
log_shadow_result(shadow_prediction, production_prediction)
\`\`\`

## Monitoring Is Not Optional

Set up alerts for:

- **Input drift** - Feature distributions changing
- **Output drift** - Prediction distribution shifts
- **Performance metrics** - Latency, throughput, error rates

The goal is catching issues before your users do.

## Conclusion

Production ML is software engineering with statistical challenges. Treat it accordingly, and you'll build systems that actually work at scale.
    `.trim()
    },
    {
        slug: "typescript-patterns-for-better-code",
        title: "TypeScript Patterns That Changed How I Code",
        excerpt: "Advanced TypeScript patterns and techniques that improve code quality, maintainability, and developer experience.",
        date: "2024-10-28",
        tags: [
            "TYPESCRIPT",
            "PATTERNS",
            "DX"
        ],
        content: `
After writing TypeScript for several years, certain patterns have become essential to how I build software. These aren't just type tricks—they fundamentally change how you think about code structure.

## Discriminated Unions for State

Stop using boolean flags for state management:

\`\`\`typescript
// Instead of this
interface DataState {
  loading: boolean;
  error: Error | null;
  data: User[] | null;
}

// Do this
type DataState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: User[] };
\`\`\`

Now TypeScript enforces that you handle every state correctly.

## Builder Pattern with Type Safety

\`\`\`typescript
class QueryBuilder<T extends object = {}> {
  private query: T = {} as T;

  where<K extends string, V>(
    key: K,
    value: V
  ): QueryBuilder<T & Record<K, V>> {
    return Object.assign(this, {
      query: { ...this.query, [key]: value }
    });
  }

  build(): T {
    return this.query;
  }
}

// Usage - fully typed!
const query = new QueryBuilder()
  .where('name', 'John')
  .where('age', 30)
  .build();
// type: { name: string; age: number }
\`\`\`

## Branded Types for Domain Safety

Prevent mixing up primitive types that represent different things:

\`\`\`typescript
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'u_123' as UserId;
const orderId = 'o_456' as OrderId;

getUser(userId);  // OK
getUser(orderId); // Type error!
\`\`\`

## The Result Type

Handle errors explicitly instead of throwing:

\`\`\`typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { ok: true, value: user };
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
\`\`\`

## Conclusion

These patterns make impossible states unrepresentable. That's the real power of TypeScript—not just catching typos, but encoding business logic into the type system.
    `.trim()
    },
    {
        slug: "lessons-from-startup-engineering",
        title: "Engineering Lessons from Three Startups",
        excerpt: "Hard-won insights about building products, managing technical debt, and scaling teams from my startup journey.",
        date: "2024-09-12",
        tags: [
            "STARTUPS",
            "LEADERSHIP",
            "CAREER"
        ],
        content: `
I've been the first engineer at three startups. Each one taught me something different about building products under pressure.

## Lesson 1: Ship First, Optimize Later

At my first startup, we spent 3 months building a "scalable" architecture for an app that had zero users. We ran out of runway before finding product-market fit.

The fix: Build the simplest thing that could work. You can always refactor when you have users and revenue. I now use this rule:

> If you're not embarrassed by v1, you shipped too late.

## Lesson 2: Technical Debt Is a Business Decision

Not all debt is bad. Taking on technical debt to ship faster can be the right call—if you're intentional about it.

What I track:
- **Known shortcuts** - Document them in code comments
- **Future cost** - Rough estimate of cleanup time
- **Trigger for payback** - "Refactor when we hit X users"

The key is making debt visible and planned, not accidental.

## Lesson 3: Communication Scales Harder Than Code

With 3 engineers, everyone knows everything. With 15, you need processes:

- **RFCs for big decisions** - Write it down, get async feedback
- **Runbooks for operations** - Because 3 AM incidents happen
- **Architecture decision records** - Future you will thank past you

## Lesson 4: Hire for Slope, Not Intercept

The best hires I've made were people who learned fast, not people who already knew everything. In a startup, the problems change every quarter. Adaptability beats expertise.

## Lesson 5: Your First Architecture Will Be Wrong

Accept it. Plan for it. Make it easy to change things:

- Keep services loosely coupled
- Use feature flags for new functionality
- Design databases for migration, not permanence

## The Meta-Lesson

Startups are about learning fast. Every technical decision should optimize for speed of learning, not perfection. Perfect code that ships too late helps no one.

What matters: solving real problems for real users, as quickly as possible.
    `.trim()
    }
];
}),
"[project]/lib/blog.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllBlogSlugs",
    ()=>getAllBlogSlugs,
    "getAllBlogs",
    ()=>getAllBlogs,
    "getBlogBySlug",
    ()=>getBlogBySlug
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/blog-data.ts [app-route] (ecmascript)");
;
function calculateReadTime(content) {
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
}
function generateRawMarkdown(post) {
    return `---
title: "${post.title}"
excerpt: "${post.excerpt}"
date: "${post.date}"
tags: [${post.tags.map((t)=>`"${t}"`).join(", ")}]
---

${post.content}`;
}
function getAllBlogSlugs() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["blogPosts"].map((post)=>post.slug);
}
function getBlogBySlug(slug) {
    const post = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["blogPosts"].find((p)=>p.slug === slug);
    if (!post) {
        return null;
    }
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        readTime: calculateReadTime(post.content),
        tags: post.tags,
        content: post.content,
        rawContent: generateRawMarkdown(post)
    };
}
function getAllBlogs() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["blogPosts"].map((post)=>getBlogBySlug(post.slug)).filter((blog)=>blog !== null).sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
}
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs) <export default as minpath>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "minpath",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs) <export default as minproc>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "minproc",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs) <export fileURLToPath as urlToPath>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "urlToPath",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__["fileURLToPath"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:url [external] (node:url, cjs)");
}),
"[project]/lib/markdown-to-html.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateHtmlDocument",
    ()=>generateHtmlDocument,
    "markdownToHtml",
    ()=>markdownToHtml
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$html$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-html/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-route] (ecmascript)");
;
;
;
async function markdownToHtml(markdown) {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["remark"])().use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]).use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$html$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"], {
        sanitize: false
    }).process(markdown);
    return result.toString();
}
function generateHtmlDocument(title, content) {
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
</html>`;
}
}),
"[project]/app/api/blog/download/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/blog.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$markdown$2d$to$2d$html$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/markdown-to-html.tsx [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const format = searchParams.get("format");
    if (!slug) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Slug is required"
        }, {
            status: 400
        });
    }
    const blog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBlogBySlug"])(slug);
    if (!blog) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Blog not found"
        }, {
            status: 404
        });
    }
    if (format === "html") {
        const htmlContent = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$markdown$2d$to$2d$html$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["markdownToHtml"])(blog.content);
        const fullHtml = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$markdown$2d$to$2d$html$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateHtmlDocument"])(blog.title, htmlContent);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](fullHtml, {
            headers: {
                "Content-Type": "text/html",
                "Content-Disposition": `attachment; filename="${slug}.html"`
            }
        });
    }
    // Default to markdown
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](blog.rawContent, {
        headers: {
            "Content-Type": "text/markdown",
            "Content-Disposition": `attachment; filename="${slug}.md"`
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4221e109._.js.map