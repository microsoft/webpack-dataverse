import { AdvancedFormStep, Asset, BasicForm, WebPage } from "../types";
import { join } from "path";
import { readFileSync as readFile } from "fs";
import yaml from "js-yaml";
import findFile from "../util/findFile";

const assets: { [name: string]: Asset } = {};
type AssetWithoutPortalName = Omit<Asset, "portalName">;

export function resolveLocalAsset(portalPath: string, path: string): Asset {
  if (!assets[path]) {
    const [portalName, type, ...recordPathParts] = path.split(/[\\\\/]/);
    const basePath = join(portalPath, portalName, type);
    let asset: AssetWithoutPortalName;
    switch (type) {
      case "basic-forms":
        asset = resolveBasicForm(basePath, recordPathParts);
        break;
      case "advanced-forms":
        asset = resolveAdvancedForm(basePath, recordPathParts);
        break;
      case "web-pages":
        asset = resolveWebPage(basePath, recordPathParts);
        break;
      default:
        throwUnsupportedAssetTypeError(type);
    }
    assets[path] = { portalName, ...asset };
  }

  return assets[path];
}

function resolveBasicForm(
  basePath: string,
  recordPathParts: string[]
): AssetWithoutPortalName {
  const basicFormName = recordPathParts[0];
  const yamlFilePath = findFile(
    join(basePath, basicFormName, `${basicFormName}.basicform.yml`)
  );
  const javascriptFilePath = yamlFilePath.replace(
    /\.yml$/,
    ".custom_javascript.js"
  );
  const contents = readFile(yamlFilePath).toString();
  const basicForm = yaml.load(contents) as BasicForm;
  return {
    entityLogicalName: "adx_entityform",
    contentAttribute: "adx_registerstartupscript",
    id: basicForm.adx_entityformid,
    contentFilePath: javascriptFilePath,
  };
}

function resolveAdvancedForm(
  basePath: string,
  recordPathParts: string[]
): AssetWithoutPortalName {
  if (recordPathParts.length === 0) {
    throwUnsupportedAssetTypeError("advanced-forms");
  }
  const formStepName = recordPathParts[2];
  const yamlFilePath = findFile(
    join(basePath, ...recordPathParts, `${formStepName}.advancedformstep.yml`)
  );
  const javascriptFilePath = yamlFilePath.replace(
    /\.yml$/,
    ".custom_javascript.js"
  );
  const contents = readFile(yamlFilePath).toString();
  const advancedForm = yaml.load(contents) as AdvancedFormStep;
  return {
    entityLogicalName: "adx_webformstep",
    contentAttribute: "adx_registerstartupscript",
    id: advancedForm.adx_webformstepid,
    contentFilePath: javascriptFilePath,
  };
}

function resolveWebPage(
  basePath: string,
  recordPathParts: string[]
): AssetWithoutPortalName {
  const webPageName = recordPathParts[0];
  const yamlFilePath = findFile(
    join(basePath, webPageName, `${webPageName}.webpage.yml`)
  );
  const javascriptFilePath = join(
    basePath,
    webPageName,
    "content-pages",
    `${webPageName}.en-US.webpage.custom_javascript.js`
  );
  const contents = readFile(yamlFilePath).toString();
  const webPage = yaml.load(contents) as WebPage;
  return {
    entityLogicalName: "adx_webpage",
    contentAttribute: "adx_customjavascript",
    id: webPage.adx_webpageid,
    contentFilePath: javascriptFilePath,
  };
}

function throwUnsupportedAssetTypeError(type: string): never {
  throw new Error(`Asset type ${type} is not yet supported.`);
}
