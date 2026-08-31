import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import EmailCodeGate from "./EmailCodeGate";
import { needsGate, type GateSection } from "../lib/gates";

export default function GateWall({
  section,
  children,
}: {
  section: GateSection;
  children: ReactElement;
}) {
  const navigate = useNavigate();
  const [, bump] = useState(0);

  if (needsGate(section)) {
    return (
      <>
        <section className="article">
          <div className="kicker">受保护</div>
          <h1>{section.label}</h1>
          <p className="muted">这个类别需要邮箱验证后才能查看。</p>
        </section>
        <EmailCodeGate
          open
          title={section.label}
          onClose={() => navigate("/")}
          onVerified={() => bump((n) => n + 1)}
        />
      </>
    );
  }

  return children;
}
