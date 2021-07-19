import { Configuration } from "../types";
import { resolve } from "path";

export default function getDataverseConfig(): Configuration {
  return require(resolve(process.cwd(), "./dataverse.config.js"));
}
