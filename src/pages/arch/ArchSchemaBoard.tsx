export type SchemaData = {
  workflowFields: { name: string; type: string; model: string; desc: string }[];
  runFields: { name: string; type: string; model: string; desc: string }[];
  configExample: unknown;
  requestOverride?: { field: string; rules: string[] };
  sectionTitles?: { workflow?: string; run?: string; config?: string };
};

type Props = { data: SchemaData };

export default function ArchSchemaBoard({ data }: Props) {
  const titles = {
    workflow: data.sectionTitles?.workflow ?? "Workflow 字段",
    run: data.sectionTitles?.run ?? "WorkflowRun 字段",
    config: data.sectionTitles?.config ?? "配置示例",
  };

  return (
    <div>
      <section className="ga-cluster">
        <header>
          <h3>{titles.workflow}</h3>
          <span>{data.workflowFields.length} 条</span>
        </header>
        <div className="ga-wrap">
          <table className="ga-ledger">
            <thead>
              <tr>
                <th>字段</th>
                <th>类型</th>
                <th>模型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {data.workflowFields.map((row) => (
                <tr key={row.name}>
                  <td>
                    <code>{row.name}</code>
                  </td>
                  <td>{row.type}</td>
                  <td>{row.model}</td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ga-cluster">
        <header>
          <h3>{titles.run}</h3>
          <span>{data.runFields.length} 条</span>
        </header>
        <div className="ga-wrap">
          <table className="ga-ledger">
            <thead>
              <tr>
                <th>字段</th>
                <th>类型</th>
                <th>模型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {data.runFields.map((row) => (
                <tr key={row.name}>
                  <td>
                    <code>{row.name}</code>
                  </td>
                  <td>{row.type}</td>
                  <td>{row.model}</td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ga-cluster">
        <header>
          <h3>{titles.config}</h3>
        </header>
        <pre className="arch-code-block">{JSON.stringify(data.configExample, null, 2)}</pre>
        {data.requestOverride ? (
          <p className="muted" style={{ marginTop: 12 }}>
            <code>{data.requestOverride.field}</code>：{data.requestOverride.rules.join("；")}
          </p>
        ) : null}
      </section>
    </div>
  );
}
