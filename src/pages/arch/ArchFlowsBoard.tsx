import { useMemo, useState } from "react";
import data from "../../../data/collections/xmkf-rpa-response-delay/flows.json";

export default function ArchFlowsBoard() {
  const [groupId, setGroupId] = useState("all");
  const groups = data.groups;
  const shown = useMemo(
    () => (groupId === "all" ? groups : groups.filter((g) => g.id === groupId)),
    [groupId, groups],
  );

  return (
    <div>
      <nav className="ga-rail" aria-label="流程分组">
        <button type="button" className={groupId === "all" ? "on" : ""} onClick={() => setGroupId("all")}>
          全部<em>{groups.length}</em>
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={groupId === g.id ? "on" : ""}
            onClick={() => setGroupId(g.id)}
          >
            {g.title}
            <em>{g.steps.length}</em>
          </button>
        ))}
      </nav>

      {shown.map((g) => (
        <section key={g.id} className="ga-cluster">
          <header>
            <h3>{g.title}</h3>
            <span>{g.steps.length} 步</span>
          </header>
          {g.note ? <p className="muted">{g.note}</p> : null}
          <div className="ga-wrap">
            <table className="ga-ledger">
              <thead>
                <tr>
                  <th>时机</th>
                  <th>动作</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {g.steps.map((step) => (
                  <tr key={`${g.id}-${step.when}`}>
                    <td>
                      <code>{step.when}</code>
                    </td>
                    <td>{step.action}</td>
                    <td>{step.note}</td>
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
