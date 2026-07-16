const fs = require('fs');
const content = fs.readFileSync('d:/GitHub/ashok-portfolio/index.html', 'utf8');

let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('data-contact-form')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
