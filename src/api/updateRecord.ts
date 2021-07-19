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
  const response = await fetch(url, {
    headers,
    method: "PATCH",
    body: JSON.stringify(properties),
  });
  if (!response.ok) {
    const json = await response.json();
    const message = json.error.message;
    throw new Error(message);
  }
}
