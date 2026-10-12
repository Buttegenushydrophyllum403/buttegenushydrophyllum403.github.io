// Runs after `next build` (npm "postbuild") to finish the static export for GitHub Pages.
//  1. /cv and /resume: Pages can't do server redirects, so they become tiny pages that forward to
//     the CV named in content/profile.json.
//  2. Link-preview images: Next exports them as extensionless "opengraph-image" files, which Pages
//     would serve as application/octet-stream. Rename them to .png and point the pages at the new name.
import { mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const out = join(root, "out");

// 1. Static redirects
const { cvPath } = JSON.parse(readFileSync(join(root, "content", "profile.json"), "utf8"));
const redirect = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>CV</title>
<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${cvPath}">
<link rel="canonical" href="${cvPath}"></head>
<body><a href="${cvPath}">Open the CV</a></body></html>
`;
for (const dir of ["cv", "resume"]) {
  mkdirSync(join(out, dir), { recursive: true });
  writeFileSync(join(out, dir, "index.html"), redirect);
}

// 2. Link-preview images
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
})(out);

let images = 0;
for (const file of files.filter((f) => f.endsWith("/opengraph-image"))) {
  renameSync(file, `${file}.png`);
  images++;
}
let pages = 0;
for (const file of files.filter((f) => /\.(html|txt)$/.test(f))) {
  const text = readFileSync(file, "utf8");
  const fixed = text.replace(/\/opengraph-image\?/g, "/opengraph-image.png?");
  if (fixed !== text) {
    writeFileSync(file, fixed);
    pages++;
  }
}

console.log(`postbuild: /cv and /resume -> ${cvPath}; ${images} preview images renamed to .png, ${pages} files updated`);
