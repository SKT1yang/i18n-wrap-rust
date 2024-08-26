import { build, Plugin } from 'vite';
import type { OutputAsset, OutputBundle, OutputChunk } from 'rollup';
import type { BuildCSSInjectionConfiguration, CSSInjectionConfiguration, PluginConfiguration } from './interface';

// 定义一个接口来存储注入CSS代码时的可选参数
interface InjectCodeOptions {
    // 可以是字符串或者一个返回字符串的函数，用于设置style标签的id属性
    styleId?: string | (() => string);
    // 布尔值，指示是否使用严格的CSP（Content Security Policy）策略
    useStrictCSP?: boolean;
    // 一个对象，其键值对将被用作style标签的其他属性，当前注释提示未来可能将styleId合并到这个对象中
    attributes?: { [key: string]: string } | undefined;
}

// 定义一个类型别名，代表注入CSS代码的函数，它接受CSS代码和注入选项，返回一个字符串形式的注入代码
export type InjectCode = (cssCode: string, options: InjectCodeOptions) => string;

// 定义另一个类型别名，代表注入CSS代码的函数，但是它不返回任何值，通常用于直接执行注入逻辑
export type InjectCodeFunction = (cssCode: string, options: InjectCodeOptions) => void;

// 定义一个特殊的字符串常量，用于在内部构建过程中标识所有CSS代码的注入点
const cssInjectedByJsId = '\0vite/all-css';
const defaultInjectCode: InjectCode = (cssCode, { styleId, useStrictCSP, attributes }) => {
    let attributesInjection = '';

    for (const attribute in attributes) {
        attributesInjection += `elementStyle.setAttribute('${attribute}', '${attributes[attribute]}');`;
    }

    return `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');${
        typeof styleId == 'string' && styleId.length > 0 ? `elementStyle.id = '${styleId}';` : ''
    }${
        useStrictCSP ? `elementStyle.nonce = document.head.querySelector('meta[property=csp-nonce]')?.content;` : ''
    }${attributesInjection}elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('vite-plugin-inject-css', e);}`;
};

export async function buildCSSInjectionCode({
    buildOptions,
    cssToInject,
    injectCode,
    injectCodeFunction,
    injectionCodeFormat = 'iife',
    styleId,
    useStrictCSP,
}: BuildCSSInjectionConfiguration): Promise<OutputChunk | null> {
    let { minify, target } = buildOptions;

    const generatedStyleId = typeof styleId === 'function' ? styleId() : styleId;

    const res = await build({
        root: '',
        configFile: false,
        logLevel: 'error',
        plugins: [
            injectionCSSCodePlugin({
                cssToInject,
                styleId: generatedStyleId,
                injectCode,
                injectCodeFunction,
                useStrictCSP,
            }),
        ],
        build: {
            write: false,
            target,
            minify,
            assetsDir: '',
            rollupOptions: {
                input: {
                    ['all-css']: cssInjectedByJsId,
                },
                output: {
                    format: injectionCodeFormat,
                    manualChunks: undefined,
                },
            },
        },
    });
    const _cssChunk = Array.isArray(res) ? res[0] : res;
    if (!('output' in _cssChunk)) return null;

    return _cssChunk.output[0];
}

export function resolveInjectionCode(
    cssCode: string,
    injectCode: ((cssCode: string, options: InjectCodeOptions) => string) | undefined,
    injectCodeFunction: ((cssCode: string, options: InjectCodeOptions) => void) | undefined,
    { styleId, useStrictCSP, attributes }: InjectCodeOptions
) {
    const injectionOptions = { styleId, useStrictCSP, attributes };
    if (injectCodeFunction) {
        return `(${injectCodeFunction})(${cssCode}, ${JSON.stringify(injectionOptions)})`;
    }
    const injectFunction = injectCode || defaultInjectCode;
    return injectFunction(cssCode, injectionOptions);
}

function injectionCSSCodePlugin({
    cssToInject,
    injectCode,
    injectCodeFunction,
    styleId,
    useStrictCSP,
}: CSSInjectionConfiguration): Plugin {
    return {
        name: 'vite:injection-css-code-plugin',
        resolveId(id: string) {
            if (id == cssInjectedByJsId) {
                return id;
            }
        },
        load(id: string) {
            if (id == cssInjectedByJsId) {
                const cssCode = JSON.stringify(cssToInject.trim());
                return resolveInjectionCode(cssCode, injectCode, injectCodeFunction, { styleId, useStrictCSP });
            }
        },
    };
}

export function removeLinkStyleSheets(html: string, cssFileName: string): string {
    const removeCSS = new RegExp(`<link rel=".*"[^>]*?href=".*/?${cssFileName}"[^>]*?>`);
    return html.replace(removeCSS, '');
}

