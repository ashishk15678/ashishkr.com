1:"$Sreact.fragment"
2:I[13293,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],"Header"]
3:I[59831,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],"ScrollDock"]
4:I[22016,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],""]
5:I[18135,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],"BlogDownloadButtons"]
a:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"OutletBoundary"]
b:"$Sreact.suspense"
6:T984,<p>After writing TypeScript for several years, certain patterns have become essential to how I build software. These aren't just type tricks—they fundamentally change how you think about code structure.</p>
<h2>Discriminated Unions for State</h2>
<p>Stop using boolean flags for state management:</p>
<pre><code class="language-typescript">// Instead of this
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
</code></pre>
<p>Now TypeScript enforces that you handle every state correctly.</p>
<h2>Builder Pattern with Type Safety</h2>
<pre><code class="language-typescript">class QueryBuilder&#x3C;T extends object = {}> {
  private query: T = {} as T;

  where&#x3C;K extends string, V>(
    key: K,
    value: V
  ): QueryBuilder&#x3C;T &#x26; Record&#x3C;K, V>> {
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
</code></pre>
<h2>Branded Types for Domain Safety</h2>
<p>Prevent mixing up primitive types that represent different things:</p>
<pre><code class="language-typescript">type Brand&#x3C;T, B> = T &#x26; { __brand: B };

type UserId = Brand&#x3C;string, 'UserId'>;
type OrderId = Brand&#x3C;string, 'OrderId'>;

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'u_123' as UserId;
const orderId = 'o_456' as OrderId;

getUser(userId);  // OK
getUser(orderId); // Type error!
</code></pre>
<h2>The Result Type</h2>
<p>Handle errors explicitly instead of throwing:</p>
<pre><code class="language-typescript">type Result&#x3C;T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(id: string): Promise&#x3C;Result&#x3C;User>> {
  try {
    const user = await api.getUser(id);
    return { ok: true, value: user };
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
</code></pre>
<h2>Conclusion</h2>
<p>These patterns make impossible states unrepresentable. That's the real power of TypeScript—not just catching typos, but encoding business logic into the type system.</p>
0:{"buildId":"RMyQ6LlelbDMeBPCOnItJ","rsc":["$","$1","c",{"children":[["$","main",null,{"className":"min-h-screen bg-background text-foreground","children":[["$","$L2",null,{}],["$","$L3",null,{}],["$","article",null,{"className":"px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20","children":[["$","$L4",null,{"href":"/posts","className":"inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left w-4 h-4 transition-transform group-hover:-translate-x-1","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}],"Back to Posts"]}],["$","header",null,{"className":"mb-12 max-w-3xl","children":[["$","div",null,{"className":"flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4","children":[["$","span",null,{"className":"flex items-center gap-1.5","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-calendar w-4 h-4","children":[["$","path","1cmpym",{"d":"M8 2v4"}],["$","path","4m81vk",{"d":"M16 2v4"}],["$","rect","1hopcy",{"width":"18","height":"18","x":"3","y":"4","rx":"2"}],["$","path","8toen8",{"d":"M3 10h18"}],"$undefined"]}],"October 28, 2024"]}],["$","span",null,{"className":"flex items-center gap-1.5","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-clock w-4 h-4","children":[["$","circle","1mglay",{"cx":"12","cy":"12","r":"10"}],["$","polyline","68esgv",{"points":"12 6 12 12 16 14"}],"$undefined"]}],"2 min read"]}]]}],["$","h1",null,{"className":"text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6","children":"TypeScript Patterns That Changed How I Code"}],["$","div",null,{"className":"flex flex-wrap gap-2 mb-6","children":[["$","span","TYPESCRIPT",{"className":"px-3 py-1 border border-border rounded-full text-xs tracking-wider","children":"TYPESCRIPT"}],["$","span","PATTERNS",{"className":"px-3 py-1 border border-border rounded-full text-xs tracking-wider","children":"PATTERNS"}],["$","span","DX",{"className":"px-3 py-1 border border-border rounded-full text-xs tracking-wider","children":"DX"}]]}],["$","$L5",null,{"slug":"typescript-patterns-for-better-code","title":"TypeScript Patterns That Changed How I Code"}]]}],["$","div",null,{"className":"prose prose-neutral dark:prose-invert max-w-3xl prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1a1a1a] prose-pre:text-[#f0f0f0] prose-blockquote:border-l-foreground/20 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-img:rounded-lg prose-li:text-muted-foreground","dangerouslySetInnerHTML":{"__html":"$6"}}]]}]]}],["$L7","$L8"],"$L9"]}],"loading":null,"isPartial":false}
7:["$","script","script-0",{"src":"/_next/static/chunks/93e3183b9b33f2c5.js","async":true}]
8:["$","script","script-1",{"src":"/_next/static/chunks/d2c3814126583032.js","async":true}]
9:["$","$La",null,{"children":["$","$b",null,{"name":"Next.MetadataOutlet","children":"$@c"}]}]
c:null
