import { Configuration, EntryObject, webpack } from "webpack";
import { resolve } from "path";
import { Configuration as DataverseConfig } from "../types";

export default function buildCompiler(dataverseConfig: DataverseConfig) {
  const config = require(resolve(
    process.cwd(),
    "./webpack.config.js"
  )) as Configuration;
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
