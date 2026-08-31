import { Link } from "react-router-dom";
import catalog from "../../data/catalog.json";

export default function Home() {
  const featured = catalog.collections.find((item) => item.featured && item.status === "published");
  const rest = catalog.collections.filter((item) => item.id !== featured?.id);

  return (
    <>
      <section className="hero">
        <h1>一份可以切换的知识目录。</h1>
        <p>{catalog.site.description}</p>
      </section>

      <section className="featured">
        {featured ? (
          <article className="feature-card">
            <div className="kicker">本期重点 · {featured.category}</div>
            <h2>{featured.title}</h2>
            <p className="muted">{featured.summary}</p>
            <div className="chips">
              {featured.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
            <Link className="btn" to={`/c/${featured.id}`}>
              查看埋点方案
            </Link>
          </article>
        ) : null}

        <div className="side-stack">
          {rest.map((item) => (
            <article key={item.id} className={`side-card ${item.status === "planned" ? "planned" : ""}`}>
              <div className="kicker">
                {item.status === "planned" ? "即将收录" : item.category}
              </div>
              <h3>{item.title}</h3>
              <p className="muted">{item.summary}</p>
              {item.status === "published" ? (
                <Link to={`/c/${item.id}`}>进入 →</Link>
              ) : (
                <span className="muted">目录已占位，数据待补</span>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
