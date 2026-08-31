import { Link } from "react-router-dom";
import catalog from "../../data/catalog.json";
import DriftWall, { type DriftWallItem } from "../components/DriftWall";
import { gateConfig } from "../lib/gates";

function sectionLabel(id?: string) {
  return gateConfig.sections.find((item) => item.id === id)?.label ?? id ?? "";
}

function clip(text: string, n = 36) {
  const next = text.replace(/\s+/g, " ").trim();
  return next.length > n ? `${next.slice(0, n)}…` : next;
}

function buildTiles(): DriftWallItem[] {
  const fromCollections: DriftWallItem[] = catalog.collections.map((item) => ({
    title: item.title,
    kicker: item.featured ? `本期重点 · ${sectionLabel(item.section)}` : `${sectionLabel(item.section)} · ${item.status === "published" ? item.updated : "即将收录"}`,
    excerpt: clip(item.subtitle && item.subtitle !== "待收录" ? `${item.subtitle}。${item.summary}` : item.summary),
    href: item.status === "published" ? `/c/${item.id}` : `/s/${item.section}`,
  }));

  const fromSections: DriftWallItem[] = gateConfig.sections.map((section) => {
    const count = catalog.collections.filter((item) => item.section === section.id).length;
    return {
      title: section.label,
      kicker: count ? `${count} 条条目` : "分类",
      excerpt: clip(section.summary),
      href: section.href,
    };
  });

  const tiles = [...fromCollections, ...fromSections];
  const filled = [...tiles];
  let i = 0;
  while (filled.length < 12) {
    filled.push({ ...tiles[i % tiles.length] });
    i += 1;
  }
  return filled;
}

export default function Home() {
  const tiles = buildTiles();

  return (
    <div className="home-screen">
      <section className="board-head">
        <h1>全部条目</h1>
        <Link className="see-new" to="/archive">
          查看归档 →
        </Link>
      </section>

      <section className="drift-stage">
        <DriftWall items={tiles} tilt={6} turn={-6} dim={0.96} fade={0.32} overlayColor="#05050a" />
      </section>
    </div>
  );
}
