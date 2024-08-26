import path from 'path';
import fsSync from 'fs';
import fs from 'fs/promises';
import chalk from 'chalk';

async function checkDependencies(options) {
  const rootPath = path.resolve(process.cwd(), options?.path ?? '');
  const packageJsonMap = await getDependenciesMap(
    rootPath,
    options?.filter ?? true
  );
  const result = [];
  packageJsonMap.forEach((packageJson) => {
    const {
      dependencies,
      peerDependencies,
      optionalDependencies,
      devDependencies,
    } = packageJson;

    const dependenciesNeedUpdate = check(
      packageJson,
      dependencies,
      'dependencies',
      packageJsonMap,
      Boolean(options.update)
    );
    const peerDependenciesNeedUpdate = check(
      packageJson,
      peerDependencies,
      'peerDependencies',
      packageJsonMap,
      Boolean(options.update)
    );
    const optionalDependenciesUpdate = check(
      packageJson,
      optionalDependencies,
      'optionalDependencies',
      packageJsonMap,
      Boolean(options.update)
    );
    const devDependenciesNeedUpdate = check(
      packageJson,
      devDependencies,
      'devDependencies',
      packageJsonMap,
      Boolean(options.update)
    );
    result.push(
      ...dependenciesNeedUpdate,
      ...peerDependenciesNeedUpdate,
      ...optionalDependenciesUpdate,
      ...devDependenciesNeedUpdate
    );
  });
  return {
    packageJsonMap,
    dependencies: Array.from(new Set(...result)),
  };
}

function check(packageJson, dependencies, depType, packageJsonMap, update) {
  const result = [];
  for (const key in dependencies) {
    if (Object.hasOwnProperty.call(dependencies, key)) {
      let versionString = dependencies[key];
      versionString = versionString.replace('^', '').replace('~', '');

      // 获取到当前包的当前版本
      let currentPackage = packageJsonMap.get(key);
      if (currentPackage) {
        if (currentPackage.version !== versionString) {
          if (
            ['@guolisec/template-package-quickstart'].includes(packageJson.name)
          ) {
            continue;
          }
          result.push(packageJson.name);
          console.log(chalk.red(`${packageJson.name}:`));
          console.log(
            chalk.yellow(
              `依赖版本异常:${packageJson.name}下的${depType}的${key}版本不一致，当前是${versionString}, 应该是${currentPackage.version}\n`
            )
          );
        }
      }
    }
  }
  console.log(depType, result);
  return result;
}

/**
 * 遍历依赖，生成初始依赖映射Map
 * @param {String} folderPath
 * @returns
 */
async function getDependenciesMap(folderPath, filter = true) {
  let packageJsonMap = new Map();
  // 递归读取文件夹下的所有package.json文件
  async function readAllPackageJsons(folder) {
    const files = await fs.readdir(folder);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        const packageJson = await getPackage(filePath, filter);
        if (packageJson) {
          packageJson.path = filePath;
          packageJsonMap.set(packageJson.name, packageJson);
        }
      }
    }
  }

  await readAllPackageJsons(folderPath);
  return packageJsonMap;
}

async function getPackage(folder, filter = true) {
  const files = await fs.readdir(folder);

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const filePath = path.join(folder, file);
    const stats = await fs.stat(filePath);

    // 不仅仅只有一个package.json的文件夹才是正常的
    const needRead = filter ? files.length !== 1 : true;
    if (stats.isFile() && file === 'package.json' && needRead) {
      const packageData = fsSync.readFileSync(filePath);
      if (packageData.length > 1) {
        try {
          const packageJson = JSON.parse(packageData);
          return packageJson;
        } catch (error) {
          console.log('解析package.json出错', filePath, error);
        }
      }
    }
  }
}

function updateDeps(pkg, depType, targetDep, version) {
  const deps = pkg[depType];
  if (!deps) return;
  Object.keys(deps).forEach((dep) => {
    if (targetDep.startsWith('@guolisec') && dep === targetDep) {
      console.log(
        chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`)
      );
      deps[dep] = version;
    }
  });
}

export { checkDependencies, getDependenciesMap, getPackage };
