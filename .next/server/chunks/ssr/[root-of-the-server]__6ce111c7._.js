module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70864,a=>{a.n(a.i(33290))},43619,a=>{a.n(a.i(79962))},13718,a=>{a.n(a.i(85523))},18198,a=>{a.n(a.i(45518))},62212,a=>{a.n(a.i(66114))},96752,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/header.tsx <module evaluation>","Header");a.s(["Header",0,b])},78311,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/header.tsx","Header");a.s(["Header",0,b])},83007,a=>{"use strict";a.i(96752);var b=a.i(78311);a.n(b)},88899,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call ScrollDock() from the server but ScrollDock is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/scroll-dock.tsx <module evaluation>","ScrollDock");a.s(["ScrollDock",0,b])},68454,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call ScrollDock() from the server but ScrollDock is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/scroll-dock.tsx","ScrollDock");a.s(["ScrollDock",0,b])},70257,a=>{"use strict";a.i(88899);var b=a.i(68454);a.n(b)},50227,(a,b,c)=>{b.exports=a.x("node:path",()=>require("node:path"))},59639,(a,b,c)=>{b.exports=a.x("node:process",()=>require("node:process"))},57764,(a,b,c)=>{b.exports=a.x("node:url",()=>require("node:url"))},62711,51212,16552,a=>{"use strict";var b=a.i(50227);a.s(["minpath",()=>b.default],62711);var c=a.i(59639);a.s(["minproc",()=>c.default],51212);var d=a.i(57764);a.s(["urlToPath",()=>d.fileURLToPath],16552)},9144,1269,a=>{"use strict";let b=[{slug:"building-scalable-ml-pipelines",title:"Building Scalable ML Pipelines in Production",excerpt:"A deep dive into designing and implementing machine learning pipelines that can handle real-world scale and complexity.",date:"2024-11-15",tags:["ML","ENGINEERING","PYTHON"],content:`
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
    `.trim()},{slug:"typescript-patterns-for-better-code",title:"TypeScript Patterns That Changed How I Code",excerpt:"Advanced TypeScript patterns and techniques that improve code quality, maintainability, and developer experience.",date:"2024-10-28",tags:["TYPESCRIPT","PATTERNS","DX"],content:`
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
    `.trim()},{slug:"lessons-from-startup-engineering",title:"Engineering Lessons from Three Startups",excerpt:"Hard-won insights about building products, managing technical debt, and scaling teams from my startup journey.",date:"2024-09-12",tags:["STARTUPS","LEADERSHIP","CAREER"],content:`
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
    `.trim()}];function c(){return b.map(a=>a.slug)}function d(a){let c,d=b.find(b=>b.slug===a);return d?{slug:d.slug,title:d.title,excerpt:d.excerpt,date:d.date,readTime:(c=Math.ceil(d.content.split(/\s+/).length/200),`${c} min read`),tags:d.tags,content:d.content,rawContent:`---
title: "${d.title}"
excerpt: "${d.excerpt}"
date: "${d.date}"
tags: [${d.tags.map(a=>`"${a}"`).join(", ")}]
---

${d.content}`}:null}function e(){return b.map(a=>d(a.slug)).filter(a=>null!==a).sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())}a.s(["getAllBlogSlugs",()=>c,"getAllBlogs",()=>e,"getBlogBySlug",()=>d],9144);var f=a.i(717);let g=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,f.forwardRef)(({color:a="currentColor",size:b=24,strokeWidth:c=2,absoluteStrokeWidth:d,className:e="",children:i,iconNode:j,...k},l)=>(0,f.createElement)("svg",{ref:l,...h,width:b,height:b,stroke:a,strokeWidth:d?24*Number(c)/Number(b):c,className:g("lucide",e),...k},[...j.map(([a,b])=>(0,f.createElement)(a,b)),...Array.isArray(i)?i:[i]])),j=(a,b)=>{let c=(0,f.forwardRef)(({className:c,...d},e)=>(0,f.createElement)(i,{ref:e,iconNode:b,className:g(`lucide-${a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,c),...d}));return c.displayName=`${a}`,c};a.s(["default",()=>j],1269)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__6ce111c7._.js.map