/* istanbul ignore next -- @preserve */
export function warnLog(msg: string) {
    console.warn(`\x1b[33m \n${msg} \x1b[39m`);
}

/* istanbul ignore next -- @preserve */
export function debugLog(msg: string) {
    console.debug(`\x1b[34m \n${msg} \x1b[39m`);
}

function isJsOutputChunk(chunk: OutputAsset | OutputChunk): chunk is OutputChunk {
    return chunk.type == 'chunk' && chunk.fileName.match(/.[cm]?js(?:\?.+)?$/) != null;
}

function defaultJsAssetsFilter(chunk: OutputChunk): boolean {
    return chunk.isEntry && !chunk.fileName.includes('polyfill');
}

// The cache must be global since execution context is different every entry
const cssSourceCache: { [key: string]: string } = {};

export function extractCss(bundle: OutputBundle, cssName: string): string {
    const cssAsset = bundle[cssName] as OutputAsset;

    if (cssAsset !== undefined && cssAsset.source) {
        const cssSource = cssAsset.source;
        // We treat these as strings and coerce them implicitly to strings, explicitly handle conversion
        cssSourceCache[cssName] =
            cssSource instanceof Uint8Array ? new TextDecoder().decode(cssSource) : `${cssSource}`;
    }

    return cssSourceCache[cssName] ?? '';
}

export function concatCssAndDeleteFromBundle(bundle: OutputBundle, cssAssets: string[]): string {
    return cssAssets.reduce(function extractCssAndDeleteFromBundle(previous: string, cssName: string): string {
        const cssSource = extractCss(bundle, cssName);
        delete bundle[cssName];

        return previous + cssSource;
    }, '');
}

export function buildJsCssMap(
    bundle: OutputBundle,
    jsAssetsFilterFunction?: PluginConfiguration['jsAssetsFilterFunction']
): Record<string, string[]> {
    const chunksWithCss: Record<string, string[]> = {};

    const bundleKeys = getJsTargetBundleKeys(
        bundle,
        typeof jsAssetsFilterFunction == 'function' ? jsAssetsFilterFunction : () => true
    );
    if (bundleKeys.length === 0) {
        throw new Error(
            'Unable to locate the JavaScript asset for adding the CSS injection code. It is recommended to review your configurations.'
        );
    }

    for (const key of bundleKeys) {
        const chunk = bundle[key];
        if (chunk.type === 'asset' || !chunk.viteMetadata || chunk.viteMetadata.importedCss.size === 0) {
            continue;
        }

        const chunkStyles = chunksWithCss[key] || [];
        chunkStyles.push(...chunk.viteMetadata.importedCss.values());
        chunksWithCss[key] = chunkStyles;
    }

    return chunksWithCss;
}

export function getJsTargetBundleKeys(
    bundle: OutputBundle,
    jsAssetsFilterFunction?: PluginConfiguration['jsAssetsFilterFunction']
): string[] {
    if (typeof jsAssetsFilterFunction != 'function') {
        const jsAssets = Object.keys(bundle).filter((i) => {
            const asset = bundle[i];
            return isJsOutputChunk(asset) && defaultJsAssetsFilter(asset);
        });

        if (jsAssets.length == 0) {
            return [];
        }

        const jsTargetFileName = jsAssets[jsAssets.length - 1];
        if (jsAssets.length > 1) {
            warnLog(
                `[vite-plugin-inject-css] has identified "${jsTargetFileName}" as one of the multiple output files marked as "entry" to put the CSS injection code.` +
                    'However, if this is not the intended file to add the CSS injection code, you can use the "jsAssetsFilterFunction" parameter to specify the desired output file (read docs).'
            );
            if (process.env.VITE_CSS_INJECTED_BY_JS_DEBUG) {
                const jsAssetsStr = jsAssets.join(', ');
                debugLog(
                    `[vite-plugin-inject-css] identified js file targets: ${jsAssetsStr}. Selected "${jsTargetFileName}".\n`
                );
            }
        }

        // This should be always the root of the application
        return [jsTargetFileName];
    }

    const chunkFilter = ([_key, chunk]: [string, OutputAsset | OutputChunk]) =>
        isJsOutputChunk(chunk) && jsAssetsFilterFunction(chunk);

    return Object.entries(bundle)
        .filter(chunkFilter)
        .map(function extractAssetKeyFromBundleEntry([key]) {
            return key;
        });
}

