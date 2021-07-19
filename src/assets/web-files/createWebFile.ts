import createRecord from "../../api/createRecord";
import getPublishedStateId from "./getPublishedStateId";
import getRootPageId from "./getRootPageId";
import getWebsite from "./getWebsite";
import webFileIdMap from "./webFileIdMap";

export default async function createWebFile(fileName: string): Promise<string> {
  const website = await getWebsite();
  const publishedStateId = await getPublishedStateId();
  const rootPageId = await getRootPageId();
  const webFileId = await createRecord(
    "adx_webfiles",
    {
      adx_name: fileName,
      "adx_websiteid@odata.bind": `/adx_websites(${website.adx_websiteid})`,
      "adx_publishingstateid@odata.bind": `/adx_publishingstates(${publishedStateId})`,
      "adx_parentpageid@odata.bind": `/adx_webpages(${rootPageId})`,
      adx_contentdisposition: 756150001,
      adx_partialurl: fileName,
    },
    "adx_webfileid"
  );
  webFileIdMap[fileName] = Promise.resolve(webFileId);
  return webFileId;
}
