import getRecords from "../../api/getRecords";
import getWebsite from "./getWebsite";
import { PublishingState } from "../tables";

let publishedStateId: Promise<string>;
export default function getPublishedStateId(): Promise<string> {
  if (!publishedStateId) {
    publishedStateId = getPublishedStateIdInternal();
  }
  return publishedStateId;
}

async function getPublishedStateIdInternal(): Promise<string> {
  const { adx_websiteid: websiteId } = await getWebsite();
  const publishingStates = await getRecords<PublishingState>(
    "/adx_publishingstates?" +
      "$select=adx_publishingstateid&" +
      `$filter=adx_name eq 'Published' and adx_websiteid/adx_websiteid eq ${websiteId}`
  );
  return publishingStates[0].adx_publishingstateid;
}
