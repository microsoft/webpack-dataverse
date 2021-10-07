export interface Configuration extends AuthenticationParameters {
  srcPath: string;
  portalPath: string;
  assets: AssetMap;
}

export interface AssetMap {
  [name: string]: string;
}

export interface AuthenticationParameters {
  environmentUrl: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    authority: string;
    tenantId: string;
  };
}

export interface Asset {
  entityLogicalName: AssetEntityLogicalName;
  id: string;
  contentAttribute: string;
  contentFilePath: string;
  portalName: string;
}

export type AssetEntityLogicalName =
  | "adx_entityform"
  | "adx_webfile"
  | "adx_webformstep"
  | "adx_webpage";

export interface BasicForm {
  adx_entityformid: string;
}

export interface AdvancedFormStep {
  adx_webformstepid: string;
}

export interface WebPage {
  adx_webpageid: string;
}
