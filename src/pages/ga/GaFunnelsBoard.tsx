import funnelsData from "../../../data/collections/safrica-funzone-ga/funnels.json";

export default function GaFunnelsBoard() {
  return (
    <div>
      <p className="muted">{funnelsData.summary}</p>
      <div className="ga-funnel-list">
        {funnelsData.featured.map((f) => (
          <article key={f.id} className="ga-funnel">
            <div className="kicker">{f.purpose}</div>
            <h3>{f.title}</h3>
            <div className="ga-steps">
              {f.steps.map((step, i) => (
                <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <i>{i + 1}</i>
                  <code>{step}</code>
                  {i < f.steps.length - 1 ? <span className="muted">→</span> : null}
                </span>
              ))}
            </div>
            <p className="muted">{f.ask}</p>
          </article>
        ))}
      </div>

      <section className="ga-cluster" style={{ marginTop: 28 }}>
        <header>
          <h3>其余漏斗</h3>
          <span>{funnelsData.rest.length} 条</span>
        </header>
        <div className="ga-wrap">
          <table className="ga-ledger">
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
      </section>
      <div className="callout">{funnelsData.warning}</div>
    </div>
  );
}
