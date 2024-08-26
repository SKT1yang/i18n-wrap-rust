const { executeCommand, zipFolder } = require('./download/utils');
const path = require('path');

async function main() {
  console.log('删除多余文件');
  await executeCommand(`rimraf tarballs.zip node_modules tarballs`);
  console.log('删除成功');

  const mode =
    process.argv.slice(2).length > 0 ? process.argv.slice(2).length[0] : 'npm';
  console.log('脚本开始');
  await executeCommand(`${mode} install --force`);
  console.log('首次依赖安装成功');

  console.log('开始下载');
  const { download } = require('./download/download');
  await download(mode);
  console.log('下载完成');

  // console.log('开始压缩')
  // // 获取当前工作目录
  // const currentDir = process.cwd();
  // // 要压缩的文件夹路径（相对于当前工作目录）
  // const folderPath = path.join(currentDir, 'tarballs');
  // // 生成的zip文件路径（相对于当前工作目录）
  // const outputZipPath = path.join(currentDir, 'tarballs.zip');
  // zipFolder(folderPath, outputZipPath)
  // console.log('压缩完成')

  console.log('脚本结束');
}
main();
