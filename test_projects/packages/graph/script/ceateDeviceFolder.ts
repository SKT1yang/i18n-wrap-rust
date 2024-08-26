/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \graph\script\ceateDeviceFolder.ts
 */
import fs from "fs";
import path from "path";
function resolve(originalPath) {
  return path.normalize(path.resolve(originalPath));
}

function generate() {
  const sourceDevicefolder = resolve("./source/device");
  const libDeviceFolder = resolve("./lib/device");
  if (fs.existsSync(libDeviceFolder)) {
    fs.rmSync(libDeviceFolder, { recursive: true });
  }
  fs.mkdirSync(libDeviceFolder, { recursive: true });
  fs.readdir(
    sourceDevicefolder,
    { withFileTypes: true },
    (err, sourceTypeFolders) => {
      for (let index = 0; index < sourceTypeFolders.length; index++) {
        const sourceTypeFolder = sourceTypeFolders[index];

        if (sourceTypeFolder.isDirectory()) {
          const assetTypeCode = sourceTypeFolder.name.split("-")[0];
          const libTypeFolder = path.join(libDeviceFolder, assetTypeCode);
          if (!fs.existsSync(libTypeFolder)) {
            fs.mkdirSync(libTypeFolder, { recursive: true });
          }
          const sourceImages = fs.readdirSync(
            path.join(sourceTypeFolder.path, sourceTypeFolder.name),
            {
              withFileTypes: true,
            }
          );
          console.log("sourceImages", sourceImages);
          // console.log("sourceTypeFolder", sourceTypeFolder);
          // for (let j = 0; index < sourceImages.length; j++) {
          //   const sourceImage = sourceImages[j];
          //   console.log(sourceImage);
          //   if (sourceImage && sourceImage.path && sourceImage.name) {
          //     const originFilePath = path.join(
          //       sourceImage.path,
          //       sourceImage.name
          //     );
          //     const copyFile = path.join(libTypeFolder, sourceImage.name);
          //     fs.copyFileSync(originFilePath, copyFile);
          //   }
          // }
        }
      }
    }
  );
}
generate();
