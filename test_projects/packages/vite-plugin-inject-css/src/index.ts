import {
    buildCSSInjectionCode,
    buildJsCssMap,
    clearImportedCssViteMetadataFromBundle,
    globalCssInjection,
    isCSSRequest,
    relativeCssInjection,
    removeLinkStyleSheets,
    resolveInjectionCode,
    warnLog,
} from './utils.js';
import type { OutputAsset } from 'rollup';
import type { Plugin, ResolvedConfig } from 'vite';
import type { DevOptions, PluginConfiguration } from './interface';

/**
 * Inject the CSS compiled with JS.
 *
 * @return {Plugin}
 */
export default function cssInjectedByJsPlugin({
    cssAssetsFilterFunction,
    dev: { enableDev, removeStyleCode, removeStyleCodeFunction } = {} as DevOptions,
    injectCode,
    injectCodeFunction,
    injectionCodeFormat,
    jsAssetsFilterFunction,
    preRenderCSSCode,
    relativeCSSInjection,
    styleId,
    suppressUnusedCssWarning,
    topExecutionPriority,
    useStrictCSP,
}: PluginConfiguration | undefined = {}): Plugin[] {
    let config: ResolvedConfig;

    const topExecutionPriorityFlag = typeof topExecutionPriority == 'boolean' ? topExecutionPriority : true;

    const plugins: Plugin[] = [
        {
            apply: 'build',
            enforce: 'post',
            name: 'vite-plugin-inject-css',
            config(config, env) {
                if (env.command === 'build') {
                    if (!config.build) {
                        config.build = {};
                    }

                    if (relativeCSSInjection == true) {
                        if (config.build.cssCodeSplit == false) {
                            config.build.cssCodeSplit = true;
                            warnLog(
                                `[vite-plugin-inject-css] Override of 'build.cssCodeSplit' option to true, it must be true when 'relativeCSSInjection' is enabled.`
                            );
                        }
                    }
                }
            },
            configResolved(_config) {
                config = _config;
            },
            // 异步方法用于生成最终的bundle，主要处理CSS的注入
            async generateBundle(opts, bundle) {
                // 如果配置为SSR模式，则直接返回，不进行后续处理
                if (config.build.ssr) {
                    return;
                }

                // 构建CSS注入代码的函数
                const buildCssCode = (cssToInject: string) => 
                    buildCSSInjectionCode({
                        // 使用当前的构建配置
                        buildOptions: config.build,
                        // 根据preRenderCSSCode函数处理待注入的CSS代码
                        cssToInject: 
                            typeof preRenderCSSCode == 'function' ? preRenderCSSCode(cssToInject) : cssToInject,
                        // 注入代码相关的函数和配置
                        injectCode,
                        injectCodeFunction,
                        injectionCodeFormat,
                        styleId,
                        useStrictCSP,
                    });

                // 过滤CSS资源的函数
                const cssAssetsFilter = (asset: OutputAsset): boolean => 
                    typeof cssAssetsFilterFunction == 'function' ? cssAssetsFilterFunction(asset) : true;

                // 筛选出CSS资源
                const cssAssets = Object.keys(bundle).filter(
                    (i) => 
                        // 确保类型为asset且文件名为.css
                        bundle[i].type == 'asset' && 
                        bundle[i].fileName.endsWith('.css') &&
                        // 应用过滤函数
                        cssAssetsFilter(bundle[i] as OutputAsset)
                );

                let unusedCssAssets: string[] = []; // 初始化未使用的CSS资源数组

                // 如果相对路径的CSS注入被启用
                if (relativeCSSInjection) {
                    // 构建JS和CSS资源的映射关系
                    const assetsWithCss = buildJsCssMap(bundle, jsAssetsFilterFunction);
                    // 执行相对路径的CSS注入
                    await relativeCssInjection(bundle, assetsWithCss, buildCssCode, topExecutionPriorityFlag);

                    // 筛选出未被使用的CSS资源
                    unusedCssAssets = cssAssets.filter((cssAsset) => !!bundle[cssAsset]);
                    if (!suppressUnusedCssWarning) {
                        // 输出未被使用的CSS资源警告
                        const unusedCssAssetsString = unusedCssAssets.join(',');
                        unusedCssAssetsString.length > 0 &&
                            warnLog(`[vite-plugin-inject-css] Some CSS assets were not included in any known JS: ${unusedCssAssetsString}`);
                    }
                } else {
                    // 获取所有CSS资源
                    const allCssAssets = Object.keys(bundle).filter(
                        (i) => 
                            bundle[i].type == 'asset' && 
                            bundle[i].fileName.endsWith('.css')
                    );

                    // 筛选出未被使用的CSS资源
                    unusedCssAssets = allCssAssets.filter(cssAsset => !cssAssets.includes(cssAsset));

                    // 执行全局CSS注入
                    await globalCssInjection(
                        bundle,
                        cssAssets,
                        buildCssCode,
                        jsAssetsFilterFunction,
                        topExecutionPriorityFlag
                    );
                }

                // 清理未使用CSS资源的元数据
                clearImportedCssViteMetadataFromBundle(bundle, unusedCssAssets);

                // 筛选出HTML文件
                const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith('.html'));
                for (const name of htmlFiles) {
                    const htmlChunk = bundle[name] as OutputAsset;
                    let replacedHtml = 
                        // 将Uint8Array转换为字符串
                        htmlChunk.source instanceof Uint8Array 
                            ? new TextDecoder().decode(htmlChunk.source) 
                            : `${htmlChunk.source}`;

                    // 遍历CSS资源，移除未使用的链接样式表
                    cssAssets.forEach(cssName => {
                        if (!unusedCssAssets.includes(cssName)) {
                            replacedHtml = removeLinkStyleSheets(replacedHtml, cssName);
                            htmlChunk.source = replacedHtml;
                        }
                    });
                }
            },
        },
    ];

    if (enableDev) {
        warnLog(
            '[vite-plugin-inject-css] Experimental dev mode activated! Please, for any error open a issue.'
        );

        plugins.push({
            name: 'vite-plugin-inject-css-dev',
            apply: 'serve',
            enforce: 'post',
            transform(src, id) {
                if (isCSSRequest(id)) {
                    const defaultRemoveStyleCode = (devId: string) => `{
                        (function removeStyleInjected() {
                            const elementsToRemove = document.querySelectorAll("style[data-vite-dev-id='${devId}']");
                            elementsToRemove.forEach(element => {
                                element.remove();
                            });
                        })()
                    }`;

                    let removeStyleFunction: (id: string) => string = removeStyleCode || defaultRemoveStyleCode;
                    if (removeStyleCodeFunction) {
                        removeStyleFunction = (id) => `(${removeStyleCodeFunction})("${id}")`;
                    }

                    // removeStyleFunction is called before since the function that inject the CSS doesn't handle the update case required in dev mode.
                    let injectionCode = src.replace(
                        '__vite__updateStyle(__vite__id, __vite__css)',
                        ';\n' +
                            removeStyleFunction(id) +
                            ';\n' +
                            resolveInjectionCode('__vite__css', injectCode, injectCodeFunction, {
                                attributes: { type: 'text/css', ['data-vite-dev-id']: id },
                            })
                    );

                    injectionCode = injectionCode.replace('__vite__removeStyle(__vite__id)', removeStyleFunction(id));

                    return {
                        code: injectionCode,
                        map: null,
                    };
                }
            },
        });
    }

    return plugins;
}
