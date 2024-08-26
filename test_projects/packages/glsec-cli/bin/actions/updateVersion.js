import path from 'path';
import { execa } from 'execa';
import { checkDependencies } from './checkDependencies.js';
import { updatePackageJson } from 'flex-tools';
import child_process from 'child_process';
import util from 'util';
const exec = util.promisify(child_process.exec);

const orderDependencies = [
  '@guolisec/ts-config',
  '@guolisec/types',
  '@guolisec/toast',
  '@guolisec/schedule',
  '@guolisec/scheduler',
  '@guolisec/routerable',
  '@guolisec/storable',
  '@guolisec/jsencrypt',
  '@guolisec/utils',
  '@guolisec/configable',
  '@guolisec/request',
  '@guolisec/vite-config',
  '@guolisec/theme',
  '@guolisec/usb-key',
  '@guolisec/reset.css',
  '@guolisec/permission',
  '@guolisec/graph',
  '@guolisec/assets-detail',
  '@guolisec/collapse',
  '@guolisec/asset',
  '@guolisec/component',
];

async function updateVersionBatch() {
  const rootPath = path.resolve(process.cwd(), '');
  const { dependencies, packageJsonMap } = await checkDependencies({
    filter: false,
    path: './test',
  });
  // 确认获取到最后需要更新的包（已排序）
  const finalDependencies = orderDependencies.filter((name) => {
    return dependencies.includes(name);
  });

  for (let index = 0; index < finalDependencies.length; index++) {
    const finalPackageName = finalDependencies[index];
    const packageJson = packageJsonMap.get(finalPackageName);

    // await execa(`npm`, ['update', '--latest', '@guolisec/utils'], {
    //   stdio: 'inherit',
    //   preferLocal: true,
    //   execPath: packageJson.path,
    // });
    // await execa(`npm`, ['build'], {
    //   stdio: 'inherit',
    //   preferLocal: true,
    //   execPath: packageJson.path,
    // });
    // updatePackageJson({
    //   version: patchVersion(packageJson.version)
    // }, {
    //   location: packageJson.path
    // })
    // await execa(`npm`, ['publish'], {
    //   stdio: 'inherit',
    //   preferLocal: true,
    //   execPath: packageJson.path,
    // });
    return;
  }
}

/**
 * 获取新的版本号
 * @param {string} oldVersion
 * @returns string
 */
function patchVersion(oldVersion) {
  let newVersion = oldVersion;
  oldVersion = oldVersion.replace('^', '').replace('~', '');
  const main = oldVersion.split('-beta.')[0];
  // 主版本
  const primaryVersion = main.split('.')[0];
  // 次要版本
  const secondVersion = main.split('.')[1];
  // 热修复版本
  const hotFixVersion = main.split('.')[2];
  // 测试版本
  const betaVersion = oldVersion.split('-beta.')[1];

  if (betaVersion !== undefined) {
    newVersion = `${primaryVersion}.${secondVersion}.${hotFixVersion}-beta.${
      Number(betaVersion) + 1
    }`;
  } else {
    newVersion = `${primaryVersion}.${secondVersion}.${
      Number(hotFixVersion) + 1
    }`;
  }
  return newVersion;
}

updateVersionBatch();
// name();

export { updateVersionBatch };
