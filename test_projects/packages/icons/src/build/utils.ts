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

class IconBuilder {
  prefix: string = '';
  iconFolderPathList: string[] = [];
  distPath: string = 'dist';
  initIconsPath: string = 'src/icons';
  IconifyIconsPath: string = ``;
  IconifyJsonPath: string = ``;

  constructor(config: { prefix: string; iconFolderPathList: string[] }) {
    const { prefix, iconFolderPathList } = config;
    this.prefix = prefix;
    this.iconFolderPathList = iconFolderPathList;

    this.IconifyIconsPath = `${this.distPath}/${this.prefix}/icons`;
    this.IconifyJsonPath = `${this.distPath}/${this.prefix}/json`;
  }

  async runBuild() {
    this.runBuildIconifyIconsPackage();
    this.runBuildIconifyJsonPackage();
  }

  async runBuildIconifyIconsPackage(iconSet?: IconSet) {
    if (!iconSet) {
      iconSet = await this.getIconSetBySvgDirectory();
    }
    if (!iconSet) {
      console.log('[runBuildIconifyIconsPackage error]: iconSet不存在');
      return;
    }
    await this.buildIconJsPackage(iconSet);
    await this.buildIconDirectory(iconSet);
    await this.buildIconJson(iconSet);
    await this.buildIconJs(iconSet);
  }

  async runBuildIconifyJsonPackage(iconSet?: IconSet) {
    if (!iconSet) {
      iconSet = await this.getIconSetBySvgDirectory();
    }
    await this.buildIconJSONPackage(iconSet);
  }
  /**
   * 获取源svg文件iconSet
   */
  async getIconSetBySvgDirectory() {
    const initIconSet = await this.getInitIconSetBySvgDirectory();
    const parseColorIconSet = await this.getParseColorIconSetBySvgDirectory();
    const deviceIconSet = await this.getDeviceIconSetBySvgDirectory();
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
  async getInitIconSetBySvgDirectory() {
    // Import icons
    const iconSet: IconSet = await importDirectory(this.initIconsPath, {
      prefix: this.prefix,
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
  async getParseColorIconSetBySvgDirectory() {
    // Import icons
    const iconSet: IconSet = await importDirectory(
      `${this.initIconsPath}/parse-color`,
      {
        prefix: this.prefix,
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
  async getDeviceIconSetBySvgDirectory() {
    // Import icons
    const iconSet: IconSet = await importDirectory(
      `${this.initIconsPath}/device`,
      {
        prefix: `${this.prefix}`,
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
   * 复制svg icons到构建目录
   * @description 包含.d.ts声明文件
   * @param iconSet
   */
  async buildIconDirectory(iconSet: IconSet) {
    // Target directory
    const target = `${this.IconifyIconsPath}/svg`;
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
  async buildIconJson(iconSet: IconSet) {
    // Export as IconifyJSON
    const exported = JSON.stringify(iconSet.export(), null, '\t') + '\n';
    const target = `${this.IconifyIconsPath}/icons.json`;
    // Save to file
    await fs.writeFile(target, exported, () => {});
  }

  /**
   * 构建汇总icons的js文件
   * @description unocss默认识别
   * @param iconSet
   */
  async buildIconJs(iconSet: IconSet) {
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
      `${this.IconifyIconsPath}/index.js`,
      `const icons = ${exported};
        export default icons;
        `,
      () => {}
    );

    // mjs
    fs.writeFile(
      `${this.IconifyIconsPath}/index.mjs`,
      `const icons = ${exported};
        export default icons;
        `,
      () => {}
    );

    // cjs
    fs.writeFile(
      `${this.IconifyIconsPath}/index.cjs`,
      `const icons = ${exported};
        module.exports = icons;
        `,
      () => {}
    );

    // index.d.ts
    fs.writeFile(
      `${this.IconifyIconsPath}/index.d.ts`,
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
      `${this.IconifyIconsPath}/icons.d.ts`,
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
  async buildIconJsPackage(iconSet: IconSet) {
    const root = process.cwd();
    const { version } = await readPackageJSON(root);

    // Target directory
    const target = this.IconifyIconsPath;
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

  async buildIconJSONPackage(iconSet: IconSet) {
    const root = process.cwd();
    const { version } = await readPackageJSON(root);
    // Target directory
    const target = this.IconifyJsonPath;

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
}

export { IconBuilder };
