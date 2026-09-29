import { Link } from "react-router-dom";
import MasonryScreen from "../components/MasonryScreen";
import { archiveMasonryItems } from "../lib/tiles";

export default function Archive() {
  return (
    <MasonryScreen
      title="归档"
      action={
        <Link className="see-new" to="/">
          返回目录 →
        </Link>
      }
      items={archiveMasonryItems()}
      empty="还没有条目。"
    />
  );
}