export async function relativeCssInjection(
    bundle: OutputBundle,
    assetsWithCss: Record<string, string[]>,
    buildCssCode: (css: string) => Promise<OutputChunk | null>,
    topExecutionPriorityFlag: boolean
): Promise<void> {
    for (const [jsAssetName, cssAssets] of Object.entries(assetsWithCss)) {
        process.env.VITE_CSS_INJECTED_BY_JS_DEBUG &&
            debugLog(`[vite-plugin-inject-css] Relative CSS: ${jsAssetName}: [ ${cssAssets.join(',')} ]`);
        const assetCss = concatCssAndDeleteFromBundle(bundle, cssAssets);
        const cssInjectionCode = assetCss.length > 0 ? (await buildCssCode(assetCss))?.code : '';

        // We have already filtered these chunks to be RenderedChunks
        const jsAsset = bundle[jsAssetName] as OutputChunk;
        jsAsset.code = buildOutputChunkWithCssInjectionCode(
            jsAsset.code,
            cssInjectionCode ?? '',
            topExecutionPriorityFlag
        );
    }
}

const globalCSSCodeEntryCache = new Map();
let previousFacadeModuleId = '';

export async function globalCssInjection(
    bundle: OutputBundle,
    cssAssets: string[],
    buildCssCode: (css: string) => Promise<OutputChunk | null>,
    jsAssetsFilterFunction: PluginConfiguration['jsAssetsFilterFunction'],
    topExecutionPriorityFlag: boolean
) {
    const jsTargetBundleKeys = getJsTargetBundleKeys(bundle, jsAssetsFilterFunction);
    if (jsTargetBundleKeys.length == 0) {
        throw new Error(
            'Unable to locate the JavaScript asset for adding the CSS injection code. It is recommended to review your configurations.'
        );
    }

    process.env.VITE_CSS_INJECTED_BY_JS_DEBUG &&
        debugLog(`[vite-plugin-inject-css] Global CSS Assets: [${cssAssets.join(',')}]`);
    const allCssCode = concatCssAndDeleteFromBundle(bundle, cssAssets);
    let cssInjectionCode: string = '';

    if (allCssCode.length > 0) {
        const cssCode = (await buildCssCode(allCssCode))?.code;
        if (typeof cssCode == 'string') {
            cssInjectionCode = cssCode;
        }
    }

    for (const jsTargetKey of jsTargetBundleKeys) {
        const jsAsset = bundle[jsTargetKey] as OutputChunk;

        /**
         * Since it creates the assets once sequential builds for the same entry point
         * (for example when multiple formats of same entry point are built),
         * we need to reuse the same CSS created the first time.
         */
        if (jsAsset.facadeModuleId != null && jsAsset.isEntry && cssInjectionCode != '') {
            if (jsAsset.facadeModuleId != previousFacadeModuleId) {
                globalCSSCodeEntryCache.clear();
            }
            previousFacadeModuleId = jsAsset.facadeModuleId;
            globalCSSCodeEntryCache.set(jsAsset.facadeModuleId, cssInjectionCode);
        }
        if (
            cssInjectionCode == '' &&
            jsAsset.isEntry &&
            jsAsset.facadeModuleId != null &&
            typeof globalCSSCodeEntryCache.get(jsAsset.facadeModuleId) == 'string'
        ) {
            cssInjectionCode = globalCSSCodeEntryCache.get(jsAsset.facadeModuleId);
        }

        process.env.VITE_CSS_INJECTED_BY_JS_DEBUG &&
            debugLog(`[vite-plugin-inject-css] Global CSS inject: ${jsAsset.fileName}`);
        jsAsset.code = buildOutputChunkWithCssInjectionCode(
            jsAsset.code,
            cssInjectionCode ?? '',
            topExecutionPriorityFlag
        );
    }
}

export function buildOutputChunkWithCssInjectionCode(
    jsAssetCode: string,
    cssInjectionCode: string,
    topExecutionPriorityFlag: boolean
): string {
    const appCode = jsAssetCode.replace(/\/\*\s*empty css\s*\*\//g, '');
    jsAssetCode = topExecutionPriorityFlag ? '' : appCode;
    jsAssetCode += cssInjectionCode;
    jsAssetCode += !topExecutionPriorityFlag ? '' : appCode;

    return jsAssetCode;
}

export function clearImportedCssViteMetadataFromBundle(bundle: OutputBundle, unusedCssAssets: string[]): void {
    // Required to exclude removed files from manifest.json
    for (const key in bundle) {
        const chunk = bundle[key] as OutputChunk;
        if (chunk.viteMetadata && chunk.viteMetadata.importedCss.size > 0) {
            const importedCssFileNames = chunk.viteMetadata.importedCss;
            importedCssFileNames.forEach((importedCssFileName) => {
                if (!unusedCssAssets.includes(importedCssFileName) && chunk.viteMetadata) {
                    chunk.viteMetadata.importedCss = new Set();
                }
            });
        }
    }
}

export function isCSSRequest(request: string): boolean {
    const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

    return CSS_LANGS_RE.test(request);
}
