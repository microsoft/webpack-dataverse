import { Configuration } from "webpack";
import { resolve } from "path";

export default function getWebpackConfig(): Configuration {
  return require(resolve(process.cwd(), "./webpack.config.js"));
}
