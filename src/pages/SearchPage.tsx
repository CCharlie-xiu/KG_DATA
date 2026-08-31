import { useState } from "react";
import BoardScreen from "../components/BoardScreen";
import GateWall from "../components/GateWall";
import { getSection } from "../lib/gates";
import { searchTiles } from "../lib/tiles";

export default function SearchPage() {
  const section = getSection("search");
  const [q, setQ] = useState("");

  if (!section) return null;

  return (
    <GateWall section={section}>
      <BoardScreen
        title="搜索模式"
        action={
          <input
            className="search-input search-input--head"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜标题、标签、摘要…"
          />
        }
        items={searchTiles(q)}
      />
    </GateWall>
  );
}
