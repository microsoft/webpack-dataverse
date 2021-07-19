import { AdvancedFormStep, Asset, BasicForm } from "../types";
import { join } from "path";
import { readFile } from "fs/promises";
import yaml from "js-yaml";
import findFile from "../util/findFile";

const assets: { [name: string]: Asset } = {};

export async function resolveLocalAsset(
  portalPath: string,
  path: string
): Promise<Asset> {
  if (!assets[path]) {
    const [portalName, type, ...recordPathParts] = path.split("/");
    const basePath = join(portalPath, portalName, type);
    let asset: Asset;
    switch (type) {
      case "basic-forms":
        asset = await resolveBasicForm(basePath, recordPathParts);
        break;
      case "advanced-forms":
        asset = await resolveAdvancedForm(basePath, recordPathParts);
        break;
      default:
        throwUnsupportedAssetTypeError(type);
    }
    assets[path] = asset;
  }

  return assets[path];
}

async function resolveBasicForm(
  basePath: string,
  recordPathParts: string[]
): Promise<Asset> {
  const basicFormName = recordPathParts[0];
  const yamlFilePath = await findFile(
    join(basePath, basicFormName, `${basicFormName}.basicform.yml`)
  );
  const contents = (await readFile(yamlFilePath)).toString();
  const basicForm = yaml.load(contents) as BasicForm;
  return {
    entityLogicalName: "adx_entityform",
    contentAttribute: "adx_registerstartupscript",
    id: basicForm.adx_entityformid,
  };
}

async function resolveAdvancedForm(
  basePath: string,
  recordPathParts: string[]
): Promise<Asset> {
  const advancedFormName = recordPathParts[0];
  if (recordPathParts.length === 0) {
    throwUnsupportedAssetTypeError("advanced-forms");
  }
  const formStepName = recordPathParts[2];
  const yamlFilePath = await findFile(
    join(basePath, ...recordPathParts, `${formStepName}.advancedformstep.yml`)
  );
  const contents = (await readFile(yamlFilePath)).toString();
  const advancedForm = yaml.load(contents) as AdvancedFormStep;
  return {
    entityLogicalName: "adx_webformstep",
    contentAttribute: "adx_registerstartupscript",
    id: advancedForm.adx_webformstepid,
  };
}

function throwUnsupportedAssetTypeError(type: string): never {
  throw new Error(`Asset type ${type} is not yet supported.`);
}
