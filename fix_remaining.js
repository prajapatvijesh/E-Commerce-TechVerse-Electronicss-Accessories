const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace $ followed by { when it's at the start of a line or after spaces, BUT not inside a template literal.
  // A simple heuristic: if it's not inside backticks, or we can just replace ALL `${` with `₹{` EXCEPT when preceded by \ or inside backticks... wait, that's complex.
  // Let's just replace all `${` with `₹{` if it's on a line that looks like JSX (has tags) or just do it specifically.
  
  // Replace:
  // "                  ${"  -> "                  ₹{"
  content = content.replace(/^(\s*)\$\{/gm, '$1₹{');
  
  // "                     ${" -> "                     ₹{"
  
  // ">${"
  content = content.replace(/>\$\{/g, '>₹{');
  // "> ${"
  content = content.replace(/>\s\$\{/g, '> ₹{');
  
  // " ${"
  // content = content.replace(/ \$\{/g, ' ₹{'); // Too risky, might hit template literals? Template literals are inside backticks. e.g. `Bearer ${token}`. So "Bearer ${" has " ${". We can't do this.

  // Let's just do targeted replaces for the known occurrences.
  content = content.replace(/\$\{item.price.toFixed\(2\)\}/g, '₹{item.price.toFixed(2)}');
  content = content.replace(/\$\{cartItems.reduce/g, '₹{cartItems.reduce');
  content = content.replace(/\$\{\(item.qty \* item.price\).toFixed\(2\)\}/g, '₹{(item.qty * item.price).toFixed(2)}');
  content = content.replace(/\$\{\(itemsPrice - discountAmount \+ 0 \+ Number\(\(0.15 \* \(itemsPrice - discountAmount\)\).toFixed\(2\)\)\).toFixed\(2\)\}/g, '₹{(itemsPrice - discountAmount + 0 + Number((0.15 * (itemsPrice - discountAmount)).toFixed(2))).toFixed(2)}');
  content = content.replace(/\$\{\(item.salePrice \|\| item.price\)\?.toFixed\(2\)\}/g, '₹{(item.salePrice || item.price)?.toFixed(2)}');
  content = content.replace(/\$\{item.price\?.toFixed\(2\)\}/g, '₹{item.price?.toFixed(2)}');
  content = content.replace(/\$\{order.totalPrice\?.toFixed\(2\)\}/g, '₹{order.totalPrice?.toFixed(2)}');
  content = content.replace(/\$\{item.price\}/g, '₹{item.price}');
  content = content.replace(/\$\{product.price\?.toFixed\(2\)\}/g, '₹{product.price?.toFixed(2)}');
  content = content.replace(/\$\{\(product.salePrice \|\| product.price\)\?.toFixed\(2\)\}/g, '₹{(product.salePrice || product.price)?.toFixed(2)}');
  content = content.replace(/\$\{\(item.price \* item.qty\).toFixed\(2\)\}/g, '₹{(item.price * item.qty).toFixed(2)}');
  content = content.replace(/\$\{product.price\}/g, '₹{product.price}');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath);
    else if (dirPath.endsWith('.tsx')) fixFile(dirPath);
  });
}

walkDir('./apps/web/src');
walkDir('./apps/admin/src');
