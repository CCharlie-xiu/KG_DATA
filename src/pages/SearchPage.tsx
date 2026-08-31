import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import catalog from "../../data/catalog.json";
import { getSection } from "../lib/gates";
import GateWall from "../components/GateWall";

export default function SearchPage() {
  const section = getSection("search");
  const [q, setQ] = useState("");

  if (!section) return null;

  const hits = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return catalog.collections;
    return catalog.collections.filter((item) => {
      const blob = [item.title, item.summary, item.tags.join(" "), item.category].join(" ").toLowerCase();
      return blob.includes(key);
    });
  }, [q]);

  return (
    <GateWall section={section}>
      <section className="article section-page">
        <div className="kicker">检索</div>
        <h1>搜索模式</h1>
        <p className="muted">{section.summary}</p>
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜标题、标签、摘要…"
        />
        <div className="side-stack" style={{ marginTop: 20, maxWidth: 560 }}>
          {hits.map((item) => (
            <article key={item.id} className="side-card">
              <div className="kicker">{item.section ?? item.category}</div>
              <h3>{item.title}</h3>
              <p className="muted">{item.summary}</p>
              {item.status === "published" ? <Link to={`/c/${item.id}`}>进入 →</Link> : <span className="muted">待收录</span>}
            </article>
          ))}
        </div>
      </section>
    </GateWall>
  );
}
