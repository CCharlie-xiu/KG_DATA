import catalogJson from "../../data/catalog.json";
import { type DriftWallItem } from "../components/DriftWall";
import { loadArticleMeta } from "./articles";
import { gateConfig } from "./gates";
import type { Catalog, CatalogItem } from "./types";

const catalog = catalogJson as Catalog;

export function sectionLabel(id?: string) {
  return gateConfig.sections.find((item) => item.id === id)?.label ?? id ?? "";
}

export function clip(text: string, n = 36) {
  const next = text.replace(/\s+/g, " ").trim();
  return next.length > n ? `${next.slice(0, n)}…` : next;
}

export function fillTiles(tiles: DriftWallItem[], min = 12): DriftWallItem[] {
  if (tiles.length === 0) return tiles;
  const filled = [...tiles];
  let i = 0;
  while (filled.length < min) {
    filled.push({ ...tiles[i % tiles.length] });
    i += 1;
  }
  return filled;
}

export function collectionTile(item: CatalogItem): DriftWallItem {
  const section = sectionLabel(item.section);
  return {
    title: item.title,
    kicker: item.featured
      ? `本期重点 · ${section}`
      : `${section} · ${item.status === "published" ? item.updated : "即将收录"}`,
    excerpt: clip(item.subtitle && item.subtitle !== "待收录" ? `${item.subtitle}。${item.summary}` : item.summary),
    href: item.status === "published" ? `/c/${item.id}` : item.section ? `/s/${item.section}` : undefined,
  };
}

export function sectionTile(sectionId: string): DriftWallItem {
  const section = gateConfig.sections.find((item) => item.id === sectionId);
  const count = catalog.collections.filter((item) => item.section === sectionId).length;
  return {
    title: section?.label ?? sectionId,
    kicker: count ? `${count} 条条目` : "分类",
    excerpt: clip(section?.summary ?? ""),
    href: section?.href,
  };
}

export function homeTiles(): DriftWallItem[] {
  const fromCollections = catalog.collections.map(collectionTile);
  const fromSections = gateConfig.sections
    .filter((section) => section.id !== "search")
    .map((section) => sectionTile(section.id));
  return fillTiles([...fromCollections, ...fromSections]);
}

export function sectionTiles(sectionId: string): DriftWallItem[] {
  const mine = catalog.collections.filter((item) => item.section === sectionId);
  if (mine.length === 0) {
    const section = gateConfig.sections.find((item) => item.id === sectionId);
    return fillTiles([
      {
        title: "还没有条目",
        kicker: section?.label ?? sectionId,
        excerpt: clip(section?.summary ?? "这个类别还没有条目。"),
      },
    ]);
  }
  return fillTiles(mine.map(collectionTile));
}

export function archiveTiles(): DriftWallItem[] {
  return fillTiles(catalog.collections.map(collectionTile));
}

/** 目录字段 + 正文（meta body / sections）全文检索 */
function searchableText(item: CatalogItem): string {
  const meta = loadArticleMeta(item.id);
  const parts = [
    item.title,
    item.subtitle,
    item.summary,
    item.category,
    item.section,
    item.tags.join(" "),
    meta?.title,
    meta?.body,
    ...(meta?.notes ?? []),
  ];
  for (const section of meta?.sections ?? []) {
    parts.push(section.heading, section.body);
  }
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function searchHits(query: string): CatalogItem[] {
  const key = query.trim().toLowerCase();
  if (!key) return [...catalog.collections];
  return catalog.collections.filter((item) => searchableText(item).includes(key));
}

export function searchTiles(query: string): DriftWallItem[] {
  const hits = searchHits(query);
  const key = query.trim();

  if (hits.length === 0) {
    return fillTiles([
      {
        title: "没有匹配",
        kicker: "搜索",
        excerpt: "换个关键词，会搜标题、标签、摘要和正文。",
      },
    ]);
  }

  const tiles = hits.map(collectionTile);
  return key ? tiles : fillTiles(tiles);
}

function hashSeed(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 从正文稳定截取 100–150 字（同条目同查询不跳变） */
function randomSnippet(source: string, seedKey: string, min = 100, max = 150): string {
  const text = source.replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= min) return text;
  const seed = hashSeed(seedKey);
  const take = Math.min(text.length, min + (seed % (max - min + 1)));
  if (text.length <= take) return text;
  const start = seed % (text.length - take + 1);
  const slice = text.slice(start, start + take);
  const prefix = start > 0 ? "…" : "";
  const suffix = start + take < text.length ? "…" : "";
  return `${prefix}${slice}${suffix}`;
}

function itemBodyText(item: CatalogItem): string {
  const meta = loadArticleMeta(item.id);
  const parts = [
    item.summary,
    item.subtitle,
    meta?.body,
    ...(meta?.notes ?? []),
  ];
  for (const section of meta?.sections ?? []) {
    parts.push(section.heading, section.body);
  }
  return parts.filter(Boolean).join(" ");
}

function masonryHeight(excerpt: string, title: string) {
  const n = title.length + excerpt.length;
  return 320 + Math.min(280, Math.floor(n * 1.6));
}

/** 搜索页 Masonry：主题 + 随机正文摘录，无图 */
export function searchMasonryItems(query: string) {
  return searchHits(query).map((item) => {
    const tile = collectionTile(item);
    const excerpt = randomSnippet(itemBodyText(item), `${item.id}:${query}`) || clip(item.summary, 140);
    return {
      id: item.id,
      url: tile.href ?? `/s/${item.section ?? "architecture"}`,
      height: masonryHeight(excerpt, item.title),
      title: item.title,
      excerpt,
    };
  });
}
