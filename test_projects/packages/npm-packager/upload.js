/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-07-17 13:31:32
 * @path: \upload\upload.js
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');
const { resolve } = require('./download/utils');

const needToUploadFilesDir = resolve('tarballs');
const publishRestful =
  'http://192.168.100.157:8081/service/rest/v1/components?repository=npm-hosted';

// 保存nexus仓库已有依赖
const existItems = [];

async function getReq(continuationToken) {
  const continueToken = continuationToken
    ? `&continuationToken=${continuationToken}`
    : '';
  const result = await axios.get(
    `http://192.168.100.157:8081/service/rest/v1/components?repository=npm-hosted${continueToken}`
  );
  if (result.status === 200 && result.data && result.data.items) {
    existItems.push(
      ...result.data.items.map((item) => {
        const g = item.group ? item.group + '-' : '';
        const n = item.name + '-';
        const v = item.version + '.tgz';
        return g + n + v;
      })
    );

    if (result.data.continuationToken) {
      await getReq(result.data.continuationToken);
    } else {
      console.log('请求结束时间戳：', new Date().valueOf());
      console.log('请求完毕，结果写入文件：');
      fs.writeFile(
        new Date().valueOf() + '.log',
        JSON.stringify(existItems, null, 2),
        () => {
          console.log('结果写入完毕！！！！！');
          // 借助nexus rest api 上传文件
          executeExistedFiles();
        }
      );
    }
  } else {
    console.log('请求出现异常');
  }
}

async function executeExistedFiles() {
  fs.readdir(needToUploadFilesDir, (error, files) => {
    console.log('2.上传tgz');
    files
      .filter((f) => !existItems.includes(f))
      .forEach((f, i, needDownloadFiles) => {
        const file = f;
        const curlCmd = `curl -u admin:GLsec@123zz -X POST ${publishRestful} -H "accept: application/json" -H "Content-Type: multipart/form-data" -F "npm.asset=@${file};type=application/gzip"`;
        console.log(`${i + 1}/${needDownloadFiles.length}`);
        exec(
          curlCmd,
          { cwd: needToUploadFilesDir },
          function (error, stdout, stderr) {
            if (error) {
              console.error(file + ' publish 失败');
              console.log(error);
            } else {
              console.log(file + ' publish 成功', stdout);
            }
          }
        );
      });
  });
}

console.log('1.获取仓库中已有依赖，大概2~3分钟，请耐心等候...');
console.log('开始请求时间戳：', new Date().valueOf());
console.log('等待中........');

// getReq();
executeExistedFiles();
