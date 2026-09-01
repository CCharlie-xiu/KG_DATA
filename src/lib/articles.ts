import type { ArticleMeta } from "./types";

const metaModules = import.meta.glob("../../data/collections/*/meta.json", {
  eager: true,
  import: "default",
}) as Record<string, ArticleMeta>;

function collectionIdFromPath(path: string): string | null {
  const match = path.match(/collections\/([^/]+)\/meta\.json$/);
  return match?.[1] ?? null;
}

const byId = new Map<string, ArticleMeta>();
for (const [path, meta] of Object.entries(metaModules)) {
  const id = collectionIdFromPath(path);
  if (id && meta) byId.set(id, meta);
}

/** 读取 collections/<id>/meta.json；无文件则返回 null。 */
export function loadArticleMeta(id: string): ArticleMeta | null {
  return byId.get(id) ?? null;
}
