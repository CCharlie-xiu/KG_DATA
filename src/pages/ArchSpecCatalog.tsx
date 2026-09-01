import { useState } from "react";
import { Link } from "react-router-dom";
import meta from "../../data/collections/xmkf-rpa-response-delay/meta.json";
import ArchBoundariesBoard from "./arch/ArchBoundariesBoard";
import ArchSchemaBoard from "./arch/ArchSchemaBoard";
import ArchFlowsBoard from "./arch/ArchFlowsBoard";
import ArchImplBoard from "./arch/ArchImplBoard";
import "./ga/ga.css";
import "./arch/arch.css";

type Tab = "boundaries" | "schema" | "flows" | "impl";

const TABS: { id: Tab; label: string }[] = [
  { id: "boundaries", label: "延迟边界" },
  { id: "schema", label: "数据模型" },
  { id: "flows", label: "执行流程" },
  { id: "impl", label: "实现清单" },
];

export default function ArchSpecCatalog() {
  const [tab, setTab] = useState<Tab>("boundaries");

  return (
    <article className="reading-sheet ga-page">
      <Link className="back" to="/">
        ← 返回目录
      </Link>

      <header className="ga-mast">
        <div>
          <div className="kicker">{meta.kicker}</div>
          <h1 className="page-title">{meta.title}</h1>
          <p className="muted">{meta.summary}</p>
        </div>
        <div className="ga-figures">
          <div>
            <b>{meta.stats.boundaries}</b>
            <span>边界</span>
          </div>
          <div>
            <b>{meta.stats.newFields}</b>
            <span>字段</span>
          </div>
          <div>
            <b>{meta.stats.modules}</b>
            <span>模块</span>
          </div>
          <div>
            <b>{meta.stats.testCases}</b>
            <span>用例</span>
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
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "on" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "boundaries" ? <ArchBoundariesBoard /> : null}
      {tab === "schema" ? <ArchSchemaBoard /> : null}
      {tab === "flows" ? <ArchFlowsBoard /> : null}
      {tab === "impl" ? <ArchImplBoard /> : null}
    </article>
  );
}
