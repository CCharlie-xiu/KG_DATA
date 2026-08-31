import { Link } from "react-router-dom";

export default function PlannedArticle({ title, summary }: { title: string; summary: string }) {
  return (
    <section className="article">
      <Link className="back" to="/">
        ← 返回目录
      </Link>
      <div className="kicker">即将收录</div>
      <h1>{title}</h1>
      <p>{summary}</p>
      <p className="muted">按 data/schema 补 JSON 后，把 catalog 里的 status 改为 published 即可在首页打开。</p>
    </section>
  );
}
