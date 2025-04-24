export const DEFAULT_COLUMNS = ["id", "createdAt", "updatedAt"];
export const EXCLUDED_COLUMNS = ["actions", "select-id"];
export const DEFAULT_COLUMN_PRIORITIES: Record<string, number> = {
  "select-id": 0,
  id: 1,
  code: 2,
  featuredAsset: 2,
  name: 2,
  createdAt: 3,
  updatedAt: 4,
  actions: 999,
} as const;
