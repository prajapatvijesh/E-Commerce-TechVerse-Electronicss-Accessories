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
    
    // Replace $ followed by { (JSX: ${price})
    content = content.replace(/\$\{/g, '₹{');
    
    // Replace $ followed by template interpolation (Template literal: $${price})
    content = content.replace(/\$\$\{/g, '₹${');
    
    // Replace $ followed by digits
    content = content.replace(/\$(\d+)/g, '₹$1');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
