export interface Configuration {
  portalPath: string;
  environmentUrl: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    authority: string;
    tenantId: string;
  };
  assets: {
    [assetName: string]: Asset;
  };
}

export interface Asset {
  type: AssetType;
  name: string;
}

export type AssetType = "basic-form";
