1:"$Sreact.fragment"
2:I[13293,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],"Header"]
3:I[59831,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],"ScrollDock"]
4:I[22016,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],""]
5:I[18135,["/_next/static/chunks/49126f2cdc18aa3a.js","/_next/static/chunks/93e3183b9b33f2c5.js","/_next/static/chunks/d2c3814126583032.js"],"BlogDownloadButtons"]
a:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/247eb132b7f7b574.js"],"OutletBoundary"]
b:"$Sreact.suspense"
6:T8da,<p>Machine learning in production is vastly different from Jupyter notebook experiments. After years of building ML systems at scale, here are the patterns that actually work.</p>
<h2>The Reality of Production ML</h2>
<p>Most ML tutorials end where the real challenges begin. Getting a model to work locally is maybe 10% of the effort. The remaining 90% involves:</p>
<ul>
<li><strong>Data pipeline reliability</strong> - Your model is only as good as your data</li>
<li><strong>Feature consistency</strong> - Training/serving skew is a silent killer</li>
<li><strong>Model versioning</strong> - Because you will need to rollback</li>
<li><strong>Monitoring</strong> - Detecting drift before it impacts users</li>
</ul>
<h2>Architecture That Scales</h2>
<p>The key insight is treating ML systems as software systems first. This means:</p>
<h3>1. Feature Stores Are Non-Negotiable</h3>
<pre><code class="language-python">from feast import FeatureStore

store = FeatureStore(repo_path=".")

# Consistent features for training and serving
training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["user_features:age", "user_features:activity_score"]
)
</code></pre>
<h3>2. Immutable Data Pipelines</h3>
<p>Every transformation should be versioned and reproducible. Use tools like DVC or MLflow to track:</p>
<ul>
<li>Raw data versions</li>
<li>Preprocessing steps</li>
<li>Feature engineering logic</li>
</ul>
<h3>3. Shadow Deployments</h3>
<p>Never ship directly to production. Run new models in shadow mode first:</p>
<pre><code class="language-python"># Log predictions without affecting users
shadow_prediction = new_model.predict(features)
log_shadow_result(shadow_prediction, production_prediction)
</code></pre>
<h2>Monitoring Is Not Optional</h2>
<p>Set up alerts for:</p>
<ul>
<li><strong>Input drift</strong> - Feature distributions changing</li>
<li><strong>Output drift</strong> - Prediction distribution shifts</li>
<li><strong>Performance metrics</strong> - Latency, throughput, error rates</li>
</ul>
<p>The goal is catching issues before your users do.</p>
<h2>Conclusion</h2>
<p>Production ML is software engineering with statistical challenges. Treat it accordingly, and you'll build systems that actually work at scale.</p>
0:{"buildId":"RMyQ6LlelbDMeBPCOnItJ","rsc":["$","$1","c",{"children":[["$","main",null,{"className":"min-h-screen bg-background text-foreground","children":[["$","$L2",null,{}],["$","$L3",null,{}],["$","article",null,{"className":"px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20","children":[["$","$L4",null,{"href":"/posts","className":"inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left w-4 h-4 transition-transform group-hover:-translate-x-1","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}],"Back to Posts"]}],["$","header",null,{"className":"mb-12 max-w-3xl","children":[["$","div",null,{"className":"flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4","children":[["$","span",null,{"className":"flex items-center gap-1.5","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-calendar w-4 h-4","children":[["$","path","1cmpym",{"d":"M8 2v4"}],["$","path","4m81vk",{"d":"M16 2v4"}],["$","rect","1hopcy",{"width":"18","height":"18","x":"3","y":"4","rx":"2"}],["$","path","8toen8",{"d":"M3 10h18"}],"$undefined"]}],"November 15, 2024"]}],["$","span",null,{"className":"flex items-center gap-1.5","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-clock w-4 h-4","children":[["$","circle","1mglay",{"cx":"12","cy":"12","r":"10"}],["$","polyline","68esgv",{"points":"12 6 12 12 16 14"}],"$undefined"]}],"2 min read"]}]]}],["$","h1",null,{"className":"text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6","children":"Building Scalable ML Pipelines in Production"}],["$","div",null,{"className":"flex flex-wrap gap-2 mb-6","children":[["$","span","ML",{"className":"px-3 py-1 border border-border rounded-full text-xs tracking-wider","children":"ML"}],["$","span","ENGINEERING",{"className":"px-3 py-1 border border-border rounded-full text-xs tracking-wider","children":"ENGINEERING"}],["$","span","PYTHON",{"className":"px-3 py-1 border border-border rounded-full text-xs tracking-wider","children":"PYTHON"}]]}],["$","$L5",null,{"slug":"building-scalable-ml-pipelines","title":"Building Scalable ML Pipelines in Production"}]]}],["$","div",null,{"className":"prose prose-neutral dark:prose-invert max-w-3xl prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1a1a1a] prose-pre:text-[#f0f0f0] prose-blockquote:border-l-foreground/20 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-img:rounded-lg prose-li:text-muted-foreground","dangerouslySetInnerHTML":{"__html":"$6"}}]]}]]}],["$L7","$L8"],"$L9"]}],"loading":null,"isPartial":false}
7:["$","script","script-0",{"src":"/_next/static/chunks/93e3183b9b33f2c5.js","async":true}]
8:["$","script","script-1",{"src":"/_next/static/chunks/d2c3814126583032.js","async":true}]
9:["$","$La",null,{"children":["$","$b",null,{"name":"Next.MetadataOutlet","children":"$@c"}]}]
c:null
