---
title: "From Red to Green: The Practical Performance Playbook"
excerpt: "A step-by-step, real-world guide to moving Lighthouse scores from red to green by tackling render blocking, legacy JavaScript, LCP, forced reflow, and network dependency chains."
date: "2026-03-15"
tags:
  - performance
  - lighthouse
  - web-vitals
  - nextjs
  - optimization
heroImage: "/images/posts/performance-playbook.jpg"
---

# From Red to Green: The Practical Performance Playbook

Performance work is often presented as a bag of tricks. This post is different. It’s a field-tested playbook to take a Lighthouse report that’s screaming red  **Render Blocking**, **Legacy JavaScript**, **Forced Reflow**, **LCP breakdown**, **Network dependency chains**  and turn it into a calm, green dashboard.

Each section has:

- **What the metric actually means** (and what it doesn’t).
- **Why it goes red** in real projects.
- **Concrete fixes** with priority ordering.
- **Guardrails** to avoid regressions.

---

### 1) Orient: Build a Minimal Performance Graph

Before touching code, map the page load into three layers:

- **Critical Path**: HTML → CSS → above-the-fold JS → hero image.
- **Supporting Path**: deferred scripts, hydration, interactive widgets, fonts.
- **Peripheral Path**: analytics, heatmaps, chat widgets, A/B frameworks.

Print this map on one page. Every fix below references it, so you know which layer you’re optimizing.

**Deliverable:** A short doc with three columns (Critical, Supporting, Peripheral) and the assets/scripts under each. Timeboxed to 30 minutes.

---

### 2) Render Blocking Requests (CSS & Fonts)

### Why It Goes Red
- Large global CSS (un-purged Tailwind/CSS) in `<head>`.
- Multiple font families/weights without `display=swap` or `optional`.
- Third-party styles injected before your own.

### Fix Order
1. **Inline only critical CSS** for above-the-fold; defer the rest.
   - Use a critical CSS extractor or manually inline key rules for header/hero.
2. **Font discipline**:
   - Limit to 1–2 families, 2 weights max.
   - Use `display: swap` or `optional`.
   - Preload only the first paint’s fonts; lazy-load the rest.
3. **Self-host fonts or use `<link rel="preload">`** with `crossorigin` for Google Fonts to avoid double round-trips.
4. **Purge CSS**:
   - Tailwind/utility: ensure purge is active in production.
   - Component libs: tree-shake styles or import per-component styles only.

### Guardrails
- Validate with the Coverage tab: keep **unused CSS < 80KB** at initial paint.
- Run **Lighthouse “Reduce unused CSS”** after each large styling change.

---

### 3) Legacy JavaScript (Trim the Polyfill Fat)

### Why It Goes Red
- Serving transpiled ES5 with heavy polyfills to modern evergreen browsers.
- Including moment.js, lodash-es full bundle, or IE11 shims.

### Fix Order
1. **Modern targets**: Set browserslist to modern (no IE11, no Opera Mini). This drops legacy transforms and polyfills.
2. **Module/nomodule split** (frameworks often do this automatically). Ensure your host isn’t forcing a single legacy bundle.
3. **Polyfill on-demand**: Remove global polyfills; dynamically import only needed ones.
4. **Replace heavy deps**:
   - `moment` → `date-fns`/`Intl`.
   - `lodash` full → cherry-pick (`lodash-es/pick`), or native methods.
   - Remove unused Radix/UI icon packs; tree-shake.

### Guardrails
- Check bundle analyzer for “polyfills” chunk; keep it **< 20KB** gzip.
- Keep JS shipped on initial route **< 150KB** gzip for fast 4G.

---

### 4) LCP Breakdown (Largest Contentful Paint)

### Why It Goes Red
- Hero image is big, unoptimized, or loaded late.
- Fonts block text paint, delaying LCP.
- Client-heavy hero components (carousels, motion) block main thread.

### Fix Order
1. **Optimize the LCP element**:
   - Use `next/image` (or native `loading="lazy"` elsewhere) with AVIF/WebP and correct `sizes`.
   - Mark hero image with `priority` (in Next.js) and correct `fetchpriority="high"`.
2. **Inline or preload hero CSS** so the hero layout is paintable immediately.
3. **Reduce hero JavaScript**:
   - Avoid hydration blockers in the hero; move interactive parts below the fold or lazy-load them.
   - Replace heavy animations with CSS transforms and `prefers-reduced-motion` respect.
