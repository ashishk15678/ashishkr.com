1:"$Sreact.fragment"
2:I[13293,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"Header"]
3:I[59831,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"ScrollDock"]
4:I[9846,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"TextReveal"]
5:I[2257,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/9447debaa4751417.js","/_next/static/chunks/7b5d68f36522a5e0.js","/_next/static/chunks/d2c3814126583032.js"],"BlogCard"]
12:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"OutletBoundary"]
13:"$Sreact.suspense"
6:T785,Machine learning in production is vastly different from Jupyter notebook experiments. After years of building ML systems at scale, here are the patterns that actually work.

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

Production ML is software engineering with statistical challenges. Treat it accordingly, and you'll build systems that actually work at scale.7:T880,---
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

Production ML is software engineering with statistical challenges. Treat it accordingly, and you'll build systems that actually work at scale.0:{"buildId":"RMyQ6LlelbDMeBPCOnItJ","rsc":["$","$1","c",{"children":[["$","main",null,{"className":"min-h-screen bg-background text-foreground","children":[["$","$L2",null,{}],["$","$L3",null,{}],["$","div",null,{"className":"px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20","children":[["$","div",null,{"className":"mb-10 md:mb-16","data-inspectable":true,"children":[["$","h1",null,{"className":"text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-3 md:mb-4 section-title","children":["$","$L4",null,{"children":"Posts"}]}],["$","p",null,{"className":"text-sm md:text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300","children":"Thoughts on software engineering, machine learning, and building products that matter."}]]}],["$","div",null,{"className":"border-t border-border","children":[["$","$L5","building-scalable-ml-pipelines",{"blog":{"slug":"building-scalable-ml-pipelines","title":"Building Scalable ML Pipelines in Production","excerpt":"A deep dive into designing and implementing machine learning pipelines that can handle real-world scale and complexity.","date":"2024-11-15","readTime":"2 min read","tags":["ML","ENGINEERING","PYTHON"],"content":"$6","rawContent":"$7"}}],"$L8","$L9"]}]]}]]}],["$La","$Lb","$Lc"],"$Ld"]}],"loading":null,"isPartial":false}
e:T881,After writing TypeScript for several years, certain patterns have become essential to how I build software. These aren't just type tricks—they fundamentally change how you think about code structure.

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

These patterns make impossible states unrepresentable. That's the real power of TypeScript—not just catching typos, but encoding business logic into the type system.f:T976,---
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

These patterns make impossible states unrepresentable. That's the real power of TypeScript—not just catching typos, but encoding business logic into the type system.8:["$","$L5","typescript-patterns-for-better-code",{"blog":{"slug":"typescript-patterns-for-better-code","title":"TypeScript Patterns That Changed How I Code","excerpt":"Advanced TypeScript patterns and techniques that improve code quality, maintainability, and developer experience.","date":"2024-10-28","readTime":"2 min read","tags":["TYPESCRIPT","PATTERNS","DX"],"content":"$e","rawContent":"$f"}}]
10:T7ab,I've been the first engineer at three startups. Each one taught me something different about building products under pressure.

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

What matters: solving real problems for real users, as quickly as possible.11:T89d,---
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

What matters: solving real problems for real users, as quickly as possible.9:["$","$L5","lessons-from-startup-engineering",{"blog":{"slug":"lessons-from-startup-engineering","title":"Engineering Lessons from Three Startups","excerpt":"Hard-won insights about building products, managing technical debt, and scaling teams from my startup journey.","date":"2024-09-12","readTime":"2 min read","tags":["STARTUPS","LEADERSHIP","CAREER"],"content":"$10","rawContent":"$11"}}]
a:["$","script","script-0",{"src":"/_next/static/chunks/9447debaa4751417.js","async":true}]
b:["$","script","script-1",{"src":"/_next/static/chunks/7b5d68f36522a5e0.js","async":true}]
c:["$","script","script-2",{"src":"/_next/static/chunks/d2c3814126583032.js","async":true}]
d:["$","$L12",null,{"children":["$","$13",null,{"name":"Next.MetadataOutlet","children":"$@14"}]}]
14:null
