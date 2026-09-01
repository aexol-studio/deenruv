import { v1 } from "@google-shopping/products";
import { v1 as dataSourcesV1 } from "@google-shopping/datasources";
import type { protos } from "@google-shopping/products";
import type {
  GoogleProcessedProduct,
  GoogleProduct,
  GoogleProductInput,
  RemoteProduct,
} from "../types.js";

const GOOGLE_OAUTH_SCOPE = "https://www.googleapis.com/auth/content";
const PLAIN_IDENTIFIER_COMPONENT = /^[A-Za-z0-9_-]+$/;
const MERCHANT_ID_PATTERN = /^[1-9]\d*$/;
const DATA_SOURCE_PATTERN =
  /^accounts\/([1-9]\d*)\/dataSources\/([1-9]\d*)$/;
const CONTENT_LANGUAGE_PATTERN = /^[a-z]{2}$/;
const FEED_LABEL_PATTERN = /^[A-Z0-9_-]{1,20}$/;

export const GOOGLE_CONTENT_LANGUAGE = "pl";
export const GOOGLE_FEED_LABEL = "PL";
export const DEFAULT_GOOGLE_WRITE_CONCURRENCY = 4;
export const MAX_GOOGLE_DATA_SOURCE_DISCOVERY_RESULTS = 100;

type MerchantClientOptions = NonNullable<
  ConstructorParameters<typeof v1.ProductsServiceClient>[0]
>;

export type GoogleMerchantCredentials = NonNullable<
  MerchantClientOptions["credentials"]
>;

export type GoogleMerchantSettings = {
  accountId: string;
  autoUpdate: boolean;
  brand: string;
  credentials: GoogleMerchantCredentials;
  dataSource: string;
  contentLanguage: string;
  feedLabel: string;
};

export type GoogleMerchantClients = {
  dataSources: dataSourcesV1.DataSourcesServiceClient;
  productInputs: v1.ProductInputsServiceClient;
  products: v1.ProductsServiceClient;
};

type InsertProductInputRequest =
  protos.google.shopping.merchant.products.v1.IInsertProductInputRequest;
type UpdateProductInputRequest =
  protos.google.shopping.merchant.products.v1.IUpdateProductInputRequest;
type DeleteProductInputRequest =
  protos.google.shopping.merchant.products.v1.IDeleteProductInputRequest;
type ListProductsRequest =
  protos.google.shopping.merchant.products.v1.IListProductsRequest;

export type GoogleWriteOperation =
  | {
      communicateID: string;
      method: "insert";
      request: InsertProductInputRequest;
    }
  | {
      communicateID: string;
      method: "update";
      request: UpdateProductInputRequest;
    }
  | {
      communicateID: string;
      method: "delete";
      request: DeleteProductInputRequest;
    };

export type MerchantOperationResult<T> =
  | { attempts: number; index: number; item: T; status: "success" }
  | {
      attempts: number;
      error: unknown;
      index: number;
      item: T;
      status: "error";
    };

export type MerchantOperationSummary<T> = {
  failures: Array<Extract<MerchantOperationResult<T>, { status: "error" }>>;
  results: Array<MerchantOperationResult<T>>;
  status: "success" | "error";
};

export interface GoogleProductInputsWriter {
  deleteProductInput(request: DeleteProductInputRequest): Promise<unknown>;
  insertProductInput(request: InsertProductInputRequest): Promise<unknown>;
  updateProductInput(request: UpdateProductInputRequest): Promise<unknown>;
}

export interface GoogleProductsReader {
  listProductsAsync(
    request: ListProductsRequest,
  ): AsyncIterable<GoogleProcessedProduct>;
}

export interface GoogleDataSourcesReader {
  getDataSource(request: { name: string }): Promise<unknown>;
}

export interface GoogleDataSourcesDiscoveryClient {
  close(): Promise<void>;
  listDataSourcesAsync(request: {
    parent: string;
  }): AsyncIterable<{ name?: string | null }>;
}

export type GoogleDataSourcesDiscoveryClientFactory = (
  credentials: GoogleMerchantCredentials,
) => GoogleDataSourcesDiscoveryClient;

export type GoogleMerchantRetryOptions = {
  delay?: (attempt: number) => Promise<void>;
  maxAttempts?: number;
};

export type GoogleMerchantConnectionStatus =
  | "CONNECTED"
  | "NOT_CONFIGURED"
  | "INVALID_CONFIGURATION"
  | "DATA_SOURCE_NOT_FOUND"
  | "AUTHENTICATION_FAILED"
  | "PERMISSION_DENIED"
  | "UNAVAILABLE"
  | "ERROR";

