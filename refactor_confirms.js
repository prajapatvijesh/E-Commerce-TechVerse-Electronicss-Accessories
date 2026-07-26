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
  if (!filePath.endsWith('.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We are looking for something like:
  // if (window.confirm('Are you sure you want to delete this product?')) {
  // or window.confirm(`...`)

  if (!content.includes('window.confirm')) return;

  // 1. Add import { useConfirm } from '@techverse/ui';
  if (!content.includes('useConfirm')) {
    const importMatches = [...content.matchAll(/^import .* from '.*';/gm)];
    if (importMatches.length > 0) {
      const lastImport = importMatches[importMatches.length - 1];
      const index = lastImport.index + lastImport[0].length;
      content =
        content.slice(0, index) +
        "\nimport { useConfirm } from '@techverse/ui';" +
        content.slice(index);
    }
  }

  // 2. Inject `const { confirm } = useConfirm();` inside the component body.
  // Assuming the default export or the main functional component.
  // A quick way is to find `const queryClient = useQueryClient();` or similar hooks and place it there.
  // Let's just find `const { user } = useSelector(` or `const [searchTerm` or `const [isModalOpen`
  content = content.replace(
    /(const \[?[a-zA-Z0-9_]+\]? = useState[^;]*;)/,
    'const { confirm } = useConfirm();\n  $1'
  );

  // 3. Replace the delete handler.
  // const handleDelete = (id: string) => {
  //   if (window.confirm('Are you sure you want to delete this product?')) {
  //     deleteMutation.mutate(id);
  //   }
  // };

  // We can use regex to find the handleDelete or whatever function contains window.confirm.
  // It's safer to just replace `if (window.confirm(...))` with a confirm call, but it requires `async`.
  // Since we only have 6 files, let's just do a smart regex or replace manually in the script.

  content = content.replace(
    /(const (handle[A-Za-z]+|delete[A-Za-z]+|update[A-Za-z]+) = )(\([^)]*\) => {)\s*if\s*\(window\.confirm\(([^)]+)\)\)\s*{/g,
    "$1async $3\n    const isConfirmed = await confirm({ title: 'Confirmation', message: $4, confirmText: 'Confirm' });\n    if (isConfirmed) {"
  );

  // If there are other inline ones like onClick={() => { if (window.confirm(...)) ... }}
  content = content.replace(
    /async (\([^)]*\) => {)\s*if\s*\(window\.confirm\(([^)]+)\)\)\s*{/g,
    "async $1\n    const isConfirmed = await confirm({ title: 'Confirmation', message: $2, confirmText: 'Confirm' });\n    if (isConfirmed) {"
  );

  // For the case where the function wasn't matched because of spacing:
  content = content.replace(
    /if\s*\(window\.confirm\(([^)]+)\)\)\s*{/g,
    "const isConfirmed = await confirm({ title: 'Confirmation', message: $1, confirmText: 'Confirm' });\n    if (isConfirmed) {"
  );

  // Note: This might cause `await` inside a non-async function if the first regex didn't catch the function declaration.
  // Let's also ensure `const handleDelete = (id: string) => {` becomes `const handleDelete = async (id: string) => {` if it contains `await confirm`.
  content = content.replace(
    /const ([a-zA-Z0-9_]+) = (\([^)]*\)) => {\s*(const isConfirmed = await confirm)/g,
    'const $1 = async $2 => {\n    $3'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', filePath);
}

walkDir(srcDir, processFile);
console.log('Done replacing confirms');
