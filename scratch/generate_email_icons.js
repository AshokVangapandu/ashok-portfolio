// scratch/generate_email_icons.js
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const assetsDir = path.resolve('assets/images');
const distAssetsDir = path.resolve('dist/assets/images');

const icons = {
  'email-icon-portfolio.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="16" fill="#0070F3" fill-opacity="0.15"/>
    <rect x="1" y="1" width="62" height="62" rx="15" stroke="#0070F3" stroke-opacity="0.3" stroke-width="2"/>
    <circle cx="32" cy="32" r="14" stroke="#00D2FF" stroke-width="2.5"/>
    <ellipse cx="32" cy="32" rx="6.5" ry="14" stroke="#00D2FF" stroke-width="2.5"/>
    <line x1="18" y1="32" x2="46" y2="32" stroke="#00D2FF" stroke-width="2.5"/>
  </svg>`,

  'email-icon-linkedin.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="16" fill="#0A66C2"/>
    <path d="M22 26H28V44H22V26Z" fill="white"/>
    <circle cx="25" cy="20" r="3.5" fill="white"/>
    <path d="M32 26H38V28.5C38.9 26.8 41 25.5 43.8 25.5C49.5 25.5 50.5 29.2 50.5 34.2V44H44.5V35.5C44.5 33.2 44.1 30.5 41.2 30.5C38.2 30.5 37.8 32.8 37.8 35.5V44H32V26Z" fill="white"/>
  </svg>`,

  'email-icon-github.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="32" fill="#24292E"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M32 16C23.16 16 16 23.16 16 32C16 39.08 20.58 45.06 26.94 47.18C27.74 47.32 28.04 46.84 28.04 46.42C28.04 46.04 28.02 44.78 28.02 43.44C23.58 44.4 22.64 41.52 22.64 41.52C21.92 39.68 20.86 39.18 20.86 39.18C19.42 38.18 20.98 38.2 20.98 38.2C22.58 38.32 23.42 39.84 23.42 39.84C24.84 42.28 27.14 41.58 28.04 41.16C28.18 40.14 28.6 39.42 29.04 39.02C25.5 38.62 21.78 37.24 21.78 31.12C21.78 29.38 22.4 27.96 23.42 26.84C23.26 26.44 22.7 24.82 23.58 22.62C23.58 22.62 24.92 22.2 27.98 24.26C29.26 23.9 30.64 23.72 32 23.72C33.36 23.72 34.74 23.9 36.02 24.26C39.08 22.2 40.42 22.62 40.42 22.62C41.3 24.82 40.74 26.44 40.58 26.84C41.6 27.96 42.22 29.38 42.22 31.12C42.22 37.26 38.48 38.6 34.92 39C35.5 39.5 36 40.46 36 41.96C36 44.1 35.98 45.82 35.98 46.42C35.98 46.84 36.26 47.34 37.08 47.18C43.42 45.06 48 39.08 48 32C48 23.16 40.84 16 32 16Z" fill="white"/>
  </svg>`,

  'email-icon-clock.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" fill="#6C3CFF" fill-opacity="0.2" stroke="#8F85FF" stroke-opacity="0.4" stroke-width="2"/>
    <circle cx="32" cy="32" r="15" stroke="#C084FC" stroke-width="2.5"/>
    <polyline points="32 23 32 32 37 35" stroke="#C084FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'email-icon-check.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="#10B981" fill-opacity="0.2"/>
    <circle cx="16" cy="16" r="13" stroke="#10B981" stroke-width="1.5"/>
    <polyline points="10 16 14 20 22 12" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
};

for (const [name, svg] of Object.entries(icons)) {
  const svgPath = path.join(assetsDir, name);
  const pngName = name.replace('.svg', '.png');
  const pngPath = path.join(assetsDir, pngName);
  const distPngPath = path.join(distAssetsDir, pngName);

  fs.writeFileSync(svgPath, svg, 'utf-8');
  execSync(`npx -y sharp-cli -i "${svgPath}" -o "${pngPath}" resize 64`);
  fs.copyFileSync(pngPath, distPngPath);
  console.log('Generated:', pngName);
}
