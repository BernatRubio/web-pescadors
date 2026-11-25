// Regenerates apps/web/src/styles/tokens.css from DESIGN.md (the design source of truth).
// Usage: pnpm design:tokens
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const css = execFileSync('design.md', ['export', 'DESIGN.md', '--format', 'css-tailwind'], {
  encoding: 'utf8',
});
const header = '/* Generated from DESIGN.md by `pnpm design:tokens`. Do not edit by hand. */\n';
writeFileSync('apps/web/src/styles/tokens.css', `${header}${css.trimEnd()}\n`);
console.log('Wrote apps/web/src/styles/tokens.css');