export type GoogleMerchantProductIssue = {
  code: string;
  description: string;
  offerId: string;
  severity: string;
};

export type GoogleMerchantConnectionDiagnostic = {
  checkedAt: string;
  connectionStatus: GoogleMerchantConnectionStatus;
  dataSourceVerified: boolean;
  disapprovedProductsCount: number;
  issues: GoogleMerchantProductIssue[];
  issuesCount: number;
  lastError?: Omit<NormalizedGoogleMerchantError, "status">;
  latencyMs: number;
  productsCount: number;
};

export type NormalizedGoogleMerchantError = {
  code: string;
  message: string;
  retryable: boolean;
  status: GoogleMerchantConnectionStatus;
};

type SettingEntry = { key: string; value: string };

class MerchantOperationAttemptError {
  constructor(
    readonly cause: unknown,
    readonly attempts: number,
  ) {}
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeGoogleMerchantError(
  error: unknown,
): NormalizedGoogleMerchantError {
  const candidate = isRecord(error) ? error : {};
  const numericCode =
    typeof candidate.code === "number"
      ? candidate.code
      : Number.parseInt(String(candidate.code ?? ""), 10);
  const codeMap: Record<
    number,
    Pick<NormalizedGoogleMerchantError, "code" | "retryable" | "status">
  > = {
    7: {
      code: "PERMISSION_DENIED",
      retryable: false,
      status: "PERMISSION_DENIED",
    },
    5: {
      code: "NOT_FOUND",
      retryable: false,
      status: "DATA_SOURCE_NOT_FOUND",
    },
    8: {
      code: "RESOURCE_EXHAUSTED",
      retryable: true,
      status: "UNAVAILABLE",
    },
    13: { code: "INTERNAL", retryable: true, status: "UNAVAILABLE" },
    14: { code: "UNAVAILABLE", retryable: true, status: "UNAVAILABLE" },
    16: {
      code: "UNAUTHENTICATED",
      retryable: false,
      status: "AUTHENTICATION_FAILED",
    },
  };
  const classification = codeMap[numericCode] ?? {
    code:
      typeof candidate.code === "string"
        ? candidate.code
        : Number.isFinite(numericCode)
          ? String(numericCode)
          : "UNKNOWN",
    retryable: false,
    status: "ERROR" as const,
  };
  const rawMessage =
    typeof candidate.details === "string"
      ? candidate.details
      : error instanceof Error
        ? error.message
        : "Unknown Google Merchant error";
  const message = rawMessage
    .replace(
      /-----BEGIN [^-]+ PRIVATE KEY-----[\s\S]*?-----END [^-]+ PRIVATE KEY-----/g,
      "[REDACTED PRIVATE KEY]",
    )
    .replace(/(access_token|refresh_token|client_secret)=([^&\s]+)/gi, "$1=[REDACTED]")
    .slice(0, 2000);

  return { ...classification, message };
}

function optionalString(
  value: Record<string, unknown>,
  key: string,
): string | undefined {
  const candidate = value[key];
  return typeof candidate === "string" && candidate.length > 0
    ? candidate
    : undefined;
}

function requiredString(value: Record<string, unknown>, key: string): string {
  const candidate = optionalString(value, key);
  if (!candidate || candidate.trim().length === 0) {
    throw new Error(`Google credentials field ${key} is required`);
  }
  return candidate;
}

export function parseGoogleCredentials(
  rawCredentials: string,
): GoogleMerchantCredentials {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawCredentials);
  } catch {
    throw new Error("Google credentials must be valid JSON");
  }
  if (!isRecord(parsed)) {
    throw new Error("Google credentials must be a JSON object");
  }

  const credentialType = optionalString(parsed, "type");
  if (credentialType === "authorized_user") {
    return {
      type: "authorized_user",
      client_id: requiredString(parsed, "client_id").trim(),
      client_secret: requiredString(parsed, "client_secret"),
      refresh_token: requiredString(parsed, "refresh_token"),
      ...(optionalString(parsed, "quota_project_id") && {
        quota_project_id: optionalString(parsed, "quota_project_id"),
      }),
    };
  }

  if (credentialType === undefined || credentialType === "service_account") {
    return {
      type: "service_account",
      client_email: requiredString(parsed, "client_email").trim(),
      private_key: requiredString(parsed, "private_key"),
      ...(optionalString(parsed, "private_key_id") && {
        private_key_id: optionalString(parsed, "private_key_id"),
      }),
      ...(optionalString(parsed, "project_id") && {
        project_id: optionalString(parsed, "project_id"),
      }),
      ...(optionalString(parsed, "client_id") && {
        client_id: optionalString(parsed, "client_id"),
      }),
      ...(optionalString(parsed, "quota_project_id") && {
        quota_project_id: optionalString(parsed, "quota_project_id"),
      }),
    };
  }

  throw new Error(
    `Unsupported Google credentials type: ${credentialType ?? "missing"}`,
  );
}

