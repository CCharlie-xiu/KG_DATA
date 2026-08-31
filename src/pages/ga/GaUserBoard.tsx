import { useMemo } from "react";
import userData from "../../../data/collections/safrica-funzone-ga/user-properties.json";

export default function GaUserBoard() {
  const clusters = useMemo(() => {
    const map = new Map<string, typeof userData.items>();
    for (const row of userData.items) {
      const list = map.get(row.category) ?? [];
      list.push(row);
      map.set(row.category, list);
    }
    return [...map.entries()];
  }, []);

  return (
    <div>
      <p className="muted">{userData.summary}</p>
      <p>
        官方 User-ID：<code>{userData.userId.name}</code> {userData.userId.rule}
      </p>
      <p className="muted">{userData.sameNameTwice}</p>

      {clusters.map(([category, rows]) => (
        <section key={category} className="ga-cluster">
          <header>
            <h3>{category}</h3>
            <span>{rows.length} 项</span>
          </header>
          <div className="ga-wrap">
            <table className="ga-ledger">
              <thead>
                <tr>
                  <th>显示名</th>
                  <th>属性名</th>
                  <th>例</th>
                  <th>来源</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.label}</td>
                    <td>
                      <code>{row.name}</code>
                    </td>
                    <td>{row.example}</td>
                    <td>{row.source === "frontend" ? <span className="look look-ok">上报</span> : "后端"}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="ga-cluster">
        <header>
          <h3>南非多加</h3>
          <span>{userData.zaExtra.length} 项</span>
        </header>
        <div className="ga-wrap">
          <table className="ga-ledger">
            <thead>
              <tr>
                <th>属性名</th>
                <th>取值</th>
                <th>为什么多</th>
              </tr>
            </thead>
            <tbody>
              {userData.zaExtra.map((row) => (
                <tr key={row.name}>
                  <td>
                    <code>{row.name}</code>
                  </td>
                  <td>{row.value}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
