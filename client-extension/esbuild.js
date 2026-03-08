const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'out/extension.js',
    external: ['vscode'],   // vscode API must remain external
    format: 'cjs',
    platform: 'node',
    target: 'node20',
    sourcemap: true,
    minify: false,
    logLevel: 'info',
}).catch(() => process.exit(1));
