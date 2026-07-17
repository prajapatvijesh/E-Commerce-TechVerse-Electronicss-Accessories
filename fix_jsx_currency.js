const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./apps', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace specific JSX currency patterns
    content = content.replace(/>\$\{/g, '>₹{');
    content = content.replace(/> \$\{/g, '> ₹{');
    content = content.replace(/-\$\{/g, '-₹{');
    content = content.replace(/Price: \$\{/g, 'Price: ₹{');
    content = content.replace(/\(\+\$\{/g, '(+₹{');
    content = content.replace(/"\$\{/g, '"₹{'); // e.g. placeholder="${price}"

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed JSX currency in: ' + filePath);
    }
  }
});
