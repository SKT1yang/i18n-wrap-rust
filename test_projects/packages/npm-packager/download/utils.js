const { exec } = require('child_process');
const path = require('path');
const fs = require('fs/promises');

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`executeCommand错误：${error}`);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function isDirectory(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

function resolve(originalPath) {
  return path.normalize(path.resolve(originalPath));
}

async function zipFolder(folderPath, outputZipPath) {
  try {
    const archiver = require('archiver');
    // 创建输出流
    const output = await fs.open(outputZipPath, 'w');
    const archive = archiver('zip', { zlib: { level: 9 } });

    // 监听流事件
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.warn('Warning:', err);
      } else {
        throw err;
      }
    });

    archive.on('error', function (err) {
      throw err;
    });

    output.on('close', function () {
      console.log(`${archive.pointer()} total bytes`);
      console.log(
        'Archiver has been finalized and the output file descriptor has closed.'
      );
    });

    // 管道到输出文件
    archive.pipe(output.createWriteStream());

    // 追加文件夹到zip
    archive.directory(folderPath, false);

    // 完成归档
    await archive.finalize();
  } catch (err) {
    console.error('Error zipping folder:', err);
  }
}

module.exports = {
  executeCommand,
  isDirectory,
  resolve,
  zipFolder,
};
