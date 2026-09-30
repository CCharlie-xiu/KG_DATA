import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import delayMeta from "../../data/collections/xmkf-rpa-response-delay/meta.json";
import delayBoundaries from "../../data/collections/xmkf-rpa-response-delay/boundaries.json";
import delaySchema from "../../data/collections/xmkf-rpa-response-delay/schema.json";
import delayFlows from "../../data/collections/xmkf-rpa-response-delay/flows.json";
import delayImpl from "../../data/collections/xmkf-rpa-response-delay/implementation.json";

import hotColdMeta from "../../data/collections/xmkf-rpa-workflow-run-hot-cold-202609/meta.json";
import hotColdBoundaries from "../../data/collections/xmkf-rpa-workflow-run-hot-cold-202609/boundaries.json";
import hotColdSchema from "../../data/collections/xmkf-rpa-workflow-run-hot-cold-202609/schema.json";
import hotColdFlows from "../../data/collections/xmkf-rpa-workflow-run-hot-cold-202609/flows.json";
import hotColdImpl from "../../data/collections/xmkf-rpa-workflow-run-hot-cold-202609/implementation.json";

import mcdStackMeta from "../../data/collections/mcd-tech-stack-202609/meta.json";
import mcdStackBoundaries from "../../data/collections/mcd-tech-stack-202609/boundaries.json";
import mcdStackSchema from "../../data/collections/mcd-tech-stack-202609/schema.json";
import mcdStackFlows from "../../data/collections/mcd-tech-stack-202609/flows.json";
import mcdStackImpl from "../../data/collections/mcd-tech-stack-202609/implementation.json";

import mcdArchMeta from "../../data/collections/mcd-arch-native-capability-202609/meta.json";
import mcdArchBoundaries from "../../data/collections/mcd-arch-native-capability-202609/boundaries.json";
import mcdArchSchema from "../../data/collections/mcd-arch-native-capability-202609/schema.json";
import mcdArchFlows from "../../data/collections/mcd-arch-native-capability-202609/flows.json";
import mcdArchImpl from "../../data/collections/mcd-arch-native-capability-202609/implementation.json";

import iosMvMeta from "../../data/collections/xmkf-ios-swiftui-mv-202609/meta.json";
import iosMvBoundaries from "../../data/collections/xmkf-ios-swiftui-mv-202609/boundaries.json";
import iosMvSchema from "../../data/collections/xmkf-ios-swiftui-mv-202609/schema.json";
import iosMvFlows from "../../data/collections/xmkf-ios-swiftui-mv-202609/flows.json";
import iosMvImpl from "../../data/collections/xmkf-ios-swiftui-mv-202609/implementation.json";

import androidMeta from "../../data/collections/xmkf-android-compose-clean-202609/meta.json";
import androidBoundaries from "../../data/collections/xmkf-android-compose-clean-202609/boundaries.json";
import androidSchema from "../../data/collections/xmkf-android-compose-clean-202609/schema.json";
import androidFlows from "../../data/collections/xmkf-android-compose-clean-202609/flows.json";
import androidImpl from "../../data/collections/xmkf-android-compose-clean-202609/implementation.json";

import dualMeta from "../../data/collections/xmkf-mobile-dual-native-202609/meta.json";
import dualBoundaries from "../../data/collections/xmkf-mobile-dual-native-202609/boundaries.json";
import dualSchema from "../../data/collections/xmkf-mobile-dual-native-202609/schema.json";
import dualFlows from "../../data/collections/xmkf-mobile-dual-native-202609/flows.json";
import dualImpl from "../../data/collections/xmkf-mobile-dual-native-202609/implementation.json";

import ArchBoundariesBoard from "./arch/ArchBoundariesBoard";
import ArchSchemaBoard from "./arch/ArchSchemaBoard";
import ArchFlowsBoard from "./arch/ArchFlowsBoard";
import ArchImplBoard from "./arch/ArchImplBoard";
import "./ga/ga.css";
import "./arch/arch.css";

type Tab = "boundaries" | "schema" | "flows" | "impl";

type ArchSpecBundle = {
  meta: {
    kicker: string;
    title: string;
    summary: string;
    notes: string[];
    stats: { boundaries: number; newFields: number; modules: number; testCases: number };
    statLabels?: { boundaries?: string; newFields?: string; modules?: string; testCases?: string };
    tabs?: { id: Tab; label: string }[];
  };
  boundaries: React.ComponentProps<typeof ArchBoundariesBoard>["data"];
  schema: React.ComponentProps<typeof ArchSchemaBoard>["data"];
  flows: React.ComponentProps<typeof ArchFlowsBoard>["data"];
  impl: React.ComponentProps<typeof ArchImplBoard>["data"];
};

