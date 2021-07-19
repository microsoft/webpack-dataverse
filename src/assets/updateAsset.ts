import updateRecord from "../api/updateRecord";
import { Asset } from "../types";
import btoa from "btoa";
import { saveWebFile } from "./web-files/saveWebFile";

export default async function updateAsset(asset: Asset, content: string) {
  const { entityLogicalName, id, contentAttribute } = asset;
  const collectionName = `${entityLogicalName}s`;
  if (content.length > 100000) {
    const webFileName = `${entityLogicalName}_${id}.js`;
    await Promise.all([
      updateRecord(collectionName, id, {
        [contentAttribute]:
          "const scriptElement = document.createElement('script');\r\n" +
          `scriptElement.src = "/${webFileName}";\r\n` +
          "document.body.appendChild(scriptElement);",
      }),
      saveWebFile(webFileName, btoa(content)),
    ]);
  } else {
    await updateRecord(collectionName, id, {
      [contentAttribute]: content,
    });
  }
}
