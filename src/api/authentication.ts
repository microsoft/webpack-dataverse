import { ConfidentialClientApplication } from "@azure/msal-node";
import { AuthenticationParameters } from "../types";

let accessTokenPromise: Promise<string>;
let environmentUrl: string;

export function getAccessToken(): Promise<string> {
  if (!accessTokenPromise) {
    throw new Error("getAccessToken was called prior to calling authenticate");
  }
  return accessTokenPromise;
}

export function getEnvironmentUrl(): string {
  return environmentUrl;
}

export function authenticate(
  authenticationParameters: AuthenticationParameters
): void {
  const {
    credentials: { clientId, clientSecret, authority, tenantId },
  } = authenticationParameters;
  environmentUrl = authenticationParameters.environmentUrl;
  const app = new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority: `${authority}${tenantId}`,
    },
  });
  accessTokenPromise = (async () => {
    const response = await app.acquireTokenByClientCredential({
      scopes: [`${environmentUrl}.default`],
    });
    if (response === null) {
      throw new Error("MSAL authentication returned a null response.");
    }
    return response.accessToken;
  })();
}
