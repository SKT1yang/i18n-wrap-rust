const fsSync = require('fs');
const path = require('path');
const fs = require('fs/promises');
const axios = require('axios');
const { executeCommand, resolve } = require('./utils');

let failedTarballList = [];

async function download(mode = 'npm') {
  await executeCommand(`${mode} install --force`);
  console.log(`2.node_modules依赖下载完成`);

  const dependenciesMap = await getDependenciesMap(resolve('./'));
  console.log(
    'dependenciesMap结果:',
    JSON.stringify([...dependenciesMap.entries()])
  );

  const tarballList = await getTarballMaps(dependenciesMap);
  console.log(
    'tarballList结果:',
    JSON.stringify(tarballList),
    tarballList.flat(Infinity)
  );
  await downLoadByTarballIList(tarballList.flat(Infinity));
}

/**
 * 遍历依赖，生成初始依赖映射Map
 * @param {String} folderPath
 * @returns
 */
async function getDependenciesMap(folderPath) {
  let dependenciesMap = new Map();
  // 递归读取文件夹下的所有package.json文件
  async function readAllPackageJsons(folder, isRoot) {
    const files = await fs.readdir(folder);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await readAllPackageJsons(filePath);
      } else if (stats.isFile() && file === 'package.json') {
        const packageData = fsSync.readFileSync(filePath);
        if (packageData.length > 1) {
          try {
            const packageJson = JSON.parse(packageData);
            const {
              dependencies,
              peerDependencies,
              optionalDependencies,
              devDependencies,
            } = packageJson;
            transformObjectMap(dependenciesMap, dependencies || {});
            transformObjectMap(dependenciesMap, peerDependencies || {});
            transformObjectMap(dependenciesMap, optionalDependencies || {});
            // 根目录package.json为目标依赖
            if (isRoot) {
              transformObjectMap(dependenciesMap, devDependencies || {});
            }
          } catch (error) {
            console.log('getDependenciesMap:生成依赖Map出错', filePath, error);
          }
        }
      }
    }
  }

  await readAllPackageJsons(folderPath, true);
  return dependenciesMap;
}

/**
 * 将依赖信息转换进Map
 * @param {Map} pkgVersionMap
 * @param {Object} dependencies
 */
function transformObjectMap(pkgVersionMap, dependencies) {
  for (const pkgName in dependencies) {
    if (Object.hasOwnProperty.call(dependencies, pkgName)) {
      const origialVersion = dependencies[pkgName];
      const versions = versionHandle(origialVersion);
      if (versions.length > 0) {
        const versionList = pkgVersionMap.get(pkgName) || [];
        versionList.push(...versions);
        pkgVersionMap.set(pkgName, Array.from(new Set(versionList)));
      }
    }
  }
}

/**
 * 处理npm依赖字段里的version字符串值
 * @param {String} origialVersion
 * @returns
 */
function versionHandle(origialVersion) {
  let result = [];
  if (
    origialVersion.includes('workspace') ||
    origialVersion.includes('npm:') ||
    origialVersion.includes('.x')
  ) {
    return result;
  }

  if (origialVersion.includes('||')) {
    const versions = origialVersion.split('||');
    result.push(...versions);
  } else {
    result.push(origialVersion);
  }
  result = result.map((item) => {
    const temp = item.replace(/[\*|\^|\~|\>|\=| ]/g, '');
    return temp.trim();
  });
  console.log('versionHandle:', origialVersion, result);
  return result;
}

async function getTarballMaps(dependenciesMap) {
  const result = [];
  let count = 0;
  for (let [pkgName, versionList] of dependenciesMap) {
    count += 1;
    console.log(
      'getTarballMaps 当前遍历:',
      pkgName,
      versionList,
      `${count}/${dependenciesMap.size}`
    );
    const tarballList = await buildVersionToTarball(pkgName, versionList);
    result.push(...tarballList);
  }
  console.log('getTarballMaps 结果：', result);
  return result;
}

