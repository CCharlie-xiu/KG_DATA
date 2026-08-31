import { Link } from "react-router-dom";
import BoardScreen from "../components/BoardScreen";
import { homeTiles } from "../lib/tiles";

export default function Home() {
  return (
    <BoardScreen
      title="全部条目"
      action={
        <Link className="see-new" to="/archive">
          查看归档 →
        </Link>
      }
      items={homeTiles()}
    />
  );
}
