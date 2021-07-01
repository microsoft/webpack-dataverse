import webpackDevMiddleware from "webpack-dev-middleware";
import attachDataverseConfigToCompiler from "./cli/attachDataverseConfigToCompiler";
import buildCompiler from "./cli/buildCompiler";
import buildDataverseConfig from "./cli/buildDataverseConfig";

const dataverseConfig = buildDataverseConfig();
const compiler = buildCompiler();
attachDataverseConfigToCompiler(dataverseConfig, compiler);
webpackDevMiddleware(compiler);
