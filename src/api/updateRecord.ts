import fetch from "node-fetch";
import { getEnvironmentUrl } from "./authentication";
import getHeaders from "./getHeaders";

export default async function updateRecord(
  collectionName: string,
  id: string,
  properties: { [key: string]: any }
) {
  const environmentUrl = getEnvironmentUrl();
  const url = `${environmentUrl}api/data/v9.2/${collectionName}(${id})`;
  const headers = await getHeaders();
  await fetch(url, {
    headers,
    method: "PATCH",
    body: JSON.stringify(properties),
  });
}
