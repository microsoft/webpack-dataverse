import { EntryObject, webpack } from "webpack";
import { resolve, join } from "path";
import { cwd } from "process";
import getWebpackConfig from "../getWebpackConfig";
import getDataverseConfig from "../getDataverseConfig";
import { resolveLocalAsset } from "../../assets/resolveLocalAsset";
import { writeFile } from "fs/promises";
import createWebFile from "../../assets/web-files/createWebFile";
import createWebFileLoader from "../../assets/createWebFileLoader";
import { Asset } from "../../types";

export default function buildCompiler() {
  const dataverseConfig = getDataverseConfig();
  const config = getWebpackConfig();
  const entry = {} as EntryObject;
  for (const srcFile of Object.keys(dataverseConfig.assets)) {
    entry[srcFile] = resolve(dataverseConfig.srcPath, srcFile);
  }
  config.entry = entry;
  const destinationAssetMap: { [destination: string]: Asset } = {};
  config.output = {
    filename: (pathData, assetInfo) => {
      const fileName = pathData.runtime as string;
      const assetName = dataverseConfig.assets[fileName];
      const asset = resolveLocalAsset(dataverseConfig.portalPath, assetName);
      destinationAssetMap[asset.contentFilePath] = asset;
      return asset.contentFilePath;
    },
    path: cwd(),
  };

  const compiler = webpack(config);
  compiler.hooks.assetEmitted.tapPromise(
    "dataverse",
    async (filePath, info) => {
      const content = info.content.toString();
      if (content.length > 100000) {
        const { entityLogicalName, id, portalName } =
          destinationAssetMap[filePath];
        const webFileName = `${entityLogicalName}_${id}.js`;
        const webFilePath = join(
          dataverseConfig.portalPath,
          portalName,
          "web-files",
          webFileName
        );
        await Promise.all([
          writeFile(filePath, createWebFileLoader(webFileName)),
          writeFile(webFilePath, content),
        ]);
      }
    }
  );
  return compiler;
}
