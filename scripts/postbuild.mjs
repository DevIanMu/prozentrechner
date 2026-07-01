import fs from 'node:fs';
import path from 'node:path';

const rulesetId = process.env.NEXT_PUBLIC_USERCENTRICS_RULESET_ID?.trim();
const showAutoblocker = !!rulesetId && rulesetId !== 'YOUR_USERCENTRICS_RULESET_ID';

if (!showAutoblocker) {
  console.log('Skipping autoblocker injection: NEXT_PUBLIC_USERCENTRICS_RULESET_ID not set.');
  process.exit(0);
}

const AUTOBLOCKER_SCRIPT = '<script src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"></script>';
const AUTOBLOCKER_SRC = 'https://web.cmp.usercentrics.eu/modules/autoblocker.js';
const distDir = path.resolve('dist');

function findHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = findHtmlFiles(distDir);
let modifiedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf-8');

  // Skip if no autoblocker reference exists (e.g. _not-found page might not have it)
  if (!content.includes(AUTOBLOCKER_SRC)) {
    continue;
  }

  // Remove any existing autoblocker script tag to avoid duplicates
  content = content.replace(new RegExp(`<script src="${AUTOBLOCKER_SRC}"></script>`, 'g'), '');

  // Insert the autoblocker as the first script after <head>
  if (!content.includes(AUTOBLOCKER_SCRIPT)) {
    content = content.replace('<head>', `<head>${AUTOBLOCKER_SCRIPT}`);
    fs.writeFileSync(file, content, 'utf-8');
    modifiedCount++;
  }
}

console.log(`Injected autoblocker into ${modifiedCount} HTML files.`);
