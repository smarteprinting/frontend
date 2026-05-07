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
    { src: 'all-in-one-printers', dest: 'product-category/all-in-one-printers' },
    { src: 'inkjet-printers', dest: 'product-category/inkjet-printers' },
    { src: 'laser-printers', dest: 'product-category/laser-printers' },
    { src: 'ink-toner', dest: 'product-category/ink-toner' },
    { src: 'blogs', dest: 'blogs' },
    { src: 'customer-service', dest: 'customer-service' },
    { src: 'about', dest: 'about' }
];

routes.forEach(route => {
    const isObject = typeof route === 'object';
    const routeName = isObject ? route.dest : route;
    const srcName = isObject ? route.src : route;

    const routeDir = path.join(distDir, routeName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }

    // Copy the HTML file as index.html in the subdirectory
    const sourceFile = path.join(distDir, `${srcName}.html`);
    const destFile = path.join(routeDir, 'index.html');

    if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
        console.log(`Created: ${routeName}/index.html`);
    }
});

console.log('Done! Subdirectories created with index.html files.');