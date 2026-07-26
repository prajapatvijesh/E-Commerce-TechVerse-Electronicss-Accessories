const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/web/src');

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

  // Replace alert('success message') with toast.success
  // Replace alert(error message) with toast.error
  // Since distinguishing programmatically is hard, let's use a heuristic:
  // If it contains "success", "Added", "submitted", it's toast.success. Otherwise toast.error.
  // Actually, we can just replace `alert(` with `toast(` but we want colors.

  content = content.replace(/alert\(([^)]+)\)/g, (match, inner) => {
    modified = true;
    const lower = inner.toLowerCase();
    if (
      lower.includes('success') ||
      lower.includes('added') ||
      lower.includes('submitted')
    ) {
      return `toast.success(${inner})`;
    } else {
      // most others are errors
      if (
        lower.includes('err.') ||
        lower.includes('failed') ||
        lower.includes('invalid') ||
        lower.includes('please') ||
        lower.includes('only compare')
      ) {
        return `toast.error(${inner})`;
      }
      return `toast(${inner})`;
    }
  });

  if (modified) {
    if (!content.includes('import toast')) {
      // Find the last import line
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
console.log('Done replacing alerts in web app');
