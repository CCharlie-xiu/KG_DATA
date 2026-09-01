import { Link, useParams } from "react-router-dom";
import catalog from "../../data/catalog.json";
import type { CatalogItem } from "../lib/types";
import GaCatalog from "./GaCatalog";
import ArchSpecCatalog from "./ArchSpecCatalog";
import PlannedArticle from "./PlannedArticle";

export default function CollectionPage() {
  const { id } = useParams();
  const item = catalog.collections.find((c) => c.id === id) as CatalogItem | undefined;

  if (!item) {
    return (
      <section className="article">
        <Link className="back" to="/">
          ← 返回目录
        </Link>
        <h1>没有这条目录</h1>
        <p className="muted">id={id} 未在 catalog.json 登记。</p>
      </section>
    );
  }

  if (item.viewer === "ga-catalog") {
    return <GaCatalog />;
  }

  if (item.viewer === "arch-spec") {
    return <ArchSpecCatalog />;
  }

  return <PlannedArticle item={item} />;
}
