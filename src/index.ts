import webpackDevMiddleware from "webpack-dev-middleware";
import { authenticate } from "./api/authentication";
import attachDataverseConfigToCompiler from "./cli/attachDataverseConfigToCompiler";
import buildCompiler from "./cli/buildCompiler";
import buildDataverseConfig from "./cli/buildDataverseConfig";

const dataverseConfig = buildDataverseConfig();
authenticate(dataverseConfig);
const compiler = buildCompiler();
attachDataverseConfigToCompiler(dataverseConfig, compiler);
webpackDevMiddleware(compiler);
