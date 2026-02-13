const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
    try {
        // Clean dist
        if (fs.existsSync('dist')) {
            fs.rmSync('dist', { recursive: true, force: true });
        }

        await esbuild.build({
            entryPoints: ['src/webview/main.tsx'],
            bundle: true,
            outfile: 'dist/webview.js',
            platform: 'browser',
            loader: { '.tsx': 'tsx', '.css': 'css' },
            define: { 'process.env.NODE_ENV': '"production"' },
            logLevel: 'info'
        });
        console.log('Build complete');
    } catch (e) {
        console.error('Build failed:', e);
        process.exit(1);
    }
}

build();