const DEFAULT_TABS: { id: Tab; label: string }[] = [
  { id: "boundaries", label: "边界" },
  { id: "schema", label: "数据模型" },
  { id: "flows", label: "执行流程" },
  { id: "impl", label: "实现清单" },
];

const SPECS: Record<string, ArchSpecBundle> = {
  "xmkf-rpa-response-delay": {
    meta: {
      ...delayMeta,
      tabs: [
        { id: "boundaries", label: "延迟边界" },
        { id: "schema", label: "数据模型" },
        { id: "flows", label: "执行流程" },
        { id: "impl", label: "实现清单" },
      ],
    },
    boundaries: delayBoundaries,
    schema: delaySchema,
    flows: delayFlows,
    impl: delayImpl,
  },
  "xmkf-rpa-workflow-run-hot-cold-202609": {
    meta: hotColdMeta as ArchSpecBundle["meta"],
    boundaries: hotColdBoundaries,
    schema: hotColdSchema,
    flows: hotColdFlows,
    impl: hotColdImpl,
  },
  "mcd-tech-stack-202609": {
    meta: mcdStackMeta as ArchSpecBundle["meta"],
    boundaries: mcdStackBoundaries,
    schema: mcdStackSchema,
    flows: mcdStackFlows,
    impl: mcdStackImpl,
  },
  "mcd-arch-native-capability-202609": {
    meta: mcdArchMeta as ArchSpecBundle["meta"],
    boundaries: mcdArchBoundaries,
    schema: mcdArchSchema,
    flows: mcdArchFlows,
    impl: mcdArchImpl,
  },
  "xmkf-ios-swiftui-mv-202609": {
    meta: iosMvMeta as ArchSpecBundle["meta"],
    boundaries: iosMvBoundaries,
    schema: iosMvSchema,
    flows: iosMvFlows,
    impl: iosMvImpl,
  },
  "xmkf-android-compose-clean-202609": {
    meta: androidMeta as ArchSpecBundle["meta"],
    boundaries: androidBoundaries as ArchSpecBundle["boundaries"],
    schema: androidSchema,
    flows: androidFlows,
    impl: androidImpl,
  },
  "xmkf-mobile-dual-native-202609": {
    meta: dualMeta as ArchSpecBundle["meta"],
    boundaries: dualBoundaries as ArchSpecBundle["boundaries"],
    schema: dualSchema,
    flows: dualFlows,
    impl: dualImpl,
  },
};

const STAT_KEYS = ["boundaries", "newFields", "modules", "testCases"] as const;
const DEFAULT_STAT_LABELS = { boundaries: "边界", newFields: "字段", modules: "模块", testCases: "用例" };

export default function ArchSpecCatalog() {
  const { id } = useParams();
  const bundle = id ? SPECS[id] : undefined;
  const [tab, setTab] = useState<Tab>("boundaries");

  if (!bundle) {
    return (
      <section className="article">
        <Link className="back" to="/">
          返回目录 →
        </Link>
        <h1>架构方案未接入</h1>
        <p className="muted">id={id} 尚未登记到 ArchSpecCatalog。SPECS。</p>
      </section>
    );
  }

  const { meta, boundaries, schema, flows, impl } = bundle;
  const tabs = meta.tabs?.length ? meta.tabs : DEFAULT_TABS;

  return (
    <article className="reading-sheet ga-page">
      <Link className="back" to="/">
        返回目录 →
      </Link>

      <header className="ga-mast">
        <div>
          <div className="kicker">{meta.kicker}</div>
          <h1 className="page-title">{meta.title}</h1>
          <p className="muted">{meta.summary}</p>
        </div>
        <div className="ga-figures">
          {STAT_KEYS.map((key) => (
            <div key={key}>
              <b>{meta.stats[key]}</b>
              <span>{meta.statLabels?.[key] ?? DEFAULT_STAT_LABELS[key]}</span>
            </div>
          ))}
        </div>
      </header>

      <ul className="ga-notes">
        {meta.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <nav className="ga-switch" aria-label="方案分册">
        {tabs.map((item) => (
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

      {tab === "boundaries" ? <ArchBoundariesBoard data={boundaries} /> : null}
      {tab === "schema" ? <ArchSchemaBoard data={schema} /> : null}
      {tab === "flows" ? <ArchFlowsBoard data={flows} /> : null}
      {tab === "impl" ? <ArchImplBoard data={impl} /> : null}
    </article>
  );
}
