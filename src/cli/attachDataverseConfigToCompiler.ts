import { Compiler } from "webpack";
import updateAsset from "../assets/updateAsset";
import { Configuration as DataverseConfig } from "../types";
import { resolveLocalAsset } from "../assets/resolveLocalAsset";

export default function attachDataverseConfigToCompiler(
  config: DataverseConfig,
  compiler: Compiler
) {
  compiler.hooks.assetEmitted.tapPromise(
    "UploadToDataverse",
    async (fileName, { content: buffer }) => {
      if (config.assets[fileName]) {
        const assetName = config.assets[fileName];
        const asset = await resolveLocalAsset(config.portalPath, assetName);
        let content: string;
        if (asset.entityLogicalName === "adx_webfile") {
          content = Buffer.from(buffer).toString("base64");
        } else {
          content = buffer.toString();
        }
        await updateAsset(asset, content);
        console.log(`updated ${fileName}`);
      }
    }
  );
}
