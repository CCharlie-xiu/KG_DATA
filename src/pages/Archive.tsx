import { Link } from "react-router-dom";
import catalog from "../../data/catalog.json";

export default function Archive() {
  return (
    <section className="article">
      <h1>归档</h1>
      <p className="muted">按目录列出全部条目。新增内容只改 data/catalog.json 与对应 collections 目录。</p>
      <div className="table-wrap" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr>
              <th>条目</th>
              <th>分类</th>
              <th>状态</th>
              <th>更新</th>
            </tr>
          </thead>
          <tbody>
            {catalog.collections.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.status === "published" ? <Link to={`/c/${item.id}`}>{item.title}</Link> : item.title}
                </td>
                <td>{item.category}</td>
                <td>{item.status}</td>
                <td>{item.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
