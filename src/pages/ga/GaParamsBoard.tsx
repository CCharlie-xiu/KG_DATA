import { useMemo } from "react";
import paramsData from "../../../data/collections/safrica-funzone-ga/params.json";

const GROUP_LABEL: Record<string, string> = {
  identity: "身份",
  asset: "资产",
  device: "设备",
  market: "市场",
  source: "来源",
  i18n: "展示名",
};

export default function GaParamsBoard() {
  const clusters = useMemo(() => {
    const map = new Map<string, typeof paramsData.fields>();
    for (const field of paramsData.fields) {
      const key = field.group ?? "other";
      const list = map.get(key) ?? [];
      list.push(field);
      map.set(key, list);
    }
    return [...map.entries()];
  }, []);

  return (
    <div className="ga-param-grid">
      <p className="muted">{paramsData.summary}</p>
      {clusters.map(([id, fields]) => (
        <section key={id} className="ga-cluster">
          <header>
            <h3>{GROUP_LABEL[id] ?? id}</h3>
            <span>{fields.length} 项</span>
          </header>
          <div className="ga-wrap">
            <table className="ga-ledger">
              <thead>
                <tr>
                  <th>参数名</th>
                  <th>含义</th>
                  <th>取值</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f) => (
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
        </section>
      ))}
      <div className="callout">{paramsData.doNotSendAsEventParam[0]}</div>
    </div>
  );
}
