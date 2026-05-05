const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Create subdirectories with index.html for each route
const routes = [
    'model-search',
    'smart-printer-setup-guide',
    'complete-setup',
    'installation-failed',
    'select-your-brand',
];

routes.forEach(route => {
    const routeDir = path.join(distDir, route);

    // Create directory if it doesn't exist
    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }

    // Copy the HTML file as index.html in the subdirectory
    const sourceFile = path.join(distDir, `${route}.html`);
    const destFile = path.join(routeDir, 'index.html');

    if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
        console.log(`Created: ${route}/index.html`);
    }
});

console.log('Done! Subdirectories created with index.html files.');