export function normalizeMerchantId(rawMerchantId: string): string {
  const merchantId = rawMerchantId.trim();
  if (!MERCHANT_ID_PATTERN.test(merchantId)) {
    throw new Error("Merchant ID must be a positive numeric account ID");
  }
  return merchantId;
}

export function normalizeDataSource(
  rawDataSource: string,
  merchantId: string,
): string {
  const dataSource = rawDataSource.trim();
  const match = DATA_SOURCE_PATTERN.exec(dataSource);
  if (!match) {
    throw new Error(
      "Google dataSource must match accounts/{merchantId}/dataSources/{id}",
    );
  }
  if (match[1] !== merchantId) {
    throw new Error("Google dataSource account must match Merchant ID");
  }
  return `accounts/${match[1]}/dataSources/${match[2]}`;
}

export function parseGoogleDataSourceDiscoverySettings(
  requestedMerchantId: string,
  entries: readonly SettingEntry[],
): Pick<GoogleMerchantSettings, "accountId" | "credentials"> {
  const getValue = (key: string) =>
    entries.find((entry) => entry.key === key)?.value;
  const accountId = normalizeMerchantId(requestedMerchantId);
  const rawCredentials = getValue("credentials")?.trim();
  if (!rawCredentials) {
    throw new Error("Saved Google credentials are required");
  }
  try {
    return {
      accountId,
      credentials: parseGoogleCredentials(rawCredentials),
    };
  } catch {
    throw new Error("Saved Google credentials are invalid");
  }
}

export function createGoogleDataSourcesDiscoveryClient(
  credentials: GoogleMerchantCredentials,
): GoogleDataSourcesDiscoveryClient {
  const client = new dataSourcesV1.DataSourcesServiceClient({
    credentials,
    scopes: [GOOGLE_OAUTH_SCOPE],
  });
  // Google exposes data-source reads under the broad content scope. Actual write
  // prevention is IAM/operator-owned; this wrapper narrows the runtime API surface.
  return {
    close: () => client.close(),
    listDataSourcesAsync: (request) => client.listDataSourcesAsync(request),
  };
}

function normalizeGoogleDataSourceDiscoveryError(error: unknown): Error {
  const normalized = normalizeGoogleMerchantError(error);
  const messages: Partial<Record<GoogleMerchantConnectionStatus, string>> = {
    AUTHENTICATION_FAILED: "Google Merchant authentication failed",
    PERMISSION_DENIED:
      "Saved Google credentials cannot read this Merchant account",
    UNAVAILABLE: "Google Merchant data-source discovery is temporarily unavailable",
  };
  return new Error(
    messages[normalized.status] ?? "Google Merchant data-source discovery failed",
  );
}

export async function discoverGoogleMerchantDataSources(
  requestedMerchantId: string,
  entries: readonly SettingEntry[],
  createClient: GoogleDataSourcesDiscoveryClientFactory =
    createGoogleDataSourcesDiscoveryClient,
): Promise<string[]> {
  const settings = parseGoogleDataSourceDiscoverySettings(
    requestedMerchantId,
    entries,
  );
  let client: GoogleDataSourcesDiscoveryClient;
  try {
    client = createClient(settings.credentials);
  } catch {
    throw new Error("Google Merchant data-source client could not be created");
  }
  const names = new Set<string>();
  let discoveryError: Error | undefined;

  try {
    for await (const dataSource of client.listDataSourcesAsync({
      parent: `accounts/${settings.accountId}`,
    })) {
      if (!dataSource.name) continue;
      try {
        names.add(normalizeDataSource(dataSource.name, settings.accountId));
        if (names.size === MAX_GOOGLE_DATA_SOURCE_DISCOVERY_RESULTS) break;
      } catch {
        // Ignore malformed or cross-account resources returned by the remote API.
      }
    }
    return [...names].sort();
  } catch (error) {
    discoveryError = normalizeGoogleDataSourceDiscoveryError(error);
    throw discoveryError;
  } finally {
    try {
      await client.close();
    } catch {
      if (!discoveryError) {
        throw new Error("Google Merchant data-source client could not be closed");
      }
    }
  }
}

