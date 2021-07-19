import fetch from "node-fetch";
import { getEnvironmentUrl } from "./authentication";
import getHeaders from "./getHeaders";

function createRecord(
  collectionName: string,
  properties: { [key: string]: any }
): Promise<void>;

function createRecord(
  collectionName: string,
  properties: { [key: string]: any },
  primaryKeyField: string
): Promise<string>;

async function createRecord(
  collectionName: string,
  properties: { [key: string]: any },
  primaryKeyField?: string
): Promise<void | string> {
  const environmentUrl = getEnvironmentUrl();
  let queryUrl = `${environmentUrl}api/data/v9.2/${collectionName}`;
  if (primaryKeyField) {
    queryUrl += `?$select=${primaryKeyField}`;
  }

  const headers = await getHeaders({
    Prefer: "return=representation",
  });

  const response = await fetch(queryUrl, {
    headers,
    method: "POST",
    body: JSON.stringify(properties),
  });
  if (primaryKeyField) {
    const result = await response.json();
    return result[primaryKeyField];
  }
}

export default createRecord;
