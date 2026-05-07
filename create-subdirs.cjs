const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Define static routes
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

async function generateSubdirs() {
    console.log('Generating static subdirectories...');

    // 1. Handle Static Routes
    routes.forEach(route => {
        const isObject = typeof route === 'object';
        const routeName = isObject ? route.dest : route;
        const srcName = isObject ? route.src : route;

        const routeDir = path.join(distDir, routeName);

        if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
        }

        const sourceFile = path.join(distDir, `${srcName}.html`);
        const destFile = path.join(routeDir, 'index.html');

        if (fs.existsSync(sourceFile)) {
            fs.copyFileSync(sourceFile, destFile);
            console.log(`Created: ${routeName}/index.html`);
        }
    });

    // 2. Handle Dynamic Product Routes
    console.log('Fetching products for dynamic HTML generation...');
    try {
        const response = await fetch('https://backend-lake-five-62.vercel.app/api/products');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        const products = data.products || [];
        console.log(`Found ${products.length} products. Generating HTML...`);

        const baseHtmlPath = path.join(distDir, 'index.html');
        if (fs.existsSync(baseHtmlPath)) {
            const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

            products.forEach(product => {
                const identifier = product.slug || product._id;
                if (!identifier) return;

                const productDir = path.join(distDir, 'product', identifier);
                if (!fs.existsSync(productDir)) {
                    fs.mkdirSync(productDir, { recursive: true });
                }

                // Prepare dynamic SEO tags
                const title = `${product.title} | Buy Online - Smart ePrinting`;
                const desc = (product.shortDetails || product.description || '').replace(/<[^>]*>?/gm, '').substring(0, 160).trim();
                const keywords = `${product.brand}, ${product.title}, buy printer online, printer sale`;
                const url = `https://smarteprinting.com/product/${identifier}/`;
                
                let productHtml = baseHtml;
                productHtml = productHtml.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
                productHtml = productHtml.replace(/<meta name="description".*?>/s, `<meta name="description" content="${desc}" />`);
                productHtml = productHtml.replace(/<meta name="keywords".*?>/s, `<meta name="keywords" content="${keywords}" />`);
                productHtml = productHtml.replace(/<link rel="canonical".*?>/s, `<link rel="canonical" href="${url}" />`);
                productHtml = productHtml.replace(/<meta property="og:title".*?>/s, `<meta property="og:title" content="${title}" />`);
                productHtml = productHtml.replace(/<meta property="og:description".*?>/s, `<meta property="og:description" content="${desc}" />`);
                productHtml = productHtml.replace(/<meta property="og:url".*?>/s, `<meta property="og:url" content="${url}" />`);
                productHtml = productHtml.replace(/<meta name="twitter:title".*?>/s, `<meta name="twitter:title" content="${title}" />`);
                productHtml = productHtml.replace(/<meta name="twitter:description".*?>/s, `<meta name="twitter:description" content="${desc}" />`);

                if (product.images && product.images.length > 0) {
                    const imgUrl = product.images[0].startsWith('http') ? product.images[0] : `https://backend-lake-five-62.vercel.app${product.images[0]}`;
                    productHtml = productHtml.replace(/<meta property="og:image".*?>/s, `<meta property="og:image" content="${imgUrl}" />`);
                    productHtml = productHtml.replace(/<meta name="twitter:image".*?>/s, `<meta name="twitter:image" content="${imgUrl}" />`);
                }

                fs.writeFileSync(path.join(productDir, 'index.html'), productHtml);
                console.log(`Created dynamic product HTML: product/${identifier}/index.html`);
            });
        }
    } catch (error) {
        console.error('Failed to generate dynamic product HTML:', error.message);
    }

    console.log('Done! All static and dynamic subdirectories created with index.html files.');
}

generateSubdirs();