import getRecords from "../../api/getRecords";
import { WebFile } from "../tables";
import webFileIdMap from "./webFileIdMap";

export default async function getWebFileId(
  fileName: string
): Promise<string | undefined> {
  if (!(fileName in webFileIdMap)) {
    webFileIdMap[fileName] = getWebFileIdInternal();
  }
  return webFileIdMap[fileName];

  async function getWebFileIdInternal(): Promise<string | undefined> {
    const webFiles = await getRecords<WebFile>(
      "/adx_webfiles?" +
        "$select=adx_webfileid&" +
        `$filter=adx_name eq '${fileName}'`
    );
    return webFiles[0]?.adx_webfileid;
  }
}
