import api from "./api.client";

// Types
export interface ApiKey {
  id: number;
  keyPrefix: string;
  name: string;
  scopes: string[];
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  revokedAt?: string | null;
}

export interface CreateApiKeyResponse {
  id: number;
  key: string; // Full key - ONLY returned on creation!
  keyPrefix: string;
  name: string;
  scopes: string[];
  createdAt: string;
}

export interface ApiKeyScope {
  name: string;
  value: string;
  description: string;
}

export interface CreateApiKeyData {
  name: string;
  scopes?: string[];
  expiresAt?: string;
}

// Response types matching actual API
interface GetApiKeysResponse {
  success: boolean;
  data: ApiKey[];
  meta: {
    total: number;
    availableScopes: string[];
  };
}

interface CreateApiKeyApiResponse {
  success: boolean;
  message: string;
  data: CreateApiKeyResponse;
}

interface GetScopesResponse {
  success: boolean;
  data: {
    scopes: ApiKeyScope[];
    defaults: string[];
  };
}

// API Functions
export async function getApiKeys(orgId: number): Promise<ApiKey[]> {
  const response = await api.get<GetApiKeysResponse>(
    `/admin/organizations/${orgId}/api-keys`
  );
  console.log("getApiKeys raw response:", response);
  // api.get already returns response.data, so response IS { success, data, meta }
  const data = (response as any)?.data;
  console.log("getApiKeys data:", data);
  return Array.isArray(data) ? data : [];
}

export async function createApiKey(
  orgId: number,
  data: CreateApiKeyData
): Promise<CreateApiKeyResponse> {
  const response = await api.post<CreateApiKeyApiResponse>(
    `/admin/organizations/${orgId}/api-keys`,
    data
  );
  console.log("createApiKey raw response:", response);
  // api.post already returns response.data, so response IS { success, message, data }
  return (response as any)?.data;
}

export async function revokeApiKey(
  orgId: number,
  keyId: number
): Promise<void> {
  await api.post(`/admin/organizations/${orgId}/api-keys/${keyId}/revoke`);
}

export async function deleteApiKey(
  orgId: number,
  keyId: number
): Promise<void> {
  await api.delete(`/admin/organizations/${orgId}/api-keys/${keyId}`);
}

export async function getAvailableScopes(
  orgId: number
): Promise<ApiKeyScope[]> {
  const response = await api.get<GetScopesResponse>(
    `/admin/organizations/${orgId}/api-keys/scopes`
  );
  console.log("getAvailableScopes raw response:", response);
  // API returns { success, data: { scopes: [...], defaults: [...] } }
  // api.get returns response.data, so response IS { success, data: {...} }
  const scopes = (response as any)?.data?.scopes;
  console.log("getAvailableScopes scopes:", scopes);
  return Array.isArray(scopes) ? scopes : DEFAULT_SCOPES;
}

// Default scopes for fallback
export const DEFAULT_SCOPES: ApiKeyScope[] = [
  {
    name: "Read Permissions",
    value: "permissions:read",
    description: "Read user permissions and feature access",
  },
  {
    name: "Read Usage",
    value: "usage:read",
    description: "Read usage data for users",
  },
  {
    name: "Write Usage",
    value: "usage:write",
    description: "Record usage for users",
  },
  {
    name: "Sync Users",
    value: "users:sync",
    description: "Sync/create users from your application",
  },
];
