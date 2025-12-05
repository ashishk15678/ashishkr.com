1:"$Sreact.fragment"
2:I[89554,["/_next/static/chunks/49126f2cdc18aa3a.js"],"ThemeProvider"]
3:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"default"]
4:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"default"]
5:I[2355,["/_next/static/chunks/49126f2cdc18aa3a.js"],"Analytics"]
6:I[13293,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"Header"]
7:I[59831,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"ScrollDock"]
8:I[9846,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"TextReveal"]
9:I[2257,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"BlogCard"]
13:I[68027,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"default"]
:HL["/_next/static/chunks/8a80e7184ad3a13f.css","style"]
:HL["/_next/static/chunks/a5c8c6f78a01ab0b.css","style"]
:HL["/_next/static/media/797e433ab948586e-s.p.dbea232f.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/media/caa3a2e1cccd8315-s.p.853070df.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
a:T785,Machine learning in production is vastly different from Jupyter notebook experiments. After years of building ML systems at scale, here are the patterns that actually work.

## The Reality of Production ML

Most ML tutorials end where the real challenges begin. Getting a model to work locally is maybe 10% of the effort. The remaining 90% involves:

- **Data pipeline reliability** - Your model is only as good as your data
- **Feature consistency** - Training/serving skew is a silent killer
- **Model versioning** - Because you will need to rollback
- **Monitoring** - Detecting drift before it impacts users

## Architecture That Scales

The key insight is treating ML systems as software systems first. This means:

### 1. Feature Stores Are Non-Negotiable

```python
from feast import FeatureStore

store = FeatureStore(repo_path=".")

# Consistent features for training and serving
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["user_features:age", "user_features:activity_score"]
)
```

### 2. Immutable Data Pipelines

Every transformation should be versioned and reproducible. Use tools like DVC or MLflow to track:

- Raw data versions
- Preprocessing steps
- Feature engineering logic

### 3. Shadow Deployments

Never ship directly to production. Run new models in shadow mode first:

```python
# Log predictions without affecting users
shadow_prediction = new_model.predict(features)
log_shadow_result(shadow_prediction, production_prediction)
```

## Monitoring Is Not Optional

Set up alerts for:

- **Input drift** - Feature distributions changing
- **Output drift** - Prediction distribution shifts
- **Performance metrics** - Latency, throughput, error rates

The goal is catching issues before your users do.

## Conclusion

Production ML is software engineering with statistical challenges. Treat it accordingly, and you'll build systems that actually work at scale.b:T880,---
title: "Building Scalable ML Pipelines in Production"
excerpt: "A deep dive into designing and implementing machine learning pipelines that can handle real-world scale and complexity."
date: "2024-11-15"
tags: ["ML", "ENGINEERING", "PYTHON"]
---

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

```python
from feast import FeatureStore

store = FeatureStore(repo_path=".")

# Consistent features for training and serving
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["user_features:age", "user_features:activity_score"]
)
```

### 2. Immutable Data Pipelines

Every transformation should be versioned and reproducible. Use tools like DVC or MLflow to track:

- Raw data versions
- Preprocessing steps
- Feature engineering logic

### 3. Shadow Deployments

Never ship directly to production. Run new models in shadow mode first:

```python
# Log predictions without affecting users
shadow_prediction = new_model.predict(features)
log_shadow_result(shadow_prediction, production_prediction)
```

## Monitoring Is Not Optional

Set up alerts for:

- **Input drift** - Feature distributions changing
- **Output drift** - Prediction distribution shifts
- **Performance metrics** - Latency, throughput, error rates

The goal is catching issues before your users do.

## Conclusion

Production ML is software engineering with statistical challenges. Treat it accordingly, and you'll build systems that actually work at scale.0:{"P":null,"b":"RMyQ6LlelbDMeBPCOnItJ","c":["","posts"],"q":"","i":false,"f":[[["",{"children":["posts",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/8a80e7184ad3a13f.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","link","1",{"rel":"stylesheet","href":"/_next/static/chunks/a5c8c6f78a01ab0b.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/49126f2cdc18aa3a.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":["$","body",null,{"className":"font-sans antialiased","children":["$","$L2",null,{"attribute":"class","defaultTheme":"system","enableSystem":true,"children":[["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}],["$","$L5",null,{}]]}]}]}]]}],{"children":[["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["$","$1","c",{"children":[["$","main",null,{"className":"min-h-screen bg-background text-foreground","children":[["$","$L6",null,{}],["$","$L7",null,{}],["$","div",null,{"className":"px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20","children":[["$","div",null,{"className":"mb-10 md:mb-16","data-inspectable":true,"children":[["$","h1",null,{"className":"text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-3 md:mb-4 section-title","children":["$","$L8",null,{"children":"Posts"}]}],["$","p",null,{"className":"text-sm md:text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300","children":"Thoughts on software engineering, machine learning, and building products that matter."}]]}],["$","div",null,{"className":"border-t border-border","children":[["$","$L9","building-scalable-ml-pipelines",{"blog":{"slug":"building-scalable-ml-pipelines","title":"Building Scalable ML Pipelines in Production","excerpt":"A deep dive into designing and implementing machine learning pipelines that can handle real-world scale and complexity.","date":"2024-11-15","readTime":"2 min read","tags":["ML","ENGINEERING","PYTHON"],"content":"$a","rawContent":"$b"}}],"$Lc","$Ld"]}]]}]]}],["$Le","$Lf","$L10"],"$L11"]}],{},null,false,false]},null,false,false]},null,false,false],"$L12",false]],"m":"$undefined","G":["$13",[]],"S":true}
18:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"OutletBoundary"]
19:"$Sreact.suspense"
1b:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"ViewportBoundary"]
1d:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"MetadataBoundary"]
14:T881,After writing TypeScript for several years, certain patterns have become essential to how I build software. These aren't just type tricks—they fundamentally change how you think about code structure.

