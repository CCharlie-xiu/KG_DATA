import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import meta from "../../data/collections/safrica-funzone-ga/meta.json";
import eventsData from "../../data/collections/safrica-funzone-ga/events.json";
import paramsData from "../../data/collections/safrica-funzone-ga/params.json";
import userData from "../../data/collections/safrica-funzone-ga/user-properties.json";
import funnelsData from "../../data/collections/safrica-funzone-ga/funnels.json";
import { lookLabel } from "../lib/look";
import type { GaGroup } from "../lib/types";

type Tab = "events" | "params" | "user" | "funnels";

export default function GaCatalog() {
  const [tab, setTab] = useState<Tab>("events");
  const groups = eventsData.groups as GaGroup[];
  const maxCount = Math.max(...groups.map((g) => g.events.length));

  return (
    <article>
      <Link className="back" to="/">
        ← 返回目录
      </Link>
      <div className="kicker">{meta.market} · {meta.currency} · {meta.property}</div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1 }}>
        {meta.title}
      </h1>
      <p className="muted">{eventsData.summary}</p>

      <div className="stats">
        <div className="stat">
          <b>{meta.stats.events}</b>
          <span>事件（含官方双报）</span>
        </div>
        <div className="stat">
          <b>{meta.stats.frontendUserProps}</b>
          <span>前端用户属性</span>
        </div>
        <div className="stat">
          <b>{meta.stats.funnels}</b>
          <span>可用漏斗</span>
        </div>
        <div className="stat">
          <b>{meta.stats.backendUserProps}</b>
          <span>交给后端</span>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "events" ? "on" : ""}`} onClick={() => setTab("events")}>
          关键事件
        </button>
        <button className={`tab ${tab === "params" ? "on" : ""}`} onClick={() => setTab("params")}>
          事件属性
        </button>
        <button className={`tab ${tab === "user" ? "on" : ""}`} onClick={() => setTab("user")}>
          用户属性
        </button>
        <button className={`tab ${tab === "funnels" ? "on" : ""}`} onClick={() => setTab("funnels")}>
          可用漏斗
        </button>
      </div>

      {tab === "events" ? <EventsPanel groups={groups} maxCount={maxCount} /> : null}
      {tab === "params" ? <ParamsPanel /> : null}
      {tab === "user" ? <UserPanel /> : null}
      {tab === "funnels" ? <FunnelsPanel /> : null}
    </article>
  );
}

function EventsPanel({ groups, maxCount }: { groups: GaGroup[]; maxCount: number }) {
  const [cat, setCat] = useState("all");
  const shown = useMemo(() => (cat === "all" ? groups : groups.filter((g) => g.id === cat)), [cat, groups]);

  return (
    <>
      <div className="bars">
        {groups.map((g) => (
          <div key={g.id} className="bar-col">
            <div className="bar-track">
              <div className="bar-fill" style={{ height: `${Math.round((g.events.length / maxCount) * 100)}%` }} />
            </div>
            <span>
              {g.title} {g.events.length}
            </span>
          </div>
        ))}
      </div>

      <div className="filter-row">
        <div className="chips">
          {eventsData.lookLegend.map((item) => (
            <span key={item.id} className={`look look-${item.id}`}>
              {item.label}
            </span>
          ))}
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">全部分组</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      {shown.map((g) => (
        <section key={g.id} className="group">
          <h3>
            {g.title} · {g.events.length}
          </h3>
          {g.note ? <p className="muted">{g.note}</p> : null}
          <EventTable rows={g.events} />
        </section>
      ))}
    </>
  );
}

function EventTable({ rows }: { rows: GaGroup["events"] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>事件名</th>
            <th>中文</th>
            <th>建议看</th>
            <th>何时上报</th>
            <th>本事件额外属性</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
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
  );
}

function ParamsPanel() {
  return (
    <>
      <h2>{paramsData.title}</h2>
      <p className="muted">{paramsData.summary}</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>参数名</th>
              <th>含义</th>
              <th>取值</th>
            </tr>
          </thead>
          <tbody>
            {paramsData.fields.map((f) => (
              <tr key={f.name}>
                <td>
                  <code>{f.name}</code>
                </td>
                <td>{f.meaning}</td>
                <td>{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="callout">{paramsData.doNotSendAsEventParam[0]}</div>
    </>
  );
}

function UserPanel() {
  return (
    <>
      <h2>{userData.title}</h2>
      <p className="muted">{userData.summary}</p>
      <p>
        官方 User-ID：<code>{userData.userId.name}</code> {userData.userId.rule}
      </p>
      <p className="muted">{userData.sameNameTwice}</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>分类</th>
              <th>显示名</th>
              <th>属性名</th>
              <th>例</th>
              <th>来源</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {userData.items.map((row) => (
              <tr key={row.name}>
                <td>{row.category}</td>
                <td>{row.label}</td>
                <td>
                  <code>{row.name}</code>
                </td>
                <td>{row.example}</td>
                <td>{row.source === "frontend" ? <span className="look look-ok">上报</span> : "不接"}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>南非多加</h3>
      <div className="table-wrap">
        <table>
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
    </>
  );
}

function FunnelsPanel() {
  return (
    <>
      <h2>{funnelsData.title}</h2>
      <p className="muted">{funnelsData.summary}</p>
      <div className="funnel-grid">
        {funnelsData.featured.map((f) => (
          <article key={f.id} className="funnel">
            <div className="kicker">{f.purpose}</div>
            <h3 style={{ marginTop: 6 }}>{f.title}</h3>
            <div className="steps">
              {f.steps.map((step, i) => (
                <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span className="step-n">{i + 1}</span>
                  <code>{step}</code>
                  {i < f.steps.length - 1 ? <span className="muted">→</span> : null}
                </span>
              ))}
            </div>
            <p className="muted">{f.ask}</p>
          </article>
        ))}
      </div>
      <h3>其余六条</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>漏斗</th>
              <th>步骤</th>
              <th>回答什么</th>
            </tr>
          </thead>
          <tbody>
            {funnelsData.rest.map((f) => (
              <tr key={f.id}>
                <td>{f.title}</td>
                <td>{f.steps}</td>
                <td>{f.ask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="callout">{funnelsData.warning}</div>
    </>
  );
}
