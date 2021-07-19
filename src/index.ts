import webpackDevMiddleware from "webpack-dev-middleware";
import { authenticate } from "./api/authentication";
import attachDataverseConfigToCompiler from "./cli/attachDataverseConfigToCompiler";
import buildCompiler from "./cli/buildCompiler";
import getDataverseConfig from "./cli/getDataverseConfig";

const dataverseConfig = getDataverseConfig();
authenticate(dataverseConfig);
const compiler = buildCompiler(dataverseConfig);
attachDataverseConfigToCompiler(dataverseConfig, compiler);
webpackDevMiddleware(compiler);
