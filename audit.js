const fs = require('fs');
const path = require('path');

const workspace = 'v:/OIL-Internship/Final Task';

const stats = {
    Folders: 0,
    Files: 0,
    TsFiles: 0,
    ReactComponents: 0,
    ApiRoutes: 0,
    Controllers: 0,
    Models: 0,
    Middleware: 0,
    Services: 0,
    Hooks: 0,
    Pages: 0,
    ReduxSlices: 0,
    Tests: 0,
    UiComponents: 0
};

const moduleData = [];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!['node_modules', '.git', 'dist', '.turbo'].includes(file)) {
                stats.Folders++;
                results = results.concat(walk(fullPath));
            }
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const allFiles = walk(workspace);

allFiles.forEach(file => {
    stats.Files++;
    const relFolder = path.dirname(file).replace(workspace, '').replace(/\\/g, '/');
    const fileName = path.basename(file);
    const lines = fs.readFileSync(file, 'utf-8').split('\n').length;
    
    if (/\.tsx?$/.test(file)) stats.TsFiles++;
    if (relFolder.endsWith('routes')) stats.ApiRoutes++;
    if (relFolder.endsWith('controllers')) stats.Controllers++;
    if (relFolder.endsWith('models')) stats.Models++;
    if (relFolder.endsWith('middleware')) stats.Middleware++;
    if (relFolder.endsWith('services')) stats.Services++;
    if (relFolder.endsWith('hooks')) stats.Hooks++;
    if (relFolder.endsWith('pages')) stats.Pages++;
    if (relFolder.endsWith('slices')) stats.ReduxSlices++;
    if (relFolder.match(/tests|__tests__/)) stats.Tests++;
    if (relFolder.includes('packages/ui')) stats.UiComponents++;
    if (/\.tsx$/.test(file)) stats.ReactComponents++;

    moduleData.push({
        Folder: relFolder || '/',
        File: fileName,
        Lines: lines
    });
});

const grouped = moduleData.reduce((acc, obj) => {
    const key = obj.Folder;
    if (!acc[key]) acc[key] = [];
    acc[key].push(obj);
    return acc;
}, {});

Object.keys(grouped).forEach(folder => {
    console.log(`Folder: ${folder}`);
    grouped[folder].forEach(f => {
        console.log(`  ${f.File} - ${f.Lines} lines`);
    });
});

console.log('STATISTICS');
console.log(JSON.stringify(stats, null, 2));
