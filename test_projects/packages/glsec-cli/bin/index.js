#! /usr/bin/env node
import { program } from 'commander';
import { createProject } from './actions/create.js';
import { checkDependencies } from './actions/checkDependencies.js';
import { updateVersionBatch } from './actions/updateVersion.js';

program.version('1.0.0');

//创建新项目
program
  .command('create <app-name>')
  .description('创建一个新项目')
  .option('-t, --template <template-name>', '选择一个模板下载')
  .action((appName, options) => {
    createProject(appName, options);
  });

// 检测依赖关系
program
  .command('check')
  .description('检测依赖关系')
  .option('-p, --path <path>', '相对路径')
  .action((options) => {
    checkDependencies(options);
  });

// 批量更新依赖、更新版本并推送
program
  .command('update version')
  .description('批量更新依赖、更新版本并推送')
  .option('-p, --path <path>', '相对路径')
  .action((options) => {
    updateVersionBatch(options);
  });

program.parse(process.argv);
