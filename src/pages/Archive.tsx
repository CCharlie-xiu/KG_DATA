import { Link } from "react-router-dom";
import BoardScreen from "../components/BoardScreen";
import { archiveTiles } from "../lib/tiles";

export default function Archive() {
  return (
    <BoardScreen
      title="归档"
      action={
        <Link className="see-new" to="/">
          返回目录 →
        </Link>
      }
      items={archiveTiles()}
    />
  );
}
