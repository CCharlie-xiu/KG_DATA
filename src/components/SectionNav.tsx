import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmailCodeGate from "./EmailCodeGate";
import { gateConfig, needsGate, type GateSection } from "../lib/gates";

export default function SectionNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState<GateSection | null>(null);

  const open = (section: GateSection) => {
    if (needsGate(section)) {
      setPending(section);
      return;
    }
    navigate(section.href);
  };

  return (
    <>
      <nav className="section-nav" aria-label="内容类别">
        {gateConfig.sections.map((section) => {
          const active = location.pathname === section.href;
          return (
            <button
              key={section.id}
              type="button"
              className={`section-link ${active ? "on" : ""} ${section.requireAuth ? "locked" : ""}`}
              onClick={() => open(section)}
            >
              {section.label}
            </button>
          );
        })}
      </nav>
      <EmailCodeGate
        open={Boolean(pending)}
        title={pending ? pending.label : ""}
        onClose={() => setPending(null)}
        onVerified={() => {
          const href = pending?.href;
          setPending(null);
          if (href) navigate(href);
        }}
      />
    </>
  );
}
