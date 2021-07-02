import { HeadersInit } from "node-fetch";
import { getAccessToken } from "./authentication";

export default async function getHeaders(
  additionalHeaders = {}
): Promise<HeadersInit> {
  const accessToken = await getAccessToken();
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    ...additionalHeaders,
  };
}
