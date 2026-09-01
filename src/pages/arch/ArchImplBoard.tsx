import { useMemo, useState } from "react";
import data from "../../../data/collections/xmkf-rpa-response-delay/implementation.json";

export default function ArchImplBoard() {
  const [area, setArea] = useState("all");
  const areas = useMemo(() => [...new Set(data.modules.map((m) => m.area))], []);
  const shown = useMemo(
    () => (area === "all" ? data.modules : data.modules.filter((m) => m.area === area)),
    [area],
  );

  return (
    <div>
      <nav className="ga-rail" aria-label="实现分区">
        <button type="button" className={area === "all" ? "on" : ""} onClick={() => setArea("all")}>
          全部<em>{data.modules.length}</em>
        </button>
        {areas.map((id) => (
          <button
            key={id}
            type="button"
            className={area === id ? "on" : ""}
            onClick={() => setArea(id)}
          >
            {id}
            <em>{data.modules.filter((m) => m.area === id).length}</em>
          </button>
        ))}
      </nav>

      <section className="ga-cluster">
        <header>
          <h3>改动面</h3>
          <span>{shown.length} 项</span>
        </header>
        <div className="ga-wrap">
          <table className="ga-ledger">
            <thead>
              <tr>
                <th>区域</th>
                <th>路径</th>
                <th>变更</th>
                <th>类型</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={`${row.area}-${row.path}`}>
                  <td>{row.area}</td>
                  <td>
                    <code>{row.path}</code>
                  </td>
                  <td>{row.change}</td>
                  <td>
                    <span className={`look look-${row.type === "new" ? "realtime" : "delayed"}`}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
