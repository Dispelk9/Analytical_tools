interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
}

interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

const TOKEN_STORAGE_KEY = 'analytical-tools.auth.tokens';
const PKCE_VERIFIER_KEY = 'analytical-tools.auth.pkce.verifier';
const PKCE_STATE_KEY = 'analytical-tools.auth.pkce.state';
const RETURN_PATH_KEY = 'analytical-tools.auth.return-path';
const EXPIRY_SKEW_MS = 30_000;

export const getKeycloakConfig = (): KeycloakConfig => ({
  url: (import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8084').replace(/\/$/, ''),
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'analytical-tools',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'analytical-tools-frontend',
});

export const getLoginRedirectUri = (): string => `${window.location.origin}/login`;

export const hasKeycloakCallbackParams = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  return params.has('code') || params.has('error');
};

export const clearAuthState = (): void => {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  sessionStorage.removeItem(PKCE_STATE_KEY);
  sessionStorage.removeItem(RETURN_PATH_KEY);
};

const getRealmUrl = (): string => {
  const config = getKeycloakConfig();
  return `${config.url}/realms/${encodeURIComponent(config.realm)}`;
};

const getAuthorizationEndpoint = (): string =>
  `${getRealmUrl()}/protocol/openid-connect/auth`;

const getTokenEndpoint = (): string =>
  `${getRealmUrl()}/protocol/openid-connect/token`;

const getLogoutEndpoint = (): string =>
  `${getRealmUrl()}/protocol/openid-connect/logout`;

const toBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createRandomString = (byteLength = 32): string => {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return toBase64Url(bytes.buffer);
};

const createCodeChallenge = async (verifier: string): Promise<string> => {
  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return toBase64Url(digest);
};

const storeTokens = (tokenResponse: TokenResponse): void => {
  const storedTokens: StoredTokens = {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    idToken: tokenResponse.id_token,
    expiresAt: Date.now() + tokenResponse.expires_in * 1000,
  };
  sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(storedTokens));
};

const readStoredTokens = (): StoredTokens | null => {
  const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredTokens;
  } catch {
    clearAuthState();
    return null;
  }
};

const buildFormBody = (values: Record<string, string>): URLSearchParams => {
  const body = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value) body.set(key, value);
  });
  return body;
};

export const startKeycloakLogin = async (returnPath = '/'): Promise<void> => {
  const config = getKeycloakConfig();
  const verifier = createRandomString(64);
  const state = createRandomString(32);
  const challenge = await createCodeChallenge(verifier);

  sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
  sessionStorage.setItem(PKCE_STATE_KEY, state);
  sessionStorage.setItem(RETURN_PATH_KEY, returnPath);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getLoginRedirectUri(),
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  window.location.assign(`${getAuthorizationEndpoint()}?${params.toString()}`);
};

export const completeKeycloakLogin = async (): Promise<string> => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  if (error) {
    throw new Error(params.get('error_description') || error);
  }

  const code = params.get('code');
  const state = params.get('state');
  const expectedState = sessionStorage.getItem(PKCE_STATE_KEY);
  const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);

  if (!code || !state || !expectedState || state !== expectedState || !verifier) {
    clearAuthState();
    throw new Error('Invalid Keycloak login response');
  }

  const config = getKeycloakConfig();
  const response = await fetch(getTokenEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: buildFormBody({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      code,
      redirect_uri: getLoginRedirectUri(),
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    clearAuthState();
    throw new Error('Unable to complete Keycloak login');
  }

  const tokenResponse = (await response.json()) as TokenResponse;
  storeTokens(tokenResponse);

  const returnPath = sessionStorage.getItem(RETURN_PATH_KEY) || '/';
  sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  sessionStorage.removeItem(PKCE_STATE_KEY);
  sessionStorage.removeItem(RETURN_PATH_KEY);
  window.history.replaceState({}, document.title, '/login');
  return returnPath;
};

const refreshAccessToken = async (tokens: StoredTokens): Promise<string | null> => {
  if (!tokens.refreshToken) {
    clearAuthState();
    return null;
  }

  const config = getKeycloakConfig();
  const response = await fetch(getTokenEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: buildFormBody({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      refresh_token: tokens.refreshToken,
    }),
  });

  if (!response.ok) {
    clearAuthState();
    return null;
  }

  const tokenResponse = (await response.json()) as TokenResponse;
  storeTokens(tokenResponse);
  return tokenResponse.access_token;
};

export const getAccessToken = async (): Promise<string | null> => {
  const tokens = readStoredTokens();
  if (!tokens) return null;

  if (tokens.expiresAt > Date.now() + EXPIRY_SKEW_MS) {
    return tokens.accessToken;
  }

  return refreshAccessToken(tokens);
};

export const authFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const headers = new Headers(init.headers);
  const token = await getAccessToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    credentials: init.credentials ?? 'include',
    headers,
  });
};

export const logoutFromAuthProvider = async (): Promise<void> => {
  const config = getKeycloakConfig();
  const tokens = readStoredTokens();
  clearAuthState();

  const params = new URLSearchParams({
    client_id: config.clientId,
    post_logout_redirect_uri: `${window.location.origin}/login`,
  });
  if (tokens?.idToken) {
    params.set('id_token_hint', tokens.idToken);
  }

  window.location.assign(`${getLogoutEndpoint()}?${params.toString()}`);
};
