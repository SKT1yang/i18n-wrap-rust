/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-23 17:10:14
 * @path: \icons\src\publish.ts
 */
import { execAsync } from "@iconify/tools";
import { IconifyIconsPath, IconifyJsonPath } from "./build";
async function publish() {
  // Publish NPM package
  await execAsync("npm publish --no-git-checks", {
    cwd: IconifyIconsPath,
  });

  // Publish NPM package
  await execAsync("npm publish --no-git-checks", {
    cwd: IconifyJsonPath,
  });
}

publish();
