export interface Configuration extends AuthenticationParameters {
  portalPath: string;
  assets: {
    [assetName: string]: Asset;
  };
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
}

export type AssetEntityLogicalName = "adx_entityform" | "adx_webfile";
