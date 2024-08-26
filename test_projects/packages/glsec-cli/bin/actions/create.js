/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-30 08:29:39
 * @path: \mycli-master\bin\actions\create.js
 */
import inquirer from 'inquirer';
import { download } from '../download.js';
import path from 'path';
import { config } from '../repo.js';

async function createProject(appName, options) {
  const prompList = [
    {
      type: 'input',
      name: 'description',
      message: '请输入项目描述信息:',
    },
  ];

  let template_name;

  if (!options.template) {
    prompList.push({
      type: 'list',
      message: '请选择一个模板下载:',
      name: 'template_name',
      choices: Object.keys(config),
    });
  }

  const { template_name: template_value, description } = await inquirer.prompt(
    prompList
  );

  if (options.template) {
    template_name = options.template;
  } else {
    template_name = template_value;
  }

  const project_dir = path.join(process.cwd(), appName); //新键项目的路径

  try {
    await download(template_name, project_dir);
    // console.log(`
    // Done. Now run:
    // cd ${appName}
    // ${config[template_name].install}
    // ${config[template_name].bootstrap}`);
  } catch (error) {
    // console.log(error);
  }
}

export { createProject };
