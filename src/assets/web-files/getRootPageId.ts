import getWebsite from "./getWebsite";

export default async function getRootPageId(): Promise<string> {
  const website = await getWebsite();
  const rootPageId = website.adx_website_webpage[0].adx_webpageid;
  return rootPageId;
}
