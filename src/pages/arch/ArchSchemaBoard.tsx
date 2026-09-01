import data from "../../../data/collections/xmkf-rpa-response-delay/schema.json";

export default function ArchSchemaBoard() {
  return (
    <div>
      <section className="ga-cluster">
        <header>
          <h3>Workflow 字段</h3>
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
          <h3>WorkflowRun 字段</h3>
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
          <h3>配置示例</h3>
        </header>
        <pre className="arch-code-block">{JSON.stringify(data.configExample, null, 2)}</pre>
        <p className="muted" style={{ marginTop: 12 }}>
          REST 覆盖字段 <code>{data.requestOverride.field}</code>：{data.requestOverride.rules.join("；")}
        </p>
      </section>
    </div>
  );
}
