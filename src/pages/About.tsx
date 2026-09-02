import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="article">
      <Link className="back" to="/">
        返回目录 →
      </Link>
      <h1>约定</h1>
      <p>KG_DATA 是静态知识库。首页是目录，点进去看某一份方案。所有数据都在仓库里，不接后端。</p>

      <div className="article-body">
        <section className="article-section">
          <h2>双轴分类</h2>
          <p>
            每条目录同时登记 <code>category</code>（领域）与 <code>section</code>（看板分区）。
          </p>
          <ul>
            <li>
              <strong>category</strong>：analytics（埋点/分析）、drama（短剧）、rpa、ops（运营）、other
            </li>
            <li>
              <strong>section</strong>：architecture（架构）、design（设计，公开）、breakthrough（核心突破）、ui-kit（UI库存）
            </li>
          </ul>
          <p className="muted">
            启发式：架构接入→architecture；产品/埋点方案→design；踩坑解法→breakthrough；可复用界面→ui-kit。
          </p>
        </section>

        <section className="article-section">
          <h2>新增内容</h2>
          <p>
            在 <code>data/collections/&lt;id&gt;/</code> 放 JSON（article 写 <code>meta.json</code> 的{" "}
            <code>body</code> 或 <code>sections[]</code>），再把条目登记进 <code>data/catalog.json</code>
            。字段约定见 <code>data/schema/collection.schema.json</code> 与根目录 <code>AGENTS.md</code>。
          </p>
          <p>
            <code>status: published</code> 才能从首页进详情；<code>planned</code> / <code>draft</code>{" "}
            只出现在对应 section。跨项目已验证方案由 Skill <code>kg-ingest</code> 按同一规范回填。
          </p>
        </section>

        <section className="article-section">
          <h2>本地与发布</h2>
          <p>
            发布用 GitHub Pages。路由是 Hash，本地 <code>npm run dev</code>，归档用{" "}
            <code>npm run archive</code>。
          </p>
        </section>
      </div>
    </section>
  );
}
