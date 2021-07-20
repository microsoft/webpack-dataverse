import { authenticate } from "../../api/authentication";
import buildCompiler from "./buildCompiler";
import getDataverseConfig from "../getDataverseConfig";
import attachDataverseConfigToCompiler from "./attachDataverseConfigToCompiler";
import webpackDevMiddleware from "webpack-dev-middleware";

export default function serve() {
  const dataverseConfig = getDataverseConfig();
  const compiler = buildCompiler(dataverseConfig);
  authenticate(dataverseConfig);
  attachDataverseConfigToCompiler(dataverseConfig, compiler);
  webpackDevMiddleware(compiler);
}
