import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import catalog from "../../data/catalog.json";
import EmailCodeGate from "./EmailCodeGate";
import { gateConfig, needsGate, type GateSection } from "../lib/gates";

export default function SectionNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pending, setPending] = useState<GateSection | null>(null);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(location.pathname === "/search");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const composingRef = useRef(false);
  const qFromUrl = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState(qFromUrl);

  const sections = gateConfig.sections.filter((item) => item.id !== "search");
  const search = gateConfig.sections.find((item) => item.id === "search");

  useEffect(() => {
    if (location.pathname === "/search") setSearchOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!composingRef.current) setDraft(qFromUrl);
  }, [qFromUrl]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const open = (section: GateSection) => {
    setMenu(false);
    if (needsGate(section)) {
      setPending(section);
      return;
    }
    navigate(section.href);
  };

  const goSearch = (nextQ = draft) => {
    const href = nextQ ? `/search?q=${encodeURIComponent(nextQ)}` : "/search";
    navigate(href);
  };

  const openSearch = () => {
    setMenu(false);
    setSearchOpen(true);
    if (location.pathname !== "/search") goSearch(draft);
  };

  const collapseSearch = () => {
    setSearchOpen(false);
  };

  const commitQuery = (value: string) => {
    if (location.pathname === "/search") {
      setSearchParams(value ? { q: value } : {});
      return;
    }
    goSearch(value);
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
        <div
          ref={wrapRef}
          className={`search-expand ${searchOpen ? "is-open" : ""}`}
          onBlur={(e) => {
            if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) {
              collapseSearch();
            }
          }}
        >
          <button
            type="button"
            className="icon-round"
            aria-label={searchOpen ? "收起搜索" : "搜索"}
            aria-expanded={searchOpen}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (searchOpen ? collapseSearch() : openSearch())}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.4 10.4L13.2 13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <input
            ref={inputRef}
            className="search-expand__input"
            value={draft}
            onChange={(e) => {
              const value = e.target.value;
              setDraft(value);
              if (!composingRef.current) commitQuery(value);
            }}
            onCompositionStart={() => {
              composingRef.current = true;
            }}
            onCompositionEnd={(e) => {
              composingRef.current = false;
              const value = e.currentTarget.value;
              setDraft(value);
              commitQuery(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                collapseSearch();
                inputRef.current?.blur();
              }
            }}
            placeholder="搜索全部文档…"
            aria-label="搜索全部文档"
          />
        </div>
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