4. **Avoid data waterfalls**: If hero depends on data, fetch server-side and render HTML-ready content.

### Guardrails
- Aim for **LCP < 2.0s** on Fast 4G, mobile emulation.
- Watch main-thread blocking time; keep **TBT < 200ms** on the hero route.

---

### 5) Forced Reflow (Layout Thrash)

### Why It Goes Red
- Measuring layout (`getBoundingClientRect`, `offsetHeight`) after mutations.
- Animating layout properties (top/left/width/height) instead of transforms.
- Inserting late-loading fonts without fallback, causing layout shift.

### Fix Order
1. **Animate transforms, not layout**: Use `transform: translate/scale/opacity` and `will-change: transform`.
2. **Batch DOM reads/writes**:
   - Read first, write later; use `requestAnimationFrame` or a tiny scheduler.
   - Avoid reading layout in the same frame after a write.
3. **Reserve space**:
   - Images with explicit width/height.
   - Font fallbacks with similar metrics; `font-display: swap` or `optional`.
4. **Virtualize long lists**; avoid rendering hundreds of nodes on load.

### Guardrails
- Use Performance panel to ensure **Layout Shifts** are minimal; CLS target **< 0.1**.
- Keep style recalculations per frame < 2ms on 60fps budget.

---

### 6) Network Dependency Tree (Unblock the Waterfall)

### Why It Goes Red
- Chained third-party scripts (analytics → tag manager → more tags).
- Multiple JS bundles serialized by `await`ed dynamic imports.
- DNS lookups for many domains before first paint.

### Fix Order
1. **Collapse third-parties**: Keep analytics to 1–2 scripts; defer heatmaps/AB tools after `load`.
2. **Preconnect** to critical origins (fonts, CDN) with `rel=preconnect`.
3. **Parallelize module loads**:
   - Avoid `await import()` chains; fire imports in parallel.
   - Split per-route bundles; lazy-load heavy components off the main path.
4. **HTTP caching**:
   - Long cache for static assets (`immutable`).
   - Avoid caching HTML; use revalidation.

### Guardrails
- Keep **domain count low** on initial load (ideally ≤ 4).
- First 14KB rule: ensure HTML + critical CSS fits in the first TCP packet where possible.

---

### 7) JavaScript Diet (The 150KB Rule)

### Checklist
- Remove unused UI kits/icons; tree-shake aggressively.
- Convert “showcase/demo” components to dynamic imports.
- Strip dev-only tooling from production bundles.
- Prefer **server components** (in Next.js) for static/SSR-able parts.

**Guardrail:** Initial JS (transfer) on the home route **≤ 150KB gzip**.

---

### 8) Images & Media Discipline

- Use AVIF/WebP; fall back to JPEG/PNG only where needed.
- Serve correct `sizes` for responsive images; avoid 2x overshoot on mobile.
- Lazy-load everything below the fold (`loading="lazy"`).
- Sprite tiny icons or use an icon font subset; avoid pulling a 300-icon pack.

**Guardrail:** Total image bytes before first interaction **≤ 250KB** on mobile.

---

### 9) Fonts Without Tears

- 1–2 families, 2 weights.
- Use `display: swap` (or `optional` for super-fast paint).
- Preload only the first paint’s fonts; lazy-load alternates.
- Self-host with `as=font` and `crossorigin`.

**Guardrail:** Font delay should not push LCP; FOUT acceptable if CLS stays stable.

---

### 10) Animations: Smooth by Design

- Prefer CSS transitions over JS-driven animations.
- Respect `prefers-reduced-motion`.
- Use `will-change: transform` sparingly; remove it after animation.
- Cap `requestAnimationFrame` work < 6ms per frame.

**Guardrail:** No long tasks > 50ms during animation entry.

---

### 11) Analytics & Third-Party Hygiene

- Load analytics **after first paint**; mark as `defer`.
- Avoid tag managers that inject more blocking scripts on the critical path.
- Consider server-side event collection to cut client JS.
- Periodically audit all third-parties; remove stale ones.

**Guardrail:** Third-party script bytes on initial route **≤ 50KB gzip**.

---

### 12) Caching & Headers That Help

- `Cache-Control: public, max-age=31536000, immutable` for hashed assets.
- `Cache-Control: no-store` or `max-age=0, must-revalidate` for HTML.
- Use **ETag** or **Last-Modified** for revalidation.
- Compression: Brotli where possible.

