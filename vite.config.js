import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const pages = {"index":{"outputDir":"./","lang":"en","title":"Bar Mash - Amsterdam Gerard Douplein","cacheVersion":3,"meta":[{"name":"title","content":"Bar Mash - Amsterdam Gerard Douplein"},{"name":"description","content":"Bar MASH is a tiny bar, with a spacious sunny terrace in the centre of the buzzing Amsterdam Pijp neighborhood, just off the Albert Cuyp market. "},{"name":"image","content":"/images/mash-ico.png?_wwcv=3"},{"itemprop":"name","content":"Bar Mash - Amsterdam Gerard Douplein"},{"itemprop":"description","content":"Bar MASH is a tiny bar, with a spacious sunny terrace in the centre of the buzzing Amsterdam Pijp neighborhood, just off the Albert Cuyp market. "},{"itemprop":"image","content":"/images/mash-ico.png?_wwcv=3"},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Bar Mash - Amsterdam Gerard Douplein"},{"name":"twitter:description","content":"Bar MASH is a tiny bar, with a spacious sunny terrace in the centre of the buzzing Amsterdam Pijp neighborhood, just off the Albert Cuyp market. "},{"name":"twitter:image","content":"/images/mash-ico.png?_wwcv=3"},{"property":"og:title","content":"Bar Mash - Amsterdam Gerard Douplein"},{"property":"og:description","content":"Bar MASH is a tiny bar, with a spacious sunny terrace in the centre of the buzzing Amsterdam Pijp neighborhood, just off the Albert Cuyp market. "},{"property":"og:image","content":"/images/mash-ico.png?_wwcv=3"},{"property":"og:site_name","content":"Bar Mash - Amsterdam Gerard Douplein"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://a76a850c-a5ef-4a84-af16-07cb914dd2a9.weweb-preview.io/"},{"rel":"alternate","hreflang":"en","href":"https://a76a850c-a5ef-4a84-af16-07cb914dd2a9.weweb-preview.io/"}]}};

// Read the main HTML template
const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf-8');
const compiledTemplate = handlebars.compile(template);

// Generate an HTML file for each page with its metadata
Object.values(pages).forEach(pageConfig => {
    // Compile the template with page metadata
    const html = compiledTemplate({
        title: pageConfig.title,
        lang: pageConfig.lang,
        meta: pageConfig.meta,
        scripts: {
            head: pageConfig.scripts.head,
            body: pageConfig.scripts.body,
        },
        alternateLinks: pageConfig.alternateLinks,
        cacheVersion: pageConfig.cacheVersion,
        baseTag: pageConfig.baseTag,
    });

    // Save output html for each page
    if (!fs.existsSync(pageConfig.outputDir)) {
        fs.mkdirSync(pageConfig.outputDir, { recursive: true });
    }
    fs.writeFileSync(`${pageConfig.outputDir}/index.html`, html);
});

const rollupOptionsInput = {};
for (const pageName in pages) {
    rollupOptionsInput[pageName] = path.resolve(__dirname, pages[pageName].outputDir, 'index.html');
}

export default defineConfig(() => {
    return {
        plugins: [nodePolyfills({ include: ['events', 'stream', 'string_decoder'] }), vue()],
        base: "/",
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
            postcss: {
                plugins: [autoprefixer],
            },
        },
        build: {
            chunkSizeWarningLimit: 10000,
            rollupOptions: {
                input: rollupOptionsInput,
                onwarn: (entry, next) => {
                    if (entry.loc?.file && /js$/.test(entry.loc.file) && /Use of eval in/.test(entry.message)) return;
                    return next(entry);
                },
                maxParallelFileOps: 900,
            },
        },
        logLevel: 'warn',
    };
});
