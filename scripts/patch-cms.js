import fs from 'node:fs';
import path from 'node:path';

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[patch-cms] Successfully patched ${filePath}`);
  }
}

// 1. Patch @keystatic/astro
const astroDistPath = path.resolve('node_modules/@keystatic/astro/dist/keystatic-astro.js');
replaceInFile(astroDistPath, [
  ["pattern: '/keystatic/[...params]'", "pattern: '/cms/[...params]'"],
  ['pattern: "/keystatic/[...params]"', 'pattern: "/cms/[...params]"'],
]);

const astroApiDistPath = path.resolve('node_modules/@keystatic/astro/dist/keystatic-astro-api.js');
replaceInFile(astroApiDistPath, [
  ["import { getSecret } from 'astro:env/server';", "const getSecret = (key) => process.env[key];"],
  ['import { getSecret } from "astro:env/server";', 'const getSecret = (key) => process.env[key];'],
]);

// 2. Patch @keystatic/core dist files
const coreDistDir = path.resolve('node_modules/@keystatic/core/dist');
if (fs.existsSync(coreDistDir)) {
  const files = fs.readdirSync(coreDistDir);
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.mjs')) {
      const fullPath = path.join(coreDistDir, file);
      replaceInFile(fullPath, [
        ['basePath = "/keystatic"', 'basePath = "/cms"'],
        ["basePath = '/keystatic'", "basePath = '/cms'"],
        ['/keystatic/branch/', '/cms/branch/'],
        ['startsWidth("/keystatic")', 'startsWith("/cms")'],
        ['startsWith("/keystatic")', 'startsWith("/cms")'],
        ['replace(/^\\/keystatic\\/?/, "")', 'replace(/^\\/cms\\/?/, "")'],
        ['new URL("/keystatic", deployedURL)', 'new URL("/cms", deployedURL)'],
        ['`${window.location.origin}/keystatic`', '`${window.location.origin}/cms`'],
        ['children: "Regenerate"', 'children: "重新生成"'],
        ['"aria-label": "regenerate"', '"aria-label": "重新生成"'],
      ]);
    }
  }
}

console.log('[patch-cms] Finished applying /cms path patch.');
