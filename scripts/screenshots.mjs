// Captures Expo web screenshots of the main routes at 390 × 844, 1× scale.
//
// Usage:
//   npm run screenshots                  # every main route
//   npm run screenshots -- journal /more # only the listed routes
//
// Output goes to $OOVA_RUN_DIR when set, otherwise .screenshots/.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const ROUTES = ['/', '/journal', '/calendar', '/insights', '/more', '/scan'];
const VIEWPORT = { width: 390, height: 844 };

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

function normalizeRoute(arg) {
    const trimmed = arg.trim().replace(/^\/+|\/+$/g, '');
    return trimmed === '' || trimmed === 'index' ? '/' : `/${trimmed}`;
}

function fileNameFor(route) {
    return route === '/' ? 'index.png' : `${route.slice(1).replaceAll('/', '-')}.png`;
}

function resolveRoutes(args) {
    if (args.length === 0) return ROUTES;
    const routes = [...new Set(args.map(normalizeRoute))];
    const unknown = routes.filter((route) => !ROUTES.includes(route));
    if (unknown.length > 0) {
        console.error(`Unknown route(s): ${unknown.join(', ')}. Known routes: ${ROUTES.join(', ')}`);
        process.exit(1);
    }
    return routes;
}

function exportWeb(outputDir) {
    const result = spawnSync('npx', ['expo', 'export', '--platform', 'web', '--output-dir', outputDir], {
        stdio: ['ignore', 'inherit', 'inherit'],
        env: { ...process.env, CI: '1' },
    });
    if (result.status !== 0) {
        console.error('expo export failed.');
        process.exit(result.status ?? 1);
    }
}

// Serves the static export, mapping /journal to journal.html like a static host.
function serve(rootDir) {
    const root = resolve(rootDir);
    const server = createServer((req, res) => {
        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
        const base = normalize(join(root, pathname));
        if (!base.startsWith(root)) {
            res.writeHead(403).end();
            return;
        }
        const candidates = [base, `${base}.html`, join(base, 'index.html')];
        const file = candidates.find((path) => existsSync(path) && statSync(path).isFile());
        if (!file) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(file)] ?? 'application/octet-stream' });
        res.end(readFileSync(file));
    });
    return new Promise((resolvePromise) => {
        server.listen(0, '127.0.0.1', () => resolvePromise(server));
    });
}

async function main() {
    const routes = resolveRoutes(process.argv.slice(2));
    const outDir = resolve(process.env.OOVA_RUN_DIR || '.screenshots');
    mkdirSync(outDir, { recursive: true });

    const exportDir = mkdtempSync(join(tmpdir(), 'oova-web-'));
    let server;
    let browser;
    try {
        exportWeb(exportDir);
        server = await serve(exportDir);
        const { port } = server.address();

        browser = await chromium.launch();
        const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
        const page = await context.newPage();
        for (const route of routes) {
            await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle' });
            await page.evaluate(() => document.fonts.ready);
            const path = join(outDir, fileNameFor(route));
            await page.screenshot({ path });
            console.log(`${route} -> ${path}`);
        }
    } finally {
        await browser?.close();
        server?.close();
        rmSync(exportDir, { recursive: true, force: true });
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
