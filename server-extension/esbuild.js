const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');
const isWebview = process.argv.includes('--webview');

// Problem matcher plugin
const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',
    setup(build) {
        build.onStart(() => {
            console.log('[watch] build started');
        });
        build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                if (location) {
                    console.error(`    ${location.file}:${location.line}:${location.column}:`);
                }
            });
            console.log('[watch] build finished');
        });
    },
};

const extensionConfig = {
    entryPoints: ["src/backend/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "silent",
    plugins: [esbuildProblemMatcherPlugin],
};

// --- Tailwind/PostCSS plugin ---
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const tailwindConfigPath = path.join(__dirname, "tailwind.config.js");

const tailwindPostCssPlugin = {
    name: "tailwind-postcss",
    setup(build) {
        build.onLoad({ filter: /\.css$/, namespace: "file" }, async (args) => {
            const css = await fs.promises.readFile(args.path, "utf8");
            const result = await postcss([
                tailwindcss({ config: tailwindConfigPath }),
                autoprefixer,
            ]).process(css, { from: args.path });
            return { contents: result.css, loader: "css", resolveDir: path.dirname(args.path) };
        });
    },
};

const webviewConfig = {
    entryPoints: ["src/frontend/src/main.tsx"],
    bundle: true,
    format: "esm",
    minify: production,
    sourcemap: !production,
    platform: "browser",
    outdir: "dist",
    entryNames: "monitor-webview",
    assetNames: "[name]",
    loader: { ".tsx": "tsx", ".ts": "ts", ".css": "css" },
    logLevel: "silent",
    plugins: [esbuildProblemMatcherPlugin, tailwindPostCssPlugin],
    define: {
        "process.env.NODE_ENV": production ? '"production"' : '"development"',
    },
};

async function main() {
    const config = isWebview ? webviewConfig : extensionConfig;
    const ctx = await esbuild.context(config);

    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
