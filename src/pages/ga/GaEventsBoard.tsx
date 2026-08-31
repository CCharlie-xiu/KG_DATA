import { useMemo, useState } from "react";
import eventsData from "../../../data/collections/safrica-funzone-ga/events.json";
import { lookLabel } from "../../lib/look";
import type { GaGroup } from "../../lib/types";

export default function GaEventsBoard({ groups }: { groups: GaGroup[] }) {
  const [groupId, setGroupId] = useState("all");
  const [looks, setLooks] = useState<string[]>([]);

  const shown = useMemo(() => {
    const base = groupId === "all" ? groups : groups.filter((g) => g.id === groupId);
    return base
      .map((g) => ({
        ...g,
        events: looks.length ? g.events.filter((e) => looks.includes(e.look)) : g.events,
      }))
      .filter((g) => g.events.length);
  }, [groupId, looks, groups]);

  const total = groups.reduce((n, g) => n + g.events.length, 0);

  const toggleLook = (id: string) => {
    setLooks((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  return (
    <div>
      <nav className="ga-rail" aria-label="事件分组">
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
            <em>{g.events.length}</em>
          </button>
        ))}
      </nav>

      <div className="ga-looks">
        <span className="hint">建议看</span>
        {eventsData.lookLegend.map((item) => (
          <button
            key={item.id}
            type="button"
            className={looks.length === 0 || looks.includes(item.id) ? "on" : ""}
            onClick={() => toggleLook(item.id)}
          >
            <span className={`look look-${item.id}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? <p className="ga-empty">这个筛选下没有事件。</p> : null}

      {shown.map((g) => (
        <section key={g.id} className="ga-cluster">
          <header>
            <h3>{g.title}</h3>
            <span>{g.events.length} 条</span>
          </header>
          {g.note ? <p className="muted">{g.note}</p> : null}
          <div className="ga-wrap">
            <table className="ga-ledger">
              <thead>
                <tr>
                  <th>事件名</th>
                  <th>中文</th>
                  <th>建议看</th>
                  <th>何时上报</th>
                  <th>额外属性</th>
                </tr>
              </thead>
              <tbody>
                {g.events.map((row) => (
                  <tr key={row.name} className={`look-${row.look}`}>
                    <td>
                      <code>{row.name}</code>
                    </td>
                    <td>{row.label}</td>
                    <td>
                      <span className={`look look-${row.look}`}>{lookLabel(row.look)}</span>
                    </td>
                    <td>{row.when}</td>
                    <td>
                      <code>{row.extra}</code>
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
