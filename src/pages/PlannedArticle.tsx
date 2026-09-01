import { Link } from "react-router-dom";
import type { ArticleMeta, CatalogItem } from "../lib/types";
import { loadArticleMeta } from "../lib/articles";
import { renderLightMarkdown } from "../lib/lightMarkdown";

type Props = {
  item: CatalogItem;
};

export default function PlannedArticle({ item }: Props) {
  const meta = loadArticleMeta(item.id);
  const title = meta?.title || item.title;
  const isPlanned = item.status !== "published";

  return (
    <section className="article">
      <Link className="back" to="/">
        ← 返回目录
      </Link>
      {isPlanned ? <div className="kicker">即将收录</div> : null}
      {meta?.sourceProject ? <div className="kicker muted">来源 · {meta.sourceProject}</div> : null}
      <h1>{title}</h1>
      {!hasArticleBody(meta) ? <p>{item.summary}</p> : null}
      {meta ? <ArticleBody meta={meta} /> : null}
      {isPlanned && !hasArticleBody(meta) ? (
        <p className="muted">按 data/schema 补 JSON 后，把 catalog 里的 status 改为 published 即可在首页打开。</p>
      ) : null}
    </section>
  );
}

function hasArticleBody(meta: ArticleMeta | null): boolean {
  if (!meta) return false;
  if (meta.body && meta.body.trim()) return true;
  return Boolean(meta.sections?.some((s) => s.body?.trim() || s.heading?.trim()));
}

function ArticleBody({ meta }: { meta: ArticleMeta }) {
  if (meta.sections?.length) {
    return (
      <div className="article-body">
        {meta.notes?.length ? (
          <ul className="article-notes">
            {meta.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
        {meta.sections.map((section, i) => (
          <section key={`${section.heading ?? "s"}-${i}`} className="article-section">
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.body ? renderLightMarkdown(section.body) : null}
          </section>
        ))}
      </div>
    );
  }

  if (meta.body?.trim()) {
    return (
      <div className="article-body">
        {meta.notes?.length ? (
          <ul className="article-notes">
            {meta.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
        {renderLightMarkdown(meta.body)}
      </div>
    );
  }

  return null;
}
