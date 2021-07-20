import { EntryObject, webpack } from "webpack";
import { resolve } from "path";
import { Configuration as DataverseConfig } from "../../types";
import getWebpackConfig from "../getWebpackConfig";

export default function buildCompiler(dataverseConfig: DataverseConfig) {
  const config = getWebpackConfig();
  const entry = {} as EntryObject;
  for (const srcFile of Object.keys(dataverseConfig.assets)) {
    entry[srcFile] = resolve(dataverseConfig.srcPath, srcFile);
  }
  config.entry = entry;
  config.output = {
    filename: "[name]",
  };
  const compiler = webpack(config);
  return compiler;
}