async function buildVersionToTarball(pkgName, versionList) {
  return new Promise(async (resolve, reject) => {
    const tarballList = [];
    try {
      const response = await axios({
        method: 'get',
        url: `https://registry.npmmirror.com/${pkgName}`,
      });
      if (typeof response.data.versions !== 'object') {
        resolve([]);
        return;
      }
      console.log();
      // 增加最新版本逻辑
      if (response.data['dist-tags'] && response.data['dist-tags']['latest']) {
        const latestVersion = response.data['dist-tags']['latest'];
        !versionList.includes(latestVersion) && versionList.push(latestVersion);
      }
      const versions = response.data.versions;
      if (versions) {
        for (let index = 0; index < versionList.length; index++) {
          const version = versionList[index];
          let item = versions[version];
          if (item) {
            const tarballUrl = item['dist']['tarball'];
            console.log('buildVersionToTarball url:', tarballUrl);
            const split = item.name.split('/');
            let fileName = tarballUrl.split('/-/')[1];
            let folderPath = split.slice(0, split.length - 1).join('/');
            tarballList.push({
              name: item.name,
              version: item.version,
              url: tarballUrl,
              fileName,
              folderPath,
            });
          }
        }
      }
      resolve(tarballList);
    } catch (error) {
      resolve(tarballList);
    }
  });
}

/**
 * 批量下载
 * @param {Array} tarballList
 */
async function downLoadByTarballIList(tarballList) {
  let len = 50;
  for (let index = 0; index < tarballList.length; index = index + len) {
    const tarballItemGroup = tarballList.slice(index, index + len);
    console.log(
      'downLoadByTarballIList 当前遍历group:',
      index + 1,
      tarballList.length
    );
    await downLoadByLimitTarballIList(tarballItemGroup);
  }
}

/**
 * 批量任务进行分组下载（速度优化）
 * @param {Array} tarballList
 */
async function downLoadByLimitTarballIList(tarballList) {
  const promises = [];
  for (let index = 0; index < tarballList.length; index++) {
    const tarballItem = tarballList[index];
    console.log(
      'downLoadByTarballIList 当前分组下载遍历:',
      tarballItem.name,
      tarballItem.version,
      index + 1,
      tarballList.length
    );
    promises.push(downLoadTarballItem(tarballItem));
  }

  const result = await Promise.all(promises);
}

/**
 * 通过网络地址下载数据(单个)
 * @param {object} tarballItem
 */
async function downLoadTarballItem(tarballItem) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(
        'downLoadTarballItem 尝试下载:',
        tarballItem.name,
        tarballItem.url
      );
      const response = await axios({
        method: 'get',
        url: tarballItem.url,
        responseType: 'stream',
        timeout: 30000000,
      });

      if (response && !response.data.error) {
        console.log(
          'downLoadTarballItem 正常拿到数据，尝试写入tarballs文件夹:',
          tarballItem.name
        );
        await writeFileByStream(response.data, tarballItem);
      }
      resolve(true);
    } catch (error) {
      failedTarballList.push(tarballItem);
      console.log(
        '通过url写文件失败：',
        tarballItem.name,
        tarballItem.version,
        failedTarballList,
        error
      );
      resolve(false);
    }
  });
}

async function writeFileByStream(data, tarballItem) {
  const folderPath = `tarballs`;
  const filePath = `${folderPath}/${tarballItem.fileName}`;
  // 检查目标文件夹是否存在，如果不存在，则创建它
  if (!fsSync.existsSync(folderPath)) {
    fsSync.mkdirSync(folderPath, { recursive: true });
  }
  // 检查重复包文件夹是否存在（重名啥的各种原因，反正就是有了），如果不存在，则创建它
  const repeatFolderPath = `${folderPath}/repeat`;
  const repeatFilePath = `${repeatFolderPath}/${tarballItem.fileName}`;
  if (!fsSync.existsSync(repeatFolderPath)) {
    fsSync.mkdirSync(repeatFolderPath, { recursive: true });
  }
  if (fsSync.existsSync(filePath)) {
    try {
      console.log('writeFileByStream', tarballItem.name, repeatFilePath);
      data.pipe(fsSync.createWriteStream(repeatFilePath));
    } catch (error) {
      console.log(
        'repeatFilePath writeFileByStream 失败：',
        repeatFilePath,
        error
      );
    }
    return;
  }
  try {
    console.log('writeFileByStream', tarballItem.name, filePath);
    data.pipe(fsSync.createWriteStream(filePath));
  } catch (error) {
    console.log('writeFileByStream 失败：', filePath, error);
  }
}

module.exports = {
  download,
};
