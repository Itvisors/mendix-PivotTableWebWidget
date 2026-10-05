import { basename, dirname, extname } from "node:path";

// The default widget config writes each widget bundle to a single file (output.file). ExcelJS is loaded with a
// dynamic import on export, so Rollup has to write it as a separate chunk, which requires output.dir instead.
// Only the widget bundles (AMD .js and ES .mjs) are changed, the editor config and preview bundles stay as they are.
export default args => {
    const configs = args.configDefaultConfig;

    return configs.map(config => {
        const { output } = config;
        if (!output?.file || !["amd", "es"].includes(output.format)) {
            return config;
        }

        const fileName = basename(output.file);
        const extension = extname(fileName);
        const { file, ...otherOutputOptions } = output;
        return {
            ...config,
            output: {
                ...otherOutputOptions,
                dir: dirname(file),
                entryFileNames: fileName,
                chunkFileNames: "[name]-[hash]" + extension
            }
        };
    });
};
