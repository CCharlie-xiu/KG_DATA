import { Navigate, useNavigate, useParams } from "react-router-dom";
import catalog from "../../data/catalog.json";
import CardSwap, { Card } from "../components/CardSwap";
import GateWall from "../components/GateWall";
import { getSection } from "../lib/gates";

export default function SectionPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const section = getSection(id);

  if (!section || section.id === "search") {
    return <Navigate to="/" replace />;
  }

  const mine = catalog.collections.filter((item) => item.section === section.id);
  const extras = catalog.collections.filter((item) => item.section !== section.id);
  const stack = mine.length === 0 ? [] : mine.length >= 3 ? mine : [...mine, ...extras].slice(0, 3);

  return (
    <GateWall section={section}>
      <section className="article section-page section-page--swap">
        <div className="section-copy">
          <div className="kicker">{section.requireAuth ? "已验证" : "公开"}</div>
          <h1>{section.label}</h1>
          <p className="muted">{section.summary}</p>
          {mine.length === 0 ? (
            <p className="muted">这个类别还没有条目。在 catalog.json 把 collection 的 section 设为 {section.id} 即可出现。</p>
          ) : null}
        </div>

        {stack.length > 0 ? (
          <div className="section-swap">
            <CardSwap
              pauseOnHover
              onCardClick={(idx) => {
                const item = stack[idx];
                if (item?.status === "published") navigate(`/c/${item.id}`);
              }}
            >
              {stack.map((item) => (
                <Card key={item.id} className="kg-swap-card">
                  <div>
                    <div className="kg-swap-kicker">
                      {item.status === "published" ? item.updated : "即将收录"} · {item.section ?? item.category}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <span className="kg-swap-go">{item.status === "published" ? "进入 →" : "待收录"}</span>
                </Card>
              ))}
            </CardSwap>
          </div>
        ) : null}
      </section>
    </GateWall>
  );
}
