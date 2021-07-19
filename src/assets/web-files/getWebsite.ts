import getRecords from "../../api/getRecords";
import { Website } from "../tables";

let website: Promise<Website>;
export default function getWebsite(): Promise<Website> {
  if (!website) {
    website = getWebsiteInternal();
  }
  return website;
}

async function getWebsiteInternal(): Promise<Website> {
  const websites = await getRecords<Website>(
    "/adx_websites?" +
      "$select=adx_websiteid&" +
      "$expand=adx_website_webpage(" +
      "$select=adx_webpageid;" +
      "$filter=adx_partialurl eq '/' and adx_isroot eq true;" +
      "$orderby=createdon desc;" +
      "$top=1)"
  );
  return websites[0];
}
