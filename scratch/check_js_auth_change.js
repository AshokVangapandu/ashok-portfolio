const fs = require('fs');
const content = fs.readFileSync('d:/GitHub/ashok-portfolio/js/main.js', 'utf8');

let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('onAuthStateChange')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