**Guardrail:** Repeat visit TTFB dominated by network RTT, not asset downloads.

---

### 13) Build-Time Enforcements (CI/Pre-Push)

- Add **bundle-size budgets** (fail build if > threshold).
- Run **Lighthouse CI** on key routes.
- Track **LCP**, **CLS**, **TBT** in PR checks with WebPageTest or Calibre.
- Lock browserslist to modern targets to avoid regressions.

**Guardrail:** Reject PRs that increase initial JS or push LCP over SLO.

---

### 14) Patterns for Next.js (Targeted Wins)

- Use **Server Components** for static/SSR-able sections.
- Use `next/font` with `display: swap` and subset weights.
- Use `next/image` with `priority` for LCP, `sizes`, and AVIF/WebP.
- Lazy-load heavy client components with `dynamic(() => import(...), { ssr: false })` when non-critical.
- Avoid layout shift by setting explicit dimensions on `Image` and containers.

**Guardrail:** Keep hydration cost low on the home route; measure TBT.

---

### 15) Forced Reflow Debugging Mini-Play

1. Open Performance panel → record → click through hero.
2. Filter for **Layout** and **Recalculate Style** events.
3. Identify scripts causing layout reads after writes.
4. Patch to:
   - Move reads before writes.
   - Use transforms.
   - Debounce rapid DOM changes.

Re-test until layout work per frame is minimal.

---

### 16) LCP Tuning Mini-Play

1. Identify LCP element in Lighthouse trace (usually hero image or H1).
2. Ensure:
   - It’s in the initial HTML (SSR/SSG).
   - It has `priority` (Next.js) or `fetchpriority="high"`.
   - Its CSS is in critical path (inline or early-loaded).
3. Remove blocking scripts/styles before it.
4. Re-run Lighthouse; target < 2.0s.

---

### 17) Network Waterfall Cleanup Mini-Play

1. Open Network tab, sort by **Waterfall**.
2. Mark domains; add `preconnect` for top 2–3.
3. Parallelize imports; remove serial `await import`.
4. Defer/async third-party tags.

Goal: Narrow and flatten the waterfall.

---

### 18) Measuring What Matters

- **Lab**: Lighthouse (mobile), WebPageTest (Fast 4G, Moto G).
- **Field**: Chrome UX Report (CrUX), Real User Monitoring (RUM).
- **KPIs**:
  - LCP < 2.0s (p75)
  - CLS < 0.1
  - TBT < 200ms (lab) / INP < 200ms (field)
  - JS payload < 150KB gzip initial route

Track these over time; performance is a regression game.

---

### 19) A Default Performance Checklist (Copy/Paste)

- [ ] Critical CSS inlined; non-critical deferred.
- [ ] Fonts: 1–2 families, 2 weights, `swap`/`optional`, preloaded first paint.
- [ ] Images: AVIF/WebP, explicit sizes, LCP image prioritized.
- [ ] JS: Initial < 150KB gzip; legacy/polyfills trimmed; heavy comps lazy-loaded.
- [ ] Third-parties: deferred, consolidated, < 50KB initial.
- [ ] Caching: immutable hashed assets; HTML no-cache.
- [ ] CLS: Dimensions reserved; font fallbacks; no layout jank.
- [ ] Animations: transforms only; respect reduced motion.
- [ ] Budgets in CI; Lighthouse CI per PR.

---

### 20) Red to Green: A 7-Day Action Plan

**Day 1:** Map critical path; baseline Lighthouse & bundle analyzer.  
**Day 2:** Fonts + critical CSS + LCP image optimization.  
**Day 3:** JS diet (tree-shake, dynamic imports, remove legacy/polyfills).  
**Day 4:** Third-party audit and deferral; preconnect/preload tuning.  
**Day 5:** Forced reflow fixes; reserve space; transform-only animations.  
**Day 6:** Caching headers; compression; repeat-visit checks.  
**Day 7:** Re-run Lighthouse/WebPageTest; set budgets in CI.

---

### 21) Conclusion: Performance as Product Quality

Performance isn’t a one-off task; it’s part of product quality. By treating your Lighthouse report as a map — not a verdict — and following a disciplined, ordered playbook, you can move from red to green without guesswork. Keep the budgets, keep the guardrails, and iterate with intent.

Ship fast pages. Your users (and your conversion rate) will thank you.
