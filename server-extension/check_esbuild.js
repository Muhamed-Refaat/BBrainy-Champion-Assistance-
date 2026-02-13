try {
    require('esbuild');
    console.log('ESBUILD LOADED SUCCESS');
} catch (e) {
    console.error('ESBUILD LOAD FAILED:', e.message);
}
