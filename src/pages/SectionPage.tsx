import { Link, Navigate, useParams } from "react-router-dom";
import GateWall from "../components/GateWall";
import MasonryScreen from "../components/MasonryScreen";
import { getSection } from "../lib/gates";
import { sectionMasonryItems } from "../lib/tiles";

export default function SectionPage() {
  const { id = "" } = useParams();
  const section = getSection(id);

  if (!section || section.id === "search") {
    return <Navigate to="/" replace />;
  }

  return (
    <GateWall section={section}>
      <MasonryScreen
        title={section.label}
        action={
          <Link className="see-new" to="/archive">
            查看归档 →
          </Link>
        }
        items={sectionMasonryItems(section.id)}
        empty={section.summary || "这个类别还没有条目。"}
      />
    </GateWall>
  );
}
