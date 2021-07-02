import updateRecord from "../api/updateRecord";
import { Asset } from "../types";

export default async function updateAsset(asset: Asset, content: string) {
  const { entityLogicalName, id, contentAttribute } = asset;
  const collectionName = `${entityLogicalName}s`;
  await updateRecord(collectionName, id, {
    [contentAttribute]: content,
  });
}