export function parseGoogleMerchantSettings(
  entries: readonly SettingEntry[],
): GoogleMerchantSettings {
  const getValue = (key: string) =>
    entries.find((entry) => entry.key === key)?.value;
  const accountId = normalizeMerchantId(getValue("merchantId") ?? "");
  const dataSource = normalizeDataSource(
    getValue("dataSource") ?? "",
    accountId,
  );
  const brand = (getValue("brand") ?? "").trim();
  if (!brand) {
    throw new Error("Google brand is required");
  }
  const credentials = parseGoogleCredentials(getValue("credentials") ?? "");
  const contentLanguage = (
    getValue("contentLanguage") ?? GOOGLE_CONTENT_LANGUAGE
  )
    .trim()
    .toLowerCase();
  if (!CONTENT_LANGUAGE_PATTERN.test(contentLanguage)) {
    throw new Error("Google contentLanguage must be a two-letter language code");
  }
  const feedLabel = (getValue("feedLabel") ?? GOOGLE_FEED_LABEL)
    .trim()
    .toUpperCase();
  if (!FEED_LABEL_PATTERN.test(feedLabel)) {
    throw new Error(
      "Google feedLabel must contain 1-20 uppercase letters, numbers, hyphens, or underscores",
    );
  }

  return {
    accountId,
    autoUpdate: (getValue("autoUpdate") ?? "").toLowerCase() === "true",
    brand,
    credentials,
    dataSource,
    contentLanguage,
    feedLabel,
  };
}

export function createGoogleMerchantClients(
  credentials: GoogleMerchantCredentials,
): GoogleMerchantClients {
  const options: MerchantClientOptions = {
    credentials,
    scopes: [GOOGLE_OAUTH_SCOPE],
  };
  return {
    dataSources: new dataSourcesV1.DataSourcesServiceClient(options),
    productInputs: new v1.ProductInputsServiceClient(options),
    products: new v1.ProductsServiceClient(options),
  };
}

export function buildGoogleProductIdentifier(
  offerId: string,
  contentLanguage = GOOGLE_CONTENT_LANGUAGE,
  feedLabel = GOOGLE_FEED_LABEL,
): string {
  if (!offerId) {
    throw new Error("Google offer ID is required");
  }
  const components = [contentLanguage, feedLabel, offerId];
  const identifier = components.join("~");
  return components.every((component) =>
    PLAIN_IDENTIFIER_COMPONENT.test(component),
  )
    ? identifier
    : Buffer.from(identifier, "utf8").toString("base64url");
}

export function buildGoogleProductName(
  accountId: string,
  offerId: string,
  contentLanguage = GOOGLE_CONTENT_LANGUAGE,
  feedLabel = GOOGLE_FEED_LABEL,
): string {
  return `accounts/${accountId}/products/${buildGoogleProductIdentifier(
    offerId,
    contentLanguage,
    feedLabel,
  )}`;
}

export function buildGoogleProductInputName(
  accountId: string,
  offerId: string,
  contentLanguage = GOOGLE_CONTENT_LANGUAGE,
  feedLabel = GOOGLE_FEED_LABEL,
): string {
  return `accounts/${accountId}/productInputs/${buildGoogleProductIdentifier(
    offerId,
    contentLanguage,
    feedLabel,
  )}`;
}

export function toGoogleProductInput(
  product: GoogleProduct,
  brand: string,
  contentLanguage = GOOGLE_CONTENT_LANGUAGE,
  feedLabel = GOOGLE_FEED_LABEL,
): GoogleProductInput {
  return {
    offerId: String(product.communicateID),
    contentLanguage,
    feedLabel,
    productAttributes: {
      ...product.productAttributes,
      brand,
    },
    ...(product.customAttributes && {
      customAttributes: product.customAttributes,
    }),
    ...(product.versionNumber !== undefined && {
      versionNumber: product.versionNumber,
    }),
  };
}

export function validateGoogleProductUrls(product: GoogleProduct): void {
  const attributes = product.productAttributes;
  const urls = [
    ["link", attributes.link],
    ["imageLink", attributes.imageLink],
    ...((attributes.additionalImageLinks ?? []).map((url, index) => [
      `additionalImageLinks[${index}]`,
      url,
    ]) as Array<[string, string | null | undefined]>),
  ] as Array<[string, string | null | undefined]>;
  for (const [field, value] of urls) {
    if (!value) continue;
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      throw new Error(
        `Google product ${product.communicateID} ${field} must be an absolute http(s) URL`,
      );
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error(
        `Google product ${product.communicateID} ${field} must be an absolute http(s) URL`,
      );
    }
  }
}

