import { NavLink, Route, Routes } from "react-router-dom";
import catalog from "../data/catalog.json";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import About from "./pages/About";
import CollectionPage from "./pages/CollectionPage";

export default function App() {
  return (
    <div className="app">
      <header className="masthead">
        <div className="shell">
          <div className="masthead-top">
            <div>
              <div className="brand-kicker">{catalog.site.fullName}</div>
              <div className="brand">{catalog.site.name}</div>
            </div>
            <nav className="nav">
              {catalog.nav.map((item) => (
                <NavLink key={item.id} to={item.href} end={item.href === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="issue-line">
            <span>{catalog.site.tagline}</span>
            <span>Vol. 01 · 2026-08-31</span>
          </div>
        </div>
      </header>

      <main className="shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/about" element={<About />} />
          <Route path="/c/:id" element={<CollectionPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="shell" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", width: "100%" }}>
          <span>数据源在仓库 data/ 目录，不走远程库。</span>
          <span>GitHub Pages · Hash 路由</span>
        </div>
      </footer>
    </div>
  );
}
