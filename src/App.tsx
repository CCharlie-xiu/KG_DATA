import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import catalog from "../data/catalog.json";
import BrandBot from "./components/BrandBot";
import SectionNav from "./components/SectionNav";
import WebThreads from "./components/WebThreads";
import { useAppMotion } from "./hooks/useAppMotion";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import About from "./pages/About";
import CollectionPage from "./pages/CollectionPage";
import SectionPage from "./pages/SectionPage";
import SearchPage from "./pages/SearchPage";

function isBrowsePath(path: string) {
  return path === "/" || path === "/archive" || path === "/search" || path.startsWith("/s/");
}

export default function App() {
  const location = useLocation();
  const reading = !isBrowsePath(location.pathname);
  const root = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  useAppMotion(root);

  useEffect(() => {
    if (!reading) {
      setCompact(false);
      return;
    }

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setCompact(y > 56);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reading, location.pathname]);

  return (
    <div ref={root} className={reading ? "app app--read" : "app app--home"}>
      <div className="site-threads" aria-hidden="true">
        <WebThreads
          color1="#5227ff"
          color2="#ff9ffc"
          color3="#9d8cff"
          speed={0.2}
          threadCount={6}
          frequency={5}
          spread={0.18}
          taper={1}
          position={0.5}
          fanMode="center"
          glow={0.02}
          falloff={0.62}
          thickness={1.05}
          brightness={0.42}
          opacity={0.85}
          mirror={false}
          shimmer={false}
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
        />
      </div>
      <div className={reading ? "site-veil site-veil--read" : "site-veil site-veil--home"} aria-hidden="true" />

      <header className={`topbar${reading && compact ? " topbar--compact" : ""}`}>
        <div className="shell topbar-inner">
          <div className="brand">
            <Link className="logo" to="/">
              KG_DATA<span>.</span>
            </Link>
            <BrandBot />
          </div>
          <SectionNav />
        </div>
      </header>

      <main className="shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/s/:id" element={<SectionPage />} />
          <Route path="/c/:id" element={<CollectionPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="shell footer-inner">
          <span>{catalog.site.tagline}</span>
          <span>数据在仓库 data/ · Pages 静态发布</span>
        </div>
      </footer>
    </div>
  );
}