function camelToSnake(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function buildGoogleUpdateMask(
  productInput: GoogleProductInput,
): protos.google.protobuf.IFieldMask {
  const paths = Object.entries(productInput.productAttributes ?? {})
    .filter(([, value]) => value !== undefined)
    .map(([key]) => `product_attributes.${camelToSnake(key)}`);

  for (const customAttribute of productInput.customAttributes ?? []) {
    if (customAttribute.name) {
      paths.push(`custom_attribute.${customAttribute.name}`);
    }
  }
  if (paths.length === 0) {
    throw new Error("Google update requires at least one mutable attribute");
  }
  return { paths };
}

export function createGoogleInsertOperation(
  product: GoogleProduct,
  settings: GoogleMerchantSettings,
): GoogleWriteOperation {
  const communicateID = String(product.communicateID);
  return {
    communicateID,
    method: "insert",
    request: {
      parent: `accounts/${settings.accountId}`,
      dataSource: settings.dataSource,
      productInput: toGoogleProductInput(
        product,
        settings.brand,
        settings.contentLanguage,
        settings.feedLabel,
      ),
    },
  };
}

export function createGoogleUpdateOperation(
  product: GoogleProduct,
  settings: GoogleMerchantSettings,
): GoogleWriteOperation {
  const communicateID = String(product.communicateID);
  const input = toGoogleProductInput(
    product,
    settings.brand,
    settings.contentLanguage,
    settings.feedLabel,
  );
  const productInput: GoogleProductInput = {
    name: buildGoogleProductInputName(
      settings.accountId,
      communicateID,
      settings.contentLanguage,
      settings.feedLabel,
    ),
    productAttributes: input.productAttributes,
    ...(input.customAttributes && {
      customAttributes: input.customAttributes,
    }),
  };
  return {
    communicateID,
    method: "update",
    request: {
      dataSource: settings.dataSource,
      productInput,
      updateMask: buildGoogleUpdateMask(productInput),
    },
  };
}

export function createGoogleDeleteOperation(
  communicateID: string,
  settings: GoogleMerchantSettings,
): GoogleWriteOperation {
  return {
    communicateID,
    method: "delete",
    request: {
      name: buildGoogleProductInputName(
        settings.accountId,
        communicateID,
        settings.contentLanguage,
        settings.feedLabel,
      ),
      dataSource: settings.dataSource,
    },
  };
}

export async function runBoundedMerchantOperations<T>(
  items: readonly T[],
  operation: (item: T, index: number) => Promise<number | void>,
  concurrency = DEFAULT_GOOGLE_WRITE_CONCURRENCY,
): Promise<Array<MerchantOperationResult<T>>> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("Merchant operation concurrency must be a positive integer");
  }
  if (items.length === 0) return [];

  const results = new Array<MerchantOperationResult<T>>(items.length);
  let nextIndex = 0;
  const workerCount = Math.min(concurrency, items.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      const item = items[index];
      try {
        const attempts = await operation(item, index);
        results[index] = {
          attempts: attempts ?? 1,
          index,
          item,
          status: "success",
        };
      } catch (error) {
        results[index] = {
          attempts:
            error instanceof MerchantOperationAttemptError ? error.attempts : 1,
          error:
            error instanceof MerchantOperationAttemptError ? error.cause : error,
          index,
          item,
          status: "error",
        };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

function isNotFoundError(error: unknown): boolean {
  if (!isRecord(error)) return false;
  if (error.code === 5 || error.code === 404 || error.code === "404") return true;
  const response = error.response;
  return isRecord(response) && response.status === 404;
}

export async function executeGoogleWriteOperations(
  client: GoogleProductInputsWriter,
  operations: readonly GoogleWriteOperation[],
  concurrency = DEFAULT_GOOGLE_WRITE_CONCURRENCY,
  retryOptions: GoogleMerchantRetryOptions = {},
): Promise<Array<MerchantOperationResult<GoogleWriteOperation>>> {
  const maxAttempts = retryOptions.maxAttempts ?? 3;
  const delay =
    retryOptions.delay ??
    (async (attempt: number) => {
      const exponentialDelay = 250 * 2 ** (attempt - 1);
      const jitter = Math.floor(Math.random() * 100);
      await new Promise((resolve) =>
        setTimeout(resolve, exponentialDelay + jitter),
      );
    });
  return runBoundedMerchantOperations(
    operations,
    async (operation) => {
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          if (operation.method === "insert") {
            await client.insertProductInput(operation.request);
          } else if (operation.method === "update") {
            await client.updateProductInput(operation.request);
          } else {
            await client.deleteProductInput(operation.request);
          }
          return attempt;
        } catch (error) {
          if (operation.method === "delete" && isNotFoundError(error)) return;
          const normalized = normalizeGoogleMerchantError(error);
          if (!normalized.retryable || attempt === maxAttempts) {
            throw new MerchantOperationAttemptError(error, attempt);
          }
          await delay(attempt);
        }
      }
    },
    concurrency,
  );
}

