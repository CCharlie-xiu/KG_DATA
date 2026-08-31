import { Link, Navigate, useParams } from "react-router-dom";
import catalog from "../../data/catalog.json";
import { getSection } from "../lib/gates";
import GateWall from "../components/GateWall";

export default function SectionPage() {
  const { id = "" } = useParams();
  const section = getSection(id);

  if (!section || section.id === "search") {
    return <Navigate to="/" replace />;
  }

  const items = catalog.collections.filter((item) => item.section === section.id);

  return (
    <GateWall section={section}>
      <section className="article section-page">
        <div className="kicker">{section.requireAuth ? "已验证" : "公开"}</div>
        <h1>{section.label}</h1>
        <p className="muted">{section.summary}</p>
        {items.length === 0 ? (
          <p className="muted">这个类别还没有条目。在 catalog.json 把 collection 的 section 设为 {section.id} 即可出现。</p>
        ) : (
          <div className="side-stack" style={{ marginTop: 24, maxWidth: 560 }}>
            {items.map((item) => (
              <article key={item.id} className={`side-card ${item.status === "planned" ? "planned" : ""}`}>
                <div className="kicker">{item.status === "published" ? item.updated : "即将收录"}</div>
                <h3>{item.title}</h3>
                <p className="muted">{item.summary}</p>
                {item.status === "published" ? <Link to={`/c/${item.id}`}>进入 →</Link> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </GateWall>
  );
}
