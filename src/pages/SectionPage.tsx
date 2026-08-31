import { Link, Navigate, useParams } from "react-router-dom";
import BoardScreen from "../components/BoardScreen";
import GateWall from "../components/GateWall";
import { getSection } from "../lib/gates";
import { sectionTiles } from "../lib/tiles";

export default function SectionPage() {
  const { id = "" } = useParams();
  const section = getSection(id);

  if (!section || section.id === "search") {
    return <Navigate to="/" replace />;
  }

  return (
    <GateWall section={section}>
      <BoardScreen
        title={section.label}
        action={
          <Link className="see-new" to="/archive">
            查看归档 →
          </Link>
        }
        items={sectionTiles(section.id)}
      />
    </GateWall>
  );
}
