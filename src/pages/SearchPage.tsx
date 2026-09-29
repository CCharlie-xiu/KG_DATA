import { useSearchParams } from "react-router-dom";
import GateWall from "../components/GateWall";
import MasonryScreen from "../components/MasonryScreen";
import { getSection } from "../lib/gates";
import { searchMasonryItems } from "../lib/tiles";

export default function SearchPage() {
  const section = getSection("search");
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const items = searchMasonryItems(q);
  const title = q.trim() ? `搜索 · ${q.trim()}` : "搜索";

  if (!section) return null;

  return (
    <GateWall section={section}>
      <MasonryScreen title={title} items={items} empty="没有匹配。换个关键词，会搜标题、标签、摘要和正文。" />
    </GateWall>
  );
}
