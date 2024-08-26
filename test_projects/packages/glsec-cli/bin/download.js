/*
 * @name: Do not edit
 * @description: Do not edit
 */
import dl from 'download-git-repo';
import { startLoading, endLoading } from './loading.js';
import { config } from './repo.js';
import fse from 'fs-extra';

let count = 0; //计算下载次数

function download(template_name, project_dir) {
  return new Promise(async (resolve, reject) => {
    const { url } = config[template_name]; // 模板的下载地址

    // 如果目录非空删除目录内容。如果目录不存在,就创建一个
    await fse.emptyDir(project_dir);

    (function execuate() {
      count++;
      if (count >= 5) {
        count = 0;
        reject();
        return;
      }
      startLoading(); //加载中
      dl(`${url}`, project_dir, async function (err) {
        endLoading(); // 关闭加载中
        if (err) {
          // console.log(err);
          //出现下载错误,延时3秒重新下载3次
          // console.log('\n下载失败,3s后下载重试...\n');
          await sleep();
          execuate();
        } else {
          resolve(null);
          count = 0;
        }
      });
    })();
  });
}

/**
 * 睡眠
 */
const sleep = (time = 3000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
};

export { download };
