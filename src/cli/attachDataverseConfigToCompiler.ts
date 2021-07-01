import { Compiler } from "webpack";
import updateAsset from "../assets/updateAsset";
import { Configuration as DataverseConfig } from "../types";

export default function attachDataverseConfigToCompiler(
  dataverseConfig: DataverseConfig,
  compiler: Compiler
) {
  compiler.hooks.assetEmitted.tap("UploadToDataverse", (file, { content }) => {
    if (file in dataverseConfig.assets) {
      const base64Content = Buffer.from(content).toString("base64");
      const asset = dataverseConfig.assets[file];
      updateAsset(asset, base64Content);
    }
  });
}