## Discriminated Unions for State

Stop using boolean flags for state management:

```typescript
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
```

Now TypeScript enforces that you handle every state correctly.

## Builder Pattern with Type Safety

```typescript
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
```

## Branded Types for Domain Safety

Prevent mixing up primitive types that represent different things:

```typescript
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'u_123' as UserId;
const orderId = 'o_456' as OrderId;

getUser(userId);  // OK
getUser(orderId); // Type error!
```

## The Result Type

Handle errors explicitly instead of throwing:

```typescript
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
```

## Conclusion

These patterns make impossible states unrepresentable. That's the real power of TypeScript—not just catching typos, but encoding business logic into the type system.15:T976,---
title: "TypeScript Patterns That Changed How I Code"
excerpt: "Advanced TypeScript patterns and techniques that improve code quality, maintainability, and developer experience."
date: "2024-10-28"
tags: ["TYPESCRIPT", "PATTERNS", "DX"]
---

After writing TypeScript for several years, certain patterns have become essential to how I build software. These aren't just type tricks—they fundamentally change how you think about code structure.

## Discriminated Unions for State

Stop using boolean flags for state management:

```typescript
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
```

Now TypeScript enforces that you handle every state correctly.

## Builder Pattern with Type Safety

```typescript
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
```

## Branded Types for Domain Safety

Prevent mixing up primitive types that represent different things:

```typescript
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'u_123' as UserId;
const orderId = 'o_456' as OrderId;

getUser(userId);  // OK
getUser(orderId); // Type error!
```

## The Result Type

Handle errors explicitly instead of throwing:

```typescript
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
```

## Conclusion

These patterns make impossible states unrepresentable. That's the real power of TypeScript—not just catching typos, but encoding business logic into the type system.c:["$","$L9","typescript-patterns-for-better-code",{"blog":{"slug":"typescript-patterns-for-better-code","title":"TypeScript Patterns That Changed How I Code","excerpt":"Advanced TypeScript patterns and techniques that improve code quality, maintainability, and developer experience.","date":"2024-10-28","readTime":"2 min read","tags":["TYPESCRIPT","PATTERNS","DX"],"content":"$14","rawContent":"$15"}}]
16:T7ab,I've been the first engineer at three startups. Each one taught me something different about building products under pressure.

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

What matters: solving real problems for real users, as quickly as possible.17:T89d,---
title: "Engineering Lessons from Three Startups"
excerpt: "Hard-won insights about building products, managing technical debt, and scaling teams from my startup journey."
date: "2024-09-12"
tags: ["STARTUPS", "LEADERSHIP", "CAREER"]
---

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

What matters: solving real problems for real users, as quickly as possible.d:["$","$L9","lessons-from-startup-engineering",{"blog":{"slug":"lessons-from-startup-engineering","title":"Engineering Lessons from Three Startups","excerpt":"Hard-won insights about building products, managing technical debt, and scaling teams from my startup journey.","date":"2024-09-12","readTime":"2 min read","tags":["STARTUPS","LEADERSHIP","CAREER"],"content":"$16","rawContent":"$17"}}]
e:["$","script","script-0",{"src":"/_next/static/chunks/9447debaa4751417.js","async":true,"nonce":"$undefined"}]
f:["$","script","script-1",{"src":"/_next/static/chunks/7b5d68f36522a5e0.js","async":true,"nonce":"$undefined"}]
10:["$","script","script-2",{"src":"/_next/static/chunks/d2c3814126583032.js","async":true,"nonce":"$undefined"}]
11:["$","$L18",null,{"children":["$","$19",null,{"name":"Next.MetadataOutlet","children":"$@1a"}]}]
12:["$","$1","h",{"children":[null,["$","$L1b",null,{"children":"$@1c"}],["$","div",null,{"hidden":true,"children":["$","$L1d",null,{"children":["$","$19",null,{"name":"Next.Metadata","children":"$@1e"}]}]}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}]
1c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
1f:I[27201,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"IconMark"]
1e:[["$","title","0",{"children":"Ashish Kumar | Full-stack & ML Engineer"}],["$","meta","1",{"name":"description","content":"Full-stack & ML Engineer turning complex problems into elegant solutions. Building scalable systems and intelligent applications."}],["$","meta","2",{"name":"generator","content":"v0.app"}],["$","link","3",{"rel":"icon","href":"/favicon.jpeg","media":"/favicon.jpeg"}],["$","link","4",{"rel":"apple-touch-icon","href":"/favicon.jpeg"}],["$","$L1f","5",{}]]
1a:null
