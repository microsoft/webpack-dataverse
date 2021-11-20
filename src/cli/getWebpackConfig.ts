import { Configuration, config } from "webpack";
import { resolve } from "path";
import { existsSync as fileExists } from "fs";

export default function getWebpackConfig(production?: boolean): Configuration {
  const webpackConfigPath = resolve(process.cwd(), "./webpack.config.js");
  if (fileExists(webpackConfigPath)) {
    return {
      ...require(webpackConfigPath),
      ...(production ? { mode: "production" } : {}),
    };
  } else {
    const defaultConfig = config.getNormalizedWebpackOptions({
      mode: production ? "production" : "development",
    });
    config.applyWebpackOptionsDefaults(defaultConfig);
    return defaultConfig as Configuration;
  }
}
