/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-23 14:35:56
 * @path: \icons\src\build.ts
 */
import {
  importDirectory,
  cleanupSVG,
  runSVGO,
  parseColors,
  isEmptyColor,
  exportIconPackage,
  exportToDirectory,
  exportJSONPackage,
  type IconSet,
} from '@iconify/tools';
import fs from 'fs';
import { readPackageJSON } from 'pkg-types';

const prefix = 'base';
const distPath = 'dist';
const initIconsPath = 'src/icons';
const IconifyIconsPath = `${distPath}/${prefix}/icons`;
const IconifyJsonPath = `${distPath}/${prefix}/json`;

async function runBuild() {
  runBuildIconifyIconsPackage();
  runBuildIconifyJsonPackage();
}

async function runBuildIconifyIconsPackage(iconSet?: IconSet) {
  if (!iconSet) {
    iconSet = await getIconSetBySvgDirectory();
  }
  await buildIconJsPackage(iconSet);
  await buildIconDirectory(iconSet);
  await buildIconJson(iconSet);
  await buildIconJs(iconSet);
}

async function runBuildIconifyJsonPackage(iconSet?: IconSet) {
  if (!iconSet) {
    iconSet = await getIconSetBySvgDirectory();
  }
  await buildIconJSONPackage(iconSet);
}
/**
 * 获取源svg文件iconSet
 */
async function getIconSetBySvgDirectory() {
  const initIconSet = await getInitIconSetBySvgDirectory();
  const parseColorIconSet = await getParseColorIconSetBySvgDirectory();
  const deviceIconSet = await getDeviceIconSetBySvgDirectory();
  Object.assign(
    initIconSet.entries,
    parseColorIconSet.entries,
    deviceIconSet.entries
  );
  // Export
  return initIconSet;
}

/**
 * 不进行颜色转换的icon
 */
async function getInitIconSetBySvgDirectory() {
  // Import icons
  const iconSet: IconSet = await importDirectory(initIconsPath, {
    prefix: prefix,
  });

  // Validate, clean up, fix palette and optimise
  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon') {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      await cleanupSVG(svg);

      // Optimise
      await runSVGO(svg);
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);
  });

  // Export
  return iconSet;
}

/**
 * 进行颜色转换的icon
 */
async function getParseColorIconSetBySvgDirectory() {
  // Import icons
  const iconSet: IconSet = await importDirectory(
    `${initIconsPath}/parse-color`,
    {
      prefix: prefix,
    }
  );

  // Validate, clean up, fix palette and optimise
  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon') {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      await cleanupSVG(svg);

      // Assume icon is monotone: replace color with currentColor, add if missing
      // If icon is not monotone, remove this code
      await parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : 'currentColor';
        },
      });

      // Optimise
      await runSVGO(svg);
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);
  });

  // Export
  return iconSet;
}

/**
 * 设备类型icon
 */
async function getDeviceIconSetBySvgDirectory() {
  // Import icons
  const iconSet: IconSet = await importDirectory(`${initIconsPath}/device`, {
    prefix: `${prefix}`,
  });

  // Validate, clean up, fix palette and optimise
  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon') {
      return;
    }

    const svg = iconSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      iconSet.remove(name);
      return;
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      await cleanupSVG(svg);

      // Assume icon is monotone: replace color with currentColor, add if missing
      // If icon is not monotone, remove this code
      await parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : 'currentColor';
        },
      });

      // Optimise
      await runSVGO(svg);
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    // Update icon
    iconSet.fromSVG(name, svg);
  });

  // Export
  return iconSet;
}

/**
 * 复制svg icons到构建目录
 * @description 包含.d.ts声明文件
 * @param iconSet
 */
async function buildIconDirectory(iconSet: IconSet) {
  // Target directory
  const target = `${IconifyIconsPath}/svg`;
  // Export package
  await exportToDirectory(iconSet, {
    target,
  });
}

/**
 * 构建汇总icons的json文件
 * @description unocss默认识别
 * @param iconSet
 */
async function buildIconJson(iconSet: IconSet) {
  // Export as IconifyJSON
  const exported = JSON.stringify(iconSet.export(), null, '\t') + '\n';
  const target = `${IconifyIconsPath}/icons.json`;
  // Save to file
  await fs.writeFile(target, exported, () => {});
}

/**
 * 构建汇总icons的js文件
 * @description unocss默认识别
 * @param iconSet
 */
async function buildIconJs(iconSet: IconSet) {
  // Export as IconifyJSON
  const exported = JSON.stringify(iconSet.export(), null, '\t') + '\n';
  const iconNames = Object.keys(iconSet.entries);
  let type = '';
  iconNames.forEach((iconName, index) => {
    type =
      type + `  '${iconName}' ${index === iconNames.length - 1 ? '' : '|\n'}`;
  });
  // js
  fs.writeFile(
    `${IconifyIconsPath}/index.js`,
    `const icons = ${exported};
      export default icons;
      `,
    () => {}
  );

  // mjs
  fs.writeFile(
    `${IconifyIconsPath}/index.mjs`,
    `const icons = ${exported};
      export default icons;
      `,
    () => {}
  );

  // cjs
  fs.writeFile(
    `${IconifyIconsPath}/index.cjs`,
    `const icons = ${exported};
      module.exports = icons;
      `,
    () => {}
  );

  // index.d.ts
  fs.writeFile(
    `${IconifyIconsPath}/index.d.ts`,
    `declare type icon = ${type}
      interface IconifyIcon {
        prefix: string;
        lastModified: number;
        icons: {
          [K in icon]: {
            body: string;
            width?: number;
            height?: number;
          };
        };
        width: number;
        height: number;
      }
      declare const data: IconifyIcon;
      export default data;
          `,
    () => {}
  );

  // icons.d.ts
  fs.writeFile(
    `${IconifyIconsPath}/icons.d.ts`,
    `declare type icon = ${type};
          export declare type icons = icon[];
          `,
    () => {}
  );
}

/**
 * 构建全部icons的js文件，并打成包
 * @description 包含.d.ts声明文件
 * @param iconSet
 */
async function buildIconJsPackage(iconSet: IconSet) {
  const root = process.cwd();
  const { version } = await readPackageJSON(root);

  // Target directory
  const target = IconifyIconsPath;
  // Export package
  await exportIconPackage(iconSet, {
    target,
    module: true,
    package: {
      name: `@iconify-icons/${iconSet.prefix}`,
      version,
      bugs: 'https://github.com/iconify/iconify/issues',
      homepage: 'https://github.com/iconify/iconify',
      publishConfig: {
        registry: 'http://192.168.100.157:8081/repository/npm-hosted',
      },
      types: './index.d.ts',
    },
    cleanup: true,
  });
}

async function buildIconJSONPackage(iconSet: IconSet) {
  const root = process.cwd();
  const { version } = await readPackageJSON(root);
  // Target directory
  const target = IconifyJsonPath;

  // Export package
  await exportJSONPackage(iconSet, {
    target,
    package: {
      name: `@iconify-json/${iconSet.prefix}`,
      version,
      bugs: 'https://github.com/iconify/iconify/issues',
      homepage: 'https://github.com/iconify/iconify',
      publishConfig: {
        registry: 'http://192.168.100.157:8081/repository/npm-hosted',
      },
      exports: {
        './*': './*',
        '.': {
          require: './index.js',
          import: './index.mjs',
          types: './index.d.ts',
        },
        './icons.json': './icons.json',
      },
    },
    cleanup: true,
  });
}

export { runBuild, IconifyIconsPath, IconifyJsonPath };
