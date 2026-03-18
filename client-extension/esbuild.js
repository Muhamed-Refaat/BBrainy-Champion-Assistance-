const esbuild = require('esbuild');
const fs = require('fs');

const production = process.argv.includes('--production');

if (production && fs.existsSync('out/extension.js.map')) {
    fs.unlinkSync('out/extension.js.map');
}

esbuild.build({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'out/extension.js',
    external: ['vscode'],   // vscode API must remain external
    format: 'cjs',
    platform: 'node',
    target: 'node20',
    sourcemap: false,
    minify: production,
    logLevel: 'info',
}).catch(() => process.exit(1));
