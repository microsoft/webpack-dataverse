import fetch from "node-fetch";
import { getEnvironmentUrl } from "./authentication";
import getHeaders from "./getHeaders";

export default async function getRecords<TTable>(
  query: string
): Promise<TTable[]> {
  const environmentUrl = getEnvironmentUrl();
  const queryUrl = `${environmentUrl}api/data/v9.2${query}`;
  const headers = await getHeaders();
  const response = await fetch(queryUrl, {
    method: "GET",
    headers: headers,
  });
  const body = await response.json();
  return body.value;
}
