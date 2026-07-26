const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/admin/src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let modified = false;

  content = content.replace(/alert\(([^)]+)\)/g, (match, inner) => {
    modified = true;
    const lower = inner.toLowerCase();
    if (
      lower.includes('success') ||
      lower.includes('added') ||
      lower.includes('submitted') ||
      lower.includes('deleted')
    ) {
      return `toast.success(${inner})`;
    } else {
      if (
        lower.includes('err.') ||
        lower.includes('failed') ||
        lower.includes('error')
      ) {
        return `toast.error(${inner})`;
      }
      return `toast(${inner})`;
    }
  });

  if (modified) {
    if (!content.includes('import toast')) {
      const importMatches = [...content.matchAll(/^import .* from '.*';/gm)];
      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const index = lastImport.index + lastImport[0].length;
        content =
          content.slice(0, index) +
          "\nimport toast from 'react-hot-toast';" +
          content.slice(index);
      } else {
        content = "import toast from 'react-hot-toast';\n" + content;
      }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

walkDir(srcDir, processFile);
console.log('Done replacing alerts in admin app');
