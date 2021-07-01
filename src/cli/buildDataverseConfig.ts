import { resolve } from "path";
import { Configuration as DataverseConfig } from "../types";

export default function buildDataverseConfig() {
  const configPath = resolve(process.cwd(), "./dataverse.config.js");
  const config = require(configPath) as DataverseConfig;
  return config;
}
