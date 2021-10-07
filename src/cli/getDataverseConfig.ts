import { AssetMap, Configuration } from "../types";
import { join, resolve, sep } from "path";
import {
  existsSync as pathExists,
  readdirSync as readDir,
  lstatSync as getStats,
} from "fs";
import { config as loadDotEnv } from "dotenv";
import { cwd } from "process";
import { fileSync as findFile } from "find";
import { default as escapeRegExp } from "escape-string-regexp";

export default function getDataverseConfig(
  development?: boolean
): Configuration {
  const dataverseConfigPath = resolve(process.cwd(), "./dataverse.config.js");
  let config: Configuration;
  if (pathExists(dataverseConfigPath)) {
    config = require(dataverseConfigPath);
  } else {
    config = {} as Configuration;
  }
  applyDefaultConfiguration(config, !!development);
  return config;
}

function applyDefaultConfiguration(
  dataverseConfig: Configuration,
  development: boolean
): void {
  if (development) {
    applyDefaultEnvironmentVariables(dataverseConfig);
  }
  const srcPath = dataverseConfig.srcPath || "src";
  const portalPath = dataverseConfig.portalPath || "portal";
  const assets =
    dataverseConfig.assets || createDefaultAssets(srcPath, portalPath);
  Object.assign(dataverseConfig, {
    srcPath,
    portalPath,
    assets,
  });
}

function applyDefaultEnvironmentVariables(config: Configuration) {
  if (
    !(
      config.environmentUrl &&
      config.credentials?.clientId &&
      config.credentials?.clientSecret &&
      config.credentials?.authority &&
      config.credentials?.tenantId
    )
  ) {
    loadDotEnv();
    Object.assign(config, {
      environmentUrl:
        config.environmentUrl || getRequiredEnvironmentVariable("URL"),
      credentials: {
        clientId:
          config.credentials?.clientId ||
          getRequiredEnvironmentVariable("CLIENT_ID"),
        clientSecret:
          config.credentials?.clientSecret ||
          getRequiredEnvironmentVariable("CLIENT_SECRET"),
        authority:
          config.credentials?.authority ||
          process.env.AUTHORITY ||
          "https://login.microsoftonline.com/",
        tenantId:
          config.credentials?.tenantId ||
          getRequiredEnvironmentVariable("TENANT_ID"),
      },
    });
  }
}

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. ` +
        "Either add it as an environment variable or assign it a .env file (https://www.npmjs.com/package/dotenv)."
    );
  }
  return value;
}

function createDefaultAssets(srcPath: string, portalPath: string): AssetMap {
  const srcDirectory = resolve(cwd(), srcPath);
  const files = readDir(srcDirectory);
  const assets: AssetMap = {};
  for (const file of files) {
    const stats = getStats(`${srcDirectory}/${file}`);
    if (stats.isFile()) {
      const assetSourceFile = file.replace(/\.[a-z0-9]+$/, "");
      const assetPath = findAsset(assetSourceFile, portalPath);
      if (assetPath) {
        assets[file] = assetPath;
      }
    }
  }
  return assets;
}

const slash = escapeRegExp(sep);
const regexItem = "[^/\\\\]+";
const regexAssetQueries = [
  `${regexItem}${slash}basic-forms${slash}`,
  `${regexItem}${slash}advanced-forms${slash}${regexItem}${slash}advanced-form-steps${slash}`,
  `${regexItem}${slash}web-pages${slash}`,
];

function findAsset(name: string, portalPath: string) {
  const portalDirectory = join(cwd(), `${portalPath}${slash}`);
  const regexRoot = escapeRegExp(portalDirectory);
  for (const regexAssetQuery of regexAssetQueries) {
    const files = findFile(
      new RegExp(`^${regexRoot}${regexAssetQuery}${name}`, "i"),
      portalDirectory
    );
    if (files.length > 0) {
      return files[0].replace(
        new RegExp(`^${regexRoot}(${regexAssetQuery}${name}).*$`, "i"),
        "$1"
      );
    }
  }
}
