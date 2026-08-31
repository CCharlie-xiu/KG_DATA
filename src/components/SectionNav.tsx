import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import catalog from "../../data/catalog.json";
import EmailCodeGate from "./EmailCodeGate";
import { gateConfig, needsGate, type GateSection } from "../lib/gates";

export default function SectionNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState<GateSection | null>(null);
  const [menu, setMenu] = useState(false);

  const sections = gateConfig.sections.filter((item) => item.id !== "search");
  const search = gateConfig.sections.find((item) => item.id === "search");

  const open = (section: GateSection) => {
    setMenu(false);
    if (needsGate(section)) {
      setPending(section);
      return;
    }
    navigate(section.href);
  };

  const countOf = (id: string) => catalog.collections.filter((item) => item.section === id).length;

  return (
    <div className="topbar-right">
      <nav className="spot-nav" aria-label="内容类别">
        {sections.map((section) => {
          const n = countOf(section.id);
          return (
            <button
              key={section.id}
              type="button"
              className={`spot-link ${location.pathname === section.href ? "on" : ""}`}
              onClick={() => open(section)}
            >
              {section.label}
              <sup>{n}</sup>
            </button>
          );
        })}
      </nav>

      {search ? (
        <button type="button" className="icon-round" aria-label="搜索模式" onClick={() => open(search)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.4 10.4L13.2 13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}

      <div className="menu-wrap">
        <button type="button" className="menu-pill" onClick={() => setMenu((v) => !v)}>
          Menu
        </button>
        {menu ? (
          <div className="menu-pop">
            {catalog.nav.map((item) => (
              <Link key={item.id} to={item.href} onClick={() => setMenu(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

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
    </div>
  );
}
