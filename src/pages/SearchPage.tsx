import { useNavigate, useSearchParams } from "react-router-dom";
import GateWall from "../components/GateWall";
import Masonry from "../components/Masonry";
import { getSection } from "../lib/gates";
import { searchMasonryItems } from "../lib/tiles";

export default function SearchPage() {
  const section = getSection("search");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const items = searchMasonryItems(q);
  const title = q.trim() ? `搜索 · ${q.trim()}` : "搜索";

  if (!section) return null;

  return (
    <GateWall section={section}>
      <div className="home-screen search-screen">
        <section className="board-head">
          <h1>{title}</h1>
        </section>
        {items.length === 0 ? (
          <p className="search-empty">没有匹配。换个关键词，会搜标题、标签、摘要和正文。</p>
        ) : (
          <section className="search-masonry">
            <Masonry
              items={items}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover
              hoverScale={0.97}
              blurToFocus
              colorShiftOnHover={false}
              onItemClick={(item) => navigate(item.url)}
            />
          </section>
        )}
      </div>
    </GateWall>
  );
}
