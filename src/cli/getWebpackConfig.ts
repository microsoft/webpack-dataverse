import { Configuration, config } from "webpack";
import { resolve } from "path";
import { existsSync as fileExists } from "fs";

export default function getWebpackConfig(): Configuration {
  const webpackConfigPath = resolve(process.cwd(), "./webpack.config.js");
  if (fileExists(webpackConfigPath)) {
    return require(webpackConfigPath);
  } else {
    const defaultConfig = config.getNormalizedWebpackOptions({});
    config.applyWebpackOptionsDefaults(defaultConfig);
    return defaultConfig as Configuration;
  }
}
