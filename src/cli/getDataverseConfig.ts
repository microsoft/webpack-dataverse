import { AssetMap, Configuration } from "../types";
import { resolve, sep } from "path";
import {
  existsSync as pathExists,
  readdirSync as readDir,
  lstatSync as getStats,
} from "fs";
import { config as loadDotEnv } from "dotenv";
import { cwd } from "process";
import { fileSync as findFile } from "find";
import { default as escapeRegExp } from "escape-string-regexp";

export default function getDataverseConfig(): Configuration {
  const dataverseConfigPath = resolve(process.cwd(), "./dataverse.config.js");
  let config: Configuration;
  if (pathExists(dataverseConfigPath)) {
    config = require(dataverseConfigPath);
  } else {
    config = {} as Configuration;
  }
  applyDefaultConfiguration(config);
  return config;
}

function applyDefaultConfiguration(dataverseConfig: Configuration): void {
  applyDefaultEnvironmentVariables(dataverseConfig);
  Object.assign(dataverseConfig, {
    srcPath: dataverseConfig.srcPath || "src",
    portalPath: dataverseConfig.portalPath || "portal",
    assets: dataverseConfig.assets || createDefaultAssets(),
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

function createDefaultAssets(): AssetMap {
  const srcDirectory = resolve(cwd(), "src");
  const files = readDir(srcDirectory);
  const assets: AssetMap = {};
  for (const file of files) {
    const stats = getStats(`${srcDirectory}/${file}`);
    if (stats.isFile()) {
      console.log("it's a file");
      const assetSourceFile = file.replace(/\.[a-z0-9]+$/, "");
      const assetPath = findAsset(assetSourceFile);
      if (assetPath) {
        assets[assetSourceFile] = assetPath;
      }
    }
  }
  return assets;
}

const regexRoot = `${escapeRegExp(cwd())}${sep}portal${sep}`;
const regexItem = "[^/\\\\]+";
const regexAssetQueries = [
  `${regexItem}${sep}basic-forms${sep}`,
  `${regexItem}${sep}advanced-forms${sep}${regexItem}${sep}advanced-form-steps${sep}`,
];

function findAsset(name: string) {
  for (const regexAssetQuery of regexAssetQueries) {
    const files = findFile(
      new RegExp(`^${regexRoot}${regexAssetQuery}${name}`, "i"),
      `${cwd()}/portal`
    );
    if (files.length > 0) {
      return files[0].replace(
        new RegExp(`^${regexRoot}(${regexAssetQuery}${name}).*$`, "i"),
        "$1"
      );
    }
  }
}