export function summarizeMerchantOperations<T>(
  results: Array<MerchantOperationResult<T>>,
): MerchantOperationSummary<T> {
  const failures = results.filter(
    (
      result,
    ): result is Extract<MerchantOperationResult<T>, { status: "error" }> =>
      result.status === "error",
  );
  return {
    failures,
    results,
    status: failures.length === 0 ? "success" : "error",
  };
}

export async function collectGoogleProductsForDataSource(
  client: GoogleProductsReader,
  accountId: string,
  dataSource: string,
): Promise<RemoteProduct[]> {
  const products = new Map<string, RemoteProduct>();
  for await (const product of client.listProductsAsync({
    parent: `accounts/${accountId}`,
    pageSize: 1000,
  })) {
    if (product.dataSource !== dataSource || !product.offerId) continue;
    products.set(product.offerId, {
      communicateID: product.offerId,
      name: product.productAttributes?.title ?? undefined,
    });
  }
  return [...products.values()];
}

export async function diagnoseGoogleMerchantConnection(
  client: GoogleProductsReader,
  settings: Pick<GoogleMerchantSettings, "accountId" | "dataSource">,
  dataSourcesClient?: GoogleDataSourcesReader,
): Promise<GoogleMerchantConnectionDiagnostic> {
  const startedAt = Date.now();
  const issues: GoogleMerchantProductIssue[] = [];
  let productsCount = 0;
  let disapprovedProductsCount = 0;

  try {
    if (dataSourcesClient) {
      await dataSourcesClient.getDataSource({ name: settings.dataSource });
    }
    for await (const product of client.listProductsAsync({
      parent: `accounts/${settings.accountId}`,
      pageSize: 1000,
    })) {
      if (product.dataSource !== settings.dataSource) continue;
      productsCount += 1;
      let isDisapproved = false;
      for (const issue of product.productStatus?.itemLevelIssues ?? []) {
        const severity =
          typeof issue.severity === "string"
            ? issue.severity
            : issue.severity === 3
              ? "DISAPPROVED"
              : String(issue.severity ?? "SEVERITY_UNSPECIFIED");
        if (severity === "DISAPPROVED") isDisapproved = true;
        issues.push({
          code: issue.code ?? "unknown",
          description:
            issue.description ?? issue.detail ?? "Unknown product issue",
          offerId: product.offerId ?? "unknown",
          severity,
        });
      }
      if (isDisapproved) disapprovedProductsCount += 1;
    }
  } catch (error) {
    const { status, ...lastError } = normalizeGoogleMerchantError(error);
    return {
      checkedAt: new Date().toISOString(),
      connectionStatus: status,
      dataSourceVerified: false,
      disapprovedProductsCount,
      issues,
      issuesCount: issues.length,
      lastError,
      latencyMs: Date.now() - startedAt,
      productsCount,
    };
  }

  return {
    checkedAt: new Date().toISOString(),
    connectionStatus: "CONNECTED",
    dataSourceVerified: Boolean(dataSourcesClient),
    disapprovedProductsCount,
    issues,
    issuesCount: issues.length,
    latencyMs: Date.now() - startedAt,
    productsCount,
  };
}

export function selectRemoteOrphanProducts(
  remoteProducts: readonly RemoteProduct[],
  localProducts: readonly Pick<GoogleProduct, "communicateID">[],
): RemoteProduct[] {
  const localIds = new Set(
    localProducts.map((product) => String(product.communicateID)),
  );
  const selected = new Map<string, RemoteProduct>();
  for (const remoteProduct of remoteProducts) {
    if (!localIds.has(remoteProduct.communicateID)) {
      selected.set(remoteProduct.communicateID, remoteProduct);
    }
  }
  return [...selected.values()];
}
