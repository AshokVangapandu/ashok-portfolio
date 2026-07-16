const fs = require('fs');
const content = fs.readFileSync('d:/GitHub/ashok-portfolio/js/main.js', 'utf8');

const elements = [
  'header', 'navToggle', 'navMenu', 'cursorLight', 'magneticItems',
  'expertiseGrid', 'buildFlow', 'anchorLinks', 'navSectionLinks',
  'whatsappLinks', 'contactForm'
];

let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let el of elements) {
    // Look for unsafe access like: element.
    if (line.includes(`${el}.`) && !line.includes(`${el}?.`) && !line.includes(`const ${el}`) && !line.includes(`let ${el}`)) {
      console.log(`Line ${i + 1} (${el}): ${line.trim()}`);
    }
  }
}
