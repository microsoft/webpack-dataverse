import { resolve } from "path";
import { Configuration as WebpackConfig, webpack } from "webpack";

export default function buildCompiler() {
  const webpackConfig = require(resolve(
    process.cwd(),
    "./webpack.config.js"
  )) as WebpackConfig;

  const compiler = webpack(webpackConfig);

  return compiler;
}
