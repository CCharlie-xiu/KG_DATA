import { useState } from "react";
import { Link } from "react-router-dom";
import meta from "../../data/collections/safrica-funzone-ga/meta.json";
import eventsData from "../../data/collections/safrica-funzone-ga/events.json";
import type { GaGroup } from "../lib/types";
import GaEventsBoard from "./ga/GaEventsBoard";
import GaFunnelsBoard from "./ga/GaFunnelsBoard";
import GaParamsBoard from "./ga/GaParamsBoard";
import GaUserBoard from "./ga/GaUserBoard";
import "./ga/ga.css";

type Tab = "events" | "params" | "user" | "funnels";

const TABS: { id: Tab; label: string }[] = [
  { id: "events", label: "关键事件" },
  { id: "params", label: "事件属性" },
  { id: "user", label: "用户属性" },
  { id: "funnels", label: "可用漏斗" },
];

export default function GaCatalog() {
  const [tab, setTab] = useState<Tab>("events");
  const groups = eventsData.groups as GaGroup[];

  return (
    <article className="reading-sheet ga-page">
      <Link className="back" to="/">
        返回目录 →
      </Link>

      <header className="ga-mast">
        <div>
          <div className="kicker">
            {meta.market} · {meta.currency} · {meta.property}
          </div>
          <h1 className="page-title">{meta.title}</h1>
          <p className="muted">{eventsData.summary}</p>
        </div>
        <div className="ga-figures">
          <div>
            <b>{meta.stats.events}</b>
            <span>事件</span>
          </div>
          <div>
            <b>{meta.stats.frontendUserProps}</b>
            <span>前端属性</span>
          </div>
          <div>
            <b>{meta.stats.funnels}</b>
            <span>漏斗</span>
          </div>
          <div>
            <b>{meta.stats.backendUserProps}</b>
            <span>后端属性</span>
          </div>
        </div>
      </header>

      <ul className="ga-notes">
        {meta.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <nav className="ga-switch" aria-label="方案分册">
        {TABS.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? "on" : ""} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "events" ? <GaEventsBoard groups={groups} /> : null}
      {tab === "params" ? <GaParamsBoard /> : null}
      {tab === "user" ? <GaUserBoard /> : null}
      {tab === "funnels" ? <GaFunnelsBoard /> : null}
    </article>
  );
}
