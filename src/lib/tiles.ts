import catalogJson from "../../data/catalog.json";
import { type DriftWallItem } from "../components/DriftWall";
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

export function searchTiles(query: string): DriftWallItem[] {
  const key = query.trim().toLowerCase();
  const hits = key
    ? catalog.collections.filter((item) => {
        const blob = [item.title, item.summary, item.tags.join(" "), item.category, item.subtitle].join(" ").toLowerCase();
        return blob.includes(key);
      })
    : catalog.collections;

  if (hits.length === 0) {
    return fillTiles([
      {
        title: "没有匹配",
        kicker: "搜索",
        excerpt: "换个标题、标签或摘要再试。",
      },
    ]);
  }

  const tiles = hits.map(collectionTile);
  return key ? tiles : fillTiles(tiles);
}
