import updateRecord from "../api/updateRecord";
import { Asset } from "../types";
import btoa from "btoa";
import { saveWebFile } from "./web-files/saveWebFile";
import createWebFileLoader from "./createWebFileLoader";

export default async function updateAsset(asset: Asset, content: string) {
  const scrubbedContents = content.replace(/•/g, "-");
  const { entityLogicalName, id, contentAttribute } = asset;
  const collectionName = `${entityLogicalName}s`;
  if (scrubbedContents.length > 100000) {
    const webFileName = `${entityLogicalName}_${id}.js`;
    await Promise.all([
      updateRecord(collectionName, id, {
        [contentAttribute]: createWebFileLoader(webFileName),
      }),
      saveWebFile(webFileName, btoa(scrubbedContents)),
    ]);
  } else {
    await updateRecord(collectionName, id, {
      [contentAttribute]: scrubbedContents,
    });
  }
}
