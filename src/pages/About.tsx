export default function About() {
  return (
    <section className="article">
      <h1>体例</h1>
      <p>KG_DATA 是静态知识库。首页是目录，点进去看某一份方案。所有数据都在仓库里，不接后端。</p>
      <p>
        新增一类内容（短剧、RPA、运营手册）：在 <code>data/collections/&lt;id&gt;/</code> 放 JSON，再把条目登记进{" "}
        <code>data/catalog.json</code>。字段约定见 <code>data/schema/collection.schema.json</code>。
      </p>
      <p>
        发布用 GitHub Pages。路由是 Hash，本地 <code>npm run dev</code>，归档用 <code>npm run archive</code>。
      </p>
    </section>
  );
}
