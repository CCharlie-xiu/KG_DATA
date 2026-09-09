import { useMemo, useState } from "react";

export type BoundariesData = {
  lookLegend: { id: string; label: string }[];
  groups: {
    id: string;
    title: string;
    note?: string;
    rows: {
      channel: string;
      afterComplete: string;
      afterDue: string;
      timing: string;
    }[];
  }[];
};

type Props = { data: BoundariesData };

export default function ArchBoundariesBoard({ data }: Props) {
  const [groupId, setGroupId] = useState("all");
  const groups = data.groups;
  const legendMap = useMemo(
    () => Object.fromEntries(data.lookLegend.map((item) => [item.id, item.label])),
    [data.lookLegend],
  );
  const shown = useMemo(
    () => (groupId === "all" ? groups : groups.filter((g) => g.id === groupId)),
    [groupId, groups],
  );
  const total = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div>
      <nav className="ga-rail" aria-label="边界分组">
        <button type="button" className={groupId === "all" ? "on" : ""} onClick={() => setGroupId("all")}>
          全部<em>{total}</em>
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={groupId === g.id ? "on" : ""}
            onClick={() => setGroupId(g.id)}
          >
            {g.title}
            <em>{g.rows.length}</em>
          </button>
        ))}
      </nav>

      <div className="ga-looks">
        <span className="hint">图例</span>
        {data.lookLegend.map((item) => (
          <span key={item.id} className={`look look-${item.id}`}>
            {item.label}
          </span>
        ))}
      </div>

      {shown.map((g) => (
        <section key={g.id} className="ga-cluster">
          <header>
            <h3>{g.title}</h3>
            <span>{g.rows.length} 条</span>
          </header>
          {g.note ? <p className="muted">{g.note}</p> : null}
          <div className="ga-wrap">
            <table className="ga-ledger">
              <thead>
                <tr>
                  <th>通道</th>
                  <th>完成后</th>
                  <th>到期后</th>
                  <th>时序</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((row) => (
                  <tr key={row.channel} className={`look-${row.timing}`}>
                    <td>
                      <code>{row.channel}</code>
                    </td>
                    <td>{row.afterComplete}</td>
                    <td>{row.afterDue}</td>
                    <td>
                      <span className={`look look-${row.timing}`}>
                        {legendMap[row.timing] ?? row.timing}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
