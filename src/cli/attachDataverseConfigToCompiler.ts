import { Compiler } from "webpack";
import updateAsset from "../assets/updateAsset";
import { Configuration as DataverseConfig } from "../types";

export default function attachDataverseConfigToCompiler(
  dataverseConfig: DataverseConfig,
  compiler: Compiler
) {
  compiler.hooks.assetEmitted.tapPromise(
    "UploadToDataverse",
    async (file, { content: buffer }) => {
      if (file in dataverseConfig.assets) {
        const asset = dataverseConfig.assets[file];
        let content: string;
        if (asset.entityLogicalName === "adx_webfile") {
          content = Buffer.from(buffer).toString("base64");
        } else {
          content = buffer.toString();
        }
        await updateAsset(asset, content);
      }
    }
  );
}
