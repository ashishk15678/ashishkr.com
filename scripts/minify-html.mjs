#!/usr/bin/env node

/**
 * Post-build HTML Minification Script
 *
 * Runs after `next build` to aggressively minify all generated HTML files
 * in the `.next` output directory and any exported static HTML.
 *
 * This makes View Source a compressed wall of text — not nicely formatted
 * readable markup — while preserving all SEO-critical elements.
 *
 * Preserves:
 *   - All <meta>, <title>, <link>, structured data (JSON-LD)
 *   - Semantic HTML (article, section, nav, h1-h6, main, etc.)
 *   - Open Graph / Twitter Card meta tags
 *   - Content inside <pre>, <code>, <script>, <style>, <textarea>, <svg>
 *   - aria-* and role attributes
 *   - Valid HTML structure
 *
 * Strips:
 *   - HTML comments (except IE conditionals)
 *   - Excessive whitespace between tags
 *   - Newlines, tabs, carriage returns outside preserved blocks
 *   - Trailing whitespace
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

// Tags whose inner content must NOT have whitespace collapsed
const PRESERVE_TAGS = ["pre", "code", "script", "style", "textarea", "svg"];

/**
 * Minify an HTML string by collapsing whitespace and stripping comments,
 * while preserving content inside whitespace-sensitive tags.
 */
function minifyHtml(html) {
  // Step 1: Extract preserved blocks and replace with placeholders
  const preserved = [];
  let processed = html;

  for (const tag of PRESERVE_TAGS) {
    const regex = new RegExp(`(<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>)`, "gi");
    processed = processed.replace(regex, (match) => {
      const index = preserved.length;
      preserved.push(match);
      return `\x00PRESERVE_${index}\x00`;
    });
  }

  // Step 2: Remove HTML comments (keep IE conditionals)
  processed = processed.replace(
    /<!--(?!\[if)(?!\[endif)[\s\S]*?-->/g,
    ""
  );

  // Step 3: Collapse all runs of whitespace into a single space
  processed = processed.replace(/\s+/g, " ");

  // Step 4: Remove space between > and <
  processed = processed.replace(/>\s+</g, "><");

  // Step 5: Clean up tag internals
  processed = processed.replace(/\s*\/>/g, "/>");
  processed = processed.replace(/<\s+/g, "<");
  processed = processed.replace(/\s+>/g, ">");

  // Step 6: Remove spaces around = in attributes
  processed = processed.replace(/\s*=\s*"/g, '="');
  processed = processed.replace(/\s*=\s*'/g, "='");

  // Step 7: Normalize doctype
  processed = processed.replace(/<!DOCTYPE\s+html\s*>/i, "<!DOCTYPE html>");

  // Step 8: Restore preserved blocks
  for (let i = 0; i < preserved.length; i++) {
    processed = processed.replace(`\x00PRESERVE_${i}\x00`, preserved[i]);
  }

  return processed.trim();
}

/**
 * Recursively find all .html files in a directory tree
 */
async function findHtmlFiles(dir) {
  const results = [];

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and .git
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const nested = await findHtmlFiles(fullPath);
      results.push(...nested);
    } else if (entry.isFile() && extname(entry.name) === ".html") {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Process .next/server directory for rendered HTML in RSC payloads
 * and any prerendered .html files
 */
async function main() {
  const startTime = Date.now();
  const rootDir = process.cwd();

  // Directories to scan for HTML files
  const scanDirs = [
    join(rootDir, ".next", "server"),
    join(rootDir, ".next", "static"),
    join(rootDir, "out"), // for `next export` / static export
  ];

  let totalFiles = 0;
  let totalSavedBytes = 0;

  for (const dir of scanDirs) {
    // Check if directory exists
    try {
      await stat(dir);
    } catch {
      continue;
    }

    const htmlFiles = await findHtmlFiles(dir);

    for (const filePath of htmlFiles) {
      try {
        const original = await readFile(filePath, "utf-8");
        const minified = minifyHtml(original);

        const savedBytes = Buffer.byteLength(original) - Buffer.byteLength(minified);

        if (savedBytes > 0) {
          await writeFile(filePath, minified, "utf-8");
          totalFiles++;
          totalSavedBytes += savedBytes;

          const relativePath = filePath.replace(rootDir + "/", "");
          const percent = ((savedBytes / Buffer.byteLength(original)) * 100).toFixed(1);
          console.log(
            `  ✓ ${relativePath}  (-${formatBytes(savedBytes)}, ${percent}%)`
          );
        }
      } catch (err) {
        console.error(`  ✗ Error processing ${filePath}: ${err.message}`);
      }
    }
  }

  // Also minify any .html files that Next.js generates for prerendered pages
  // These live in .next/server/app/**/*.html
  const appDir = join(rootDir, ".next", "server", "app");
  try {
    await stat(appDir);
    const appHtmlFiles = await findHtmlFiles(appDir);

    for (const filePath of appHtmlFiles) {
      // Skip if already processed (findHtmlFiles may have caught it above)
      try {
        const original = await readFile(filePath, "utf-8");
        const minified = minifyHtml(original);
        const savedBytes = Buffer.byteLength(original) - Buffer.byteLength(minified);

        if (savedBytes > 0) {
          await writeFile(filePath, minified, "utf-8");
          totalFiles++;
          totalSavedBytes += savedBytes;
        }
      } catch {
        // Skip files we can't process
      }
    }
  } catch {
    // appDir doesn't exist, that's fine
  }

  const elapsed = Date.now() - startTime;

  console.log("");
  console.log(
    `  HTML minification complete: ${totalFiles} files, saved ${formatBytes(totalSavedBytes)} in ${elapsed}ms`
  );
  console.log("");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

console.log("");
console.log("  ▸ Minifying HTML output...");
console.log("");

main().catch((err) => {
  console.error("HTML minification failed:", err);
  process.exit(1);
});
