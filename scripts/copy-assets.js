const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy js folder to dist/js
copyDir('js', 'dist/js');
console.log('Static js directory copied to dist/js successfully!');

// Copy assets subfolders
copyDir('assets/images', 'dist/assets/images');
copyDir('assets/icons', 'dist/assets/icons');
copyDir('assets/documents', 'dist/assets/documents');
console.log('Static assets subdirectories copied successfully!